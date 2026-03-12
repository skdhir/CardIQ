import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getUserCards, addUserCard, removeUserCard } from "@/lib/db";
import { CARD_CATALOG } from "@/lib/mock-data/cards";

// GET /api/cards/user — return the current user's active cards with full benefit data
export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cardIds = getUserCards(session.userId);
  const cards = cardIds.map((id) => CARD_CATALOG.find((c) => c.id === id)).filter(Boolean);

  return NextResponse.json({ cards });
}

// POST /api/cards/user — add a card to the user's portfolio
export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { cardId } = await request.json();
  if (!cardId) return NextResponse.json({ error: "cardId required" }, { status: 400 });

  const card = CARD_CATALOG.find((c) => c.id === cardId);
  if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });

  addUserCard(session.userId, cardId);
  return NextResponse.json({ success: true });
}

// DELETE /api/cards/user?cardId=xxx — remove a card from the user's portfolio
export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const cardId = searchParams.get("cardId");
  if (!cardId) return NextResponse.json({ error: "cardId required" }, { status: 400 });

  removeUserCard(session.userId, cardId);
  return NextResponse.json({ success: true });
}
