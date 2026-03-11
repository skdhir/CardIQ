import { NextResponse } from "next/server";
import { getSession, getPortfolioFromCookie } from "@/lib/auth";
import { getUserCardsWithFallback, getBenefitTracking } from "@/lib/db";
import { CARD_CATALOG } from "@/lib/mock-data/cards";
import type { BenefitStatus } from "@/types";

// GET /api/benefits — get benefit tracking state for user's cards
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tracking = getBenefitTracking(session.userId);
  const cardIds = getUserCardsWithFallback(session.userId, getPortfolioFromCookie());

  const benefits = cardIds.flatMap((cardId) => {
    const card = CARD_CATALOG.find((c) => c.id === cardId);
    if (!card) return [];
    return card.benefits.map((b) => {
      const record = tracking[b.id];
      return {
        benefitId: b.id,
        cardId: b.cardId,
        status: (record?.status ?? "unused") as BenefitStatus,
        amountUsed: record?.amountUsed ?? 0,
        dollarValue: b.dollarValue,
      };
    });
  });

  return NextResponse.json({ benefits });
}
