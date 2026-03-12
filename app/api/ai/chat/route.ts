import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSession, getPortfolioFromCookie } from "@/lib/auth";
import { getUserById, getUserCardsWithFallback } from "@/lib/db";
import { CARD_CATALOG } from "@/lib/mock-data/cards";
import { MODEL, SYSTEM_INSTRUCTION } from "@/lib/claude";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const CHAT_ADDENDUM = `

CHAT-SPECIFIC GUIDELINES:
- Be concise and conversational. Keep responses to 2-4 sentences unless a detailed explanation is truly needed.
- If the user asks about their specific cards, reference them by name if provided in the context.
- Help users navigate the CardIQ app (dashboard, portfolio, optimizer, notifications).
- When discussing dollar amounts, be specific and practical.`;

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { messages } = await request.json();
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "Messages required" }, { status: 400 });
  }

  // Build context about the user's cards
  let userContext = "";
  try {
    const user = getUserById(session.userId);
    const userCardIds = getUserCardsWithFallback(session.userId, getPortfolioFromCookie());
    if (user && userCardIds.length > 0) {
      const cardNames = userCardIds
        .map((id) => CARD_CATALOG.find((c: { id: string }) => c.id === id)?.name)
        .filter(Boolean);
      userContext = `\n\nThis user (${user.name ?? user.email}) has the following cards: ${cardNames.join(", ")}.`;
    }
  } catch {
    // Non-critical — proceed without user context
  }

  const systemWithContext = SYSTEM_INSTRUCTION + CHAT_ADDENDUM + userContext;

  // Validate and sanitize messages
  const sanitizedMessages = messages
    .filter(
      (m: { role?: string; content?: string }) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0
    )
    .slice(-20) // Keep last 20 messages for context
    .map((m: { role: string; content: string }) => ({
      role: m.role as "user" | "assistant",
      content: m.content.trim(),
    }));

  if (sanitizedMessages.length === 0) {
    return NextResponse.json({ error: "No valid messages" }, { status: 400 });
  }

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 512,
      system: systemWithContext,
      messages: sanitizedMessages,
    });

    const content = response.content[0];
    if (content.type !== "text") {
      return NextResponse.json({ error: "Unexpected response" }, { status: 500 });
    }

    return NextResponse.json({ reply: content.text });
  } catch (err) {
    console.error("Chat API error:", err);
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: "Chat unavailable", debug: msg },
      { status: 500 }
    );
  }
}
