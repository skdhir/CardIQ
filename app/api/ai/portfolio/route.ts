import { NextResponse } from "next/server";
import { getPortfolioAdvice } from "@/lib/claude";

export async function POST(request: Request) {
  const { cards } = await request.json();

  if (!cards || !Array.isArray(cards)) {
    return NextResponse.json({ error: "Missing cards array" }, { status: 400 });
  }

  try {
    const advice = await getPortfolioAdvice(cards);
    return NextResponse.json({ advice });
  } catch (err) {
    console.error("Claude API error:", err);
    return NextResponse.json(
      { error: "AI advice unavailable" },
      { status: 500 }
    );
  }
}
