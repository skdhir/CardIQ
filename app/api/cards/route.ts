import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { addUserCard, removeUserCard } from "@/lib/db";
import { CARD_CATALOG } from "@/lib/mock-data/cards";

// GET /api/cards — return all cards in the catalog
export async function GET() {
  return NextResponse.json({ cards: CARD_CATALOG });
}

// POST /api/cards — add a card to the user's portfolio
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cardId } = await request.json();
  const card = CARD_CATALOG.find((c) => c.id === cardId);
  if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });

  addUserCard(session.userId, cardId);
  return NextResponse.json({ success: true, card });
}

// DELETE /api/cards?cardId=xxx
export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const cardId = searchParams.get("cardId");
  if (!cardId) return NextResponse.json({ error: "cardId required" }, { status: 400 });

  removeUserCard(session.userId, cardId);
  return NextResponse.json({ success: true });
}
