import { NextResponse } from "next/server";
import { MOCK_TRANSACTIONS } from "@/lib/mock-data/transactions";

// GET /api/transactions — return mock transactions
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const optimal = searchParams.get("optimal");

  let transactions = MOCK_TRANSACTIONS;

  if (category) {
    transactions = transactions.filter((t) => t.category === category);
  }
  if (optimal === "false") {
    transactions = transactions.filter((t) => !t.isOptimal);
  }

  const totalMissed = transactions.reduce((sum, t) => sum + t.missedValue, 0);

  return NextResponse.json({ transactions, totalMissed });
}
