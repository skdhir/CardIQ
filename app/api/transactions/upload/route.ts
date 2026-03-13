import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSession } from "@/lib/auth";
import { getUserCards, saveRawTransactions, getRawTransactions } from "@/lib/db";
import { enrichTransactions, type RawTransaction } from "@/lib/rewards";
import { MODEL } from "@/lib/claude";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const MAX_PDF_SIZE = 10 * 1024 * 1024; // 10 MB

/**
 * POST /api/transactions/upload
 * Body: FormData with { cardId: string, file: File (PDF or CSV) }
 *
 * Accepts a PDF or CSV bank statement, uses Claude to extract and
 * categorize transactions, then enriches with optimal card analysis.
 */
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const cardId = formData.get("cardId") as string;
  const file = formData.get("file") as File | null;

  if (!cardId || !file) {
    return NextResponse.json({ error: "cardId and file required" }, { status: 400 });
  }

  if (file.size > MAX_PDF_SIZE) {
    return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 });
  }

  const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
  const isCSV = file.type === "text/csv" || file.name.toLowerCase().endsWith(".csv");

  if (!isPDF && !isCSV) {
    return NextResponse.json({ error: "Unsupported file type. Upload a PDF or CSV statement." }, { status: 400 });
  }

  const categorizePrompt = `You are parsing a credit card or bank statement. Extract all purchase transactions and categorize each merchant.

For each transaction, output a JSON array of objects with:
- date: string (YYYY-MM-DD format)
- merchant: string (clean merchant name — remove transaction IDs, reference numbers, locations, extra codes)
- amount: number (positive, in dollars)
- category: one of: "dining", "groceries", "travel", "gas", "streaming", "shopping", "drugstore", "other"

Rules:
- Skip pending transactions, payments/credits, fees, interest charges, and returned items
- Only include actual purchases with positive amounts
- Convert dates to YYYY-MM-DD
- Clean up merchant names to be human-readable
- Categorize accurately based on the merchant name
- If a merchant is ambiguous, use "other"

Return ONLY the JSON array, no explanation or markdown.`;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let messages: any[];

    if (isPDF) {
      const buffer = await file.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");

      // The Anthropic API supports document blocks for PDFs.
      // SDK types may lag behind — cast to bypass.
      messages = [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: base64,
              },
            },
            { type: "text", text: categorizePrompt },
          ],
        },
      ];
    } else {
      // CSV: read as text
      const csvText = await file.text();
      const lines = csvText.trim().split("\n").filter((l: string) => l.trim());
      if (lines.length < 2) {
        return NextResponse.json({ error: "CSV must have a header row and at least one data row" }, { status: 400 });
      }

      messages = [
        {
          role: "user",
          content: `${categorizePrompt}\n\nCSV data:\n${lines.slice(0, 101).join("\n")}`,
        },
      ];
    }

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 4096,
      messages,
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected AI response" }, { status: 500 });
    }

    // Parse Claude's response — extract JSON array
    let parsed: Array<{ date: string; merchant: string; amount: number; category: string }>;
    try {
      const jsonText = content.text.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
      parsed = JSON.parse(jsonText);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI response", raw: content.text }, { status: 500 });
    }

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return NextResponse.json({ error: "No transactions found in statement" }, { status: 400 });
    }

    // Build raw transactions
    const rawTxns: RawTransaction[] = parsed
      .filter((t) => t.date && t.merchant && t.amount > 0)
      .map((t) => ({
        date: t.date,
        merchant: t.merchant,
        amount: Math.round(t.amount * 100) / 100,
        category: t.category || "other",
        cardUsed: cardId,
      }));

    // Merge with existing uploaded transactions (from other cards)
    const existing = getRawTransactions(session.userId);
    const otherCards = existing.filter((t) => t.cardUsed !== cardId);
    const merged = [...otherCards, ...rawTxns].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    saveRawTransactions(session.userId, merged);

    // Enrich for preview
    const userCardIds = getUserCards(session.userId);
    const enriched = enrichTransactions(merged, userCardIds);
    const totalMissed = enriched.reduce((sum, t) => sum + t.missedValue, 0);

    return NextResponse.json({
      success: true,
      imported: rawTxns.length,
      total: merged.length,
      transactions: enriched,
      totalMissed,
    });
  } catch (err) {
    console.error("Transaction upload error:", err);
    return NextResponse.json({ error: "Failed to process statement" }, { status: 500 });
  }
}
