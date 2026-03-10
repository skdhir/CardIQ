import { NextResponse } from "next/server";
import { getCardRecommendation } from "@/lib/claude";

export async function POST(request: Request) {
  const { merchant, category, userCards } = await request.json();

  if (!merchant || !category || !userCards) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const recommendation = await getCardRecommendation(merchant, category, userCards);
    return NextResponse.json({ recommendation });
  } catch (err) {
    console.error("Claude API error:", err);
    return NextResponse.json(
      { error: "AI recommendation unavailable" },
      { status: 500 }
    );
  }
}
