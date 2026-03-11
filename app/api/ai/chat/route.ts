import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getSession } from "@/lib/auth";
import { getUserById, getUserCards } from "@/lib/db";
import { CARD_CATALOG } from "@/lib/mock-data/cards";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const MODEL = "claude-sonnet-4-6";

const SYSTEM_PROMPT = `You are CardIQ Support, a friendly and knowledgeable customer support agent for CardIQ — an app that helps people maximize their credit card benefits.

You help users:
- Understand their credit card benefits and how to use them
- Figure out which card to use for specific purchases
- Track and maximize annual credits (dining, travel, streaming, etc.)
- Understand terms and conditions of card benefits
- Navigate the CardIQ app (dashboard, portfolio, optimizer, notifications)

Guidelines:
- Be concise and conversational. Avoid long walls of text.
- If the user asks about their specific cards, reference them by name if provided.
- When discussing dollar amounts, be specific and practical.
- If you don't know something specific about a card, say so and suggest checking the issuer's website.
- Do not give financial, legal, or tax advice. Direct those questions to qualified professionals.
- Keep responses to 2-4 sentences unless a detailed explanation is truly needed.

IMPORTANT DISCLAIMERS:
- You provide general information about credit card benefits, not personalized financial advice.
- Always recommend users verify specific terms and conditions with their card issuer.
- Never make guarantees about financial outcomes or savings amounts.`;

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
    const userCardIds = getUserCards(session.userId);
    if (user && userCardIds.length > 0) {
      const cardNames = userCardIds
        .map((id) => CARD_CATALOG.find((c: { id: string }) => c.id === id)?.name)
        .filter(Boolean);
      userContext = `\n\nThis user (${user.name ?? user.email}) has the following cards: ${cardNames.join(", ")}.`;
    }
  } catch {
    // Non-critical — proceed without user context
  }

  const systemWithContext = SYSTEM_PROMPT + userContext;

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
}
