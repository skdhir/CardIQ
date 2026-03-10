import { NextResponse } from "next/server";
import { explainBenefit } from "@/lib/claude";

export async function POST(request: Request) {
  const { benefitName, cardName, description, redemptionInstructions } =
    await request.json();

  if (!benefitName || !cardName) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const explanation = await explainBenefit(
      benefitName,
      cardName,
      description,
      redemptionInstructions
    );
    return NextResponse.json({ explanation });
  } catch (err) {
    console.error("Claude API error:", err);
    return NextResponse.json(
      { error: "AI explanation unavailable" },
      { status: 500 }
    );
  }
}
