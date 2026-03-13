import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getRawTransactions, getUserCards } from "@/lib/db";
import { enrichTransactions } from "@/lib/rewards";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data/transactions";

// GET /api/transactions — return user's uploaded transactions, or mock data as fallback
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const optimal = searchParams.get("optimal");

  // Return uploaded transactions for real users, mock data only for demo accounts
  const session = await getSession();
  let transactions: typeof MOCK_TRANSACTIONS = [];

  if (session) {
    const raw = getRawTransactions(session.userId);
    if (raw.length > 0) {
      const userCardIds = getUserCards(session.userId);
      transactions = enrichTransactions(raw, userCardIds);
    } else if (session.userId.startsWith("demo-")) {
      // Demo accounts get mock data as a fallback
      transactions = MOCK_TRANSACTIONS;
    }
  }

  if (category) {
    transactions = transactions.filter((t) => t.category === category);
  }
  if (optimal === "false") {
    transactions = transactions.filter((t) => !t.isOptimal);
  }

  const totalMissed = transactions.reduce((sum, t) => sum + t.missedValue, 0);

  return NextResponse.json({ transactions, totalMissed });
}
