import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const MODEL = "claude-sonnet-4-5-20250929";

export async function explainBenefit(
  benefitName: string,
  cardName: string,
  description: string,
  redemptionInstructions: string
): Promise<string> {
  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 512,
    messages: [
      {
        role: "user",
        content: `You are a helpful credit card benefits advisor. Explain this credit card benefit clearly and conversationally in 2-3 sentences. Include any important tips for maximizing it.

Card: ${cardName}
Benefit: ${benefitName}
Description: ${description}
Redemption: ${redemptionInstructions}

Give a clear, friendly explanation focused on practical value for the cardholder.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === "text") return content.text;
  return description;
}

export async function getCardRecommendation(
  merchant: string,
  category: string,
  userCards: { id: string; name: string; rewards: string }[]
): Promise<string> {
  const cardList = userCards
    .map((c) => `- ${c.name}: ${c.rewards}`)
    .join("\n");

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 300,
    messages: [
      {
        role: "user",
        content: `You are a credit card optimization expert. Based on the user's cards and a specific purchase, recommend the best card to use.

Purchase: ${merchant} (${category})

User's cards:
${cardList}

Give a direct recommendation in 1-2 sentences. Name the specific card and explain why in simple terms.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === "text") return content.text;
  return "Use the card with the highest rewards rate for this category.";
}

export async function getPortfolioAdvice(
  cards: {
    name: string;
    annualFee: number;
    capturedValue: number;
    captureRate: number;
  }[]
): Promise<string> {
  const cardSummary = cards
    .map(
      (c) =>
        `- ${c.name}: $${c.annualFee}/yr fee, $${c.capturedValue} captured (${c.captureRate}% capture rate)`
    )
    .join("\n");

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content: `You are a credit card portfolio advisor. Analyze this user's card portfolio and give concise, actionable advice.

Portfolio:
${cardSummary}

For each card, give a brief recommendation (keep/downgrade/evaluate) with a one-sentence rationale. Then give an overall portfolio summary in 2 sentences. Be direct and specific about dollar amounts.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type === "text") return content.text;
  return "Review each card's annual fee against captured benefits to determine ROI.";
}
