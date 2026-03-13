/**
 * Reward rates per card per spending category.
 * Values are in cents-per-dollar (e.g., 4 = 4% / 4x points worth ~4 cents).
 * Used to calculate which card is optimal for a given transaction.
 */

import type { Transaction } from "@/types";
import { CARD_CATALOG } from "@/lib/mock-data/cards";

// Card ID → Category → reward rate (cents per dollar)
const REWARD_RATES: Record<string, Record<string, number>> = {
  // Premium
  "amex-platinum":         { travel: 5, flights: 5, dining: 1, groceries: 1, gas: 1, shopping: 1, streaming: 1, drugstore: 1, other: 1 },
  "chase-sapphire-reserve":{ travel: 3, flights: 3, dining: 3, groceries: 1, gas: 1, shopping: 1, streaming: 1, drugstore: 1, other: 1 },
  "capital-one-venture-x": { travel: 2, flights: 2, dining: 2, groceries: 2, gas: 2, shopping: 2, streaming: 2, drugstore: 2, other: 2 },

  // Mid-tier
  "chase-sapphire-preferred":{ travel: 2, flights: 5, dining: 3, groceries: 1, gas: 1, shopping: 1, streaming: 3, drugstore: 1, other: 1 },
  "amex-gold":             { travel: 3, flights: 3, dining: 4, groceries: 4, gas: 1, shopping: 1, streaming: 1, drugstore: 1, other: 1 },
  "capital-one-venture":   { travel: 2, flights: 2, dining: 2, groceries: 2, gas: 2, shopping: 2, streaming: 2, drugstore: 2, other: 2 },
  "citi-strata-premier":   { travel: 3, flights: 3, dining: 3, groceries: 3, gas: 3, shopping: 1, streaming: 1, drugstore: 1, other: 1 },

  // Cash back
  "chase-freedom-unlimited": { travel: 1.5, flights: 1.5, dining: 3, groceries: 1.5, gas: 1.5, shopping: 1.5, streaming: 1.5, drugstore: 3, other: 1.5 },
  "chase-freedom-flex":      { travel: 1, flights: 1, dining: 3, groceries: 1, gas: 1, shopping: 1, streaming: 1, drugstore: 3, other: 1 },
  "citi-double-cash":        { travel: 2, flights: 2, dining: 2, groceries: 2, gas: 2, shopping: 2, streaming: 2, drugstore: 2, other: 2 },
  "wells-fargo-active-cash": { travel: 2, flights: 2, dining: 2, groceries: 2, gas: 2, shopping: 2, streaming: 2, drugstore: 2, other: 2 },
  "capital-one-savor":       { travel: 1, flights: 1, dining: 4, groceries: 3, gas: 1, shopping: 1, streaming: 4, drugstore: 1, other: 1 },
  "discover-it-cash-back":   { travel: 1, flights: 1, dining: 1, groceries: 1, gas: 1, shopping: 1, streaming: 1, drugstore: 1, other: 1 },
  "amex-blue-cash-preferred":{ travel: 1, flights: 1, dining: 1, groceries: 6, gas: 3, shopping: 1, streaming: 6, drugstore: 1, other: 1 },
  "amex-blue-cash-everyday": { travel: 1, flights: 1, dining: 1, groceries: 3, gas: 1, shopping: 1, streaming: 1, drugstore: 1, other: 1 },
  "capital-one-quicksilver": { travel: 1.5, flights: 1.5, dining: 1.5, groceries: 1.5, gas: 1.5, shopping: 1.5, streaming: 1.5, drugstore: 1.5, other: 1.5 },
  "bofa-customized-cash":    { travel: 1, flights: 1, dining: 3, groceries: 1, gas: 3, shopping: 1, streaming: 1, drugstore: 3, other: 1 },
  "macys-credit-card":       { travel: 1, flights: 1, dining: 1, groceries: 1, gas: 1, shopping: 3, streaming: 1, drugstore: 1, other: 1 },

  // Hotel & Airline
  "marriott-bonvoy-boundless":{ travel: 2, flights: 1, dining: 1, groceries: 1, gas: 1, shopping: 1, streaming: 1, drugstore: 1, other: 1 },
  "delta-skymiles-gold":     { travel: 2, flights: 2, dining: 2, groceries: 1, gas: 1, shopping: 1, streaming: 1, drugstore: 1, other: 1 },
  "world-of-hyatt":          { travel: 2, flights: 1, dining: 1, groceries: 1, gas: 1, shopping: 1, streaming: 1, drugstore: 1, other: 1 },
};

function getRewardRate(cardId: string, category: string): number {
  const rates = REWARD_RATES[cardId];
  if (!rates) return 1; // default 1%
  return rates[category] ?? rates["other"] ?? 1;
}

function getCardName(cardId: string): string {
  return CARD_CATALOG.find((c) => c.id === cardId)?.name ?? cardId;
}

export interface RawTransaction {
  date: string;
  merchant: string;
  amount: number;
  category: string;
  cardUsed: string; // card ID
}

/**
 * Enrich raw transactions with optimal card analysis.
 * For each transaction, finds the best card from the user's portfolio.
 */
export function enrichTransactions(
  raw: RawTransaction[],
  userCardIds: string[]
): Transaction[] {
  return raw.map((r, i) => {
    let bestCard = r.cardUsed;
    let bestRate = getRewardRate(r.cardUsed, r.category);

    for (const cid of userCardIds) {
      const rate = getRewardRate(cid, r.category);
      if (rate > bestRate) {
        bestRate = rate;
        bestCard = cid;
      }
    }

    const usedRate = getRewardRate(r.cardUsed, r.category);
    const missedValue = Math.round((bestRate - usedRate) * r.amount) / 100;

    return {
      id: `txn-upload-${i}`,
      date: r.date,
      merchant: r.merchant,
      amount: r.amount,
      category: r.category,
      cardUsed: r.cardUsed,
      cardUsedName: getCardName(r.cardUsed),
      optimalCard: bestCard,
      optimalCardName: getCardName(bestCard),
      missedValue: Math.max(0, missedValue),
      isOptimal: bestCard === r.cardUsed,
    };
  });
}
