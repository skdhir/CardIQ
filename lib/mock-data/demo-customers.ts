/**
 * Demo customer seed data — 3 pre-built accounts for testing/demos.
 *
 * Customer 1 (manual): sarah.chen — Amex Gold, Citi Strata Premier, Marriott Bonvoy
 * Customer 2 (manual): marcus.johnson — 7 cards including Macy's
 * Customer 3 (plaid):  emily.rodriguez — Amex Gold, Chase Sapphire Reserve
 */

import type { Transaction } from "@/types";

export interface DemoCustomer {
  id: string;
  email: string;
  password: string; // plain text — hashed at seed time
  name: string;
  setupMethod: "manual" | "plaid";
  cardIds: string[];
  transactions: Transaction[];
  benefitUsage: Record<string, { status: "used" | "partial" | "unused"; amountUsed: number }>;
}

// ─── Helper to generate transaction IDs ──────────────────────────────────────
let txnCounter = 1000;
function txnId() { return `demo-txn-${txnCounter++}`; }

// ─── CUSTOMER 1: Sarah Chen ───────────────────────────────────────────────────
// Manual setup · Amex Gold, Citi Strata Premier, Marriott Bonvoy Boundless
// Foodie + occasional traveler, lives in NYC

const sarahTransactions: Transaction[] = [
  // 2025
  { id: txnId(), date: "2025-03-05", merchant: "Nobu NYC", amount: 245.00, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-03-03", merchant: "Whole Foods Market", amount: 134.50, category: "groceries", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-02-28", merchant: "Marriott Midtown NYC", amount: 389.00, category: "travel", cardUsed: "marriott-bonvoy-boundless", cardUsedName: "Marriott Bonvoy", optimalCard: "marriott-bonvoy-boundless", optimalCardName: "Marriott Bonvoy", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-02-25", merchant: "Grubhub", amount: 54.20, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-02-20", merchant: "JetBlue Airways", amount: 312.00, category: "travel", cardUsed: "citi-strata-premier", cardUsedName: "Citi Strata Premier", optimalCard: "citi-strata-premier", optimalCardName: "Citi Strata Premier", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-02-15", merchant: "Le Bernardin", amount: 290.00, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-02-10", merchant: "Trader Joe's", amount: 89.40, category: "groceries", cardUsed: "citi-strata-premier", cardUsedName: "Citi Strata Premier", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 2.23, isOptimal: false },
  { id: txnId(), date: "2025-02-05", merchant: "Resy Reservation - Per Se", amount: 425.00, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-01-28", merchant: "Marriott Bonvoy - Miami", amount: 520.00, category: "travel", cardUsed: "marriott-bonvoy-boundless", cardUsedName: "Marriott Bonvoy", optimalCard: "marriott-bonvoy-boundless", optimalCardName: "Marriott Bonvoy", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-01-22", merchant: "Shake Shack", amount: 32.50, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-01-18", merchant: "CitiTravel.com - Hotel", amount: 650.00, category: "travel", cardUsed: "citi-strata-premier", cardUsedName: "Citi Strata Premier", optimalCard: "citi-strata-premier", optimalCardName: "Citi Strata Premier", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-01-10", merchant: "Eataly NYC", amount: 78.60, category: "groceries", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },

  // 2024
  { id: txnId(), date: "2024-12-24", merchant: "Eleven Madison Park", amount: 380.00, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-12-20", merchant: "Marriott Bonvoy - Cancun", amount: 1240.00, category: "travel", cardUsed: "marriott-bonvoy-boundless", cardUsedName: "Marriott Bonvoy", optimalCard: "marriott-bonvoy-boundless", optimalCardName: "Marriott Bonvoy", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-12-15", merchant: "Whole Foods", amount: 210.30, category: "groceries", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-11-28", merchant: "American Airlines", amount: 480.00, category: "travel", cardUsed: "citi-strata-premier", cardUsedName: "Citi Strata Premier", optimalCard: "citi-strata-premier", optimalCardName: "Citi Strata Premier", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-11-15", merchant: "Grubhub", amount: 48.75, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-10-30", merchant: "Marriott Bonvoy - Chicago", amount: 695.00, category: "travel", cardUsed: "marriott-bonvoy-boundless", cardUsedName: "Marriott Bonvoy", optimalCard: "marriott-bonvoy-boundless", optimalCardName: "Marriott Bonvoy", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-10-18", merchant: "Cosme Restaurant", amount: 198.00, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-09-22", merchant: "JetBlue - Boston", amount: 189.00, category: "travel", cardUsed: "citi-strata-premier", cardUsedName: "Citi Strata Premier", optimalCard: "citi-strata-premier", optimalCardName: "Citi Strata Premier", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-09-10", merchant: "Trader Joe's", amount: 145.20, category: "groceries", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-08-15", merchant: "Marriott Bonvoy - LA", amount: 890.00, category: "travel", cardUsed: "marriott-bonvoy-boundless", cardUsedName: "Marriott Bonvoy", optimalCard: "marriott-bonvoy-boundless", optimalCardName: "Marriott Bonvoy", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-07-04", merchant: "Nobu Malibu", amount: 320.00, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-06-20", merchant: "Five Guys", amount: 28.40, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-05-12", merchant: "Marriott Bonvoy - Tokyo", amount: 1850.00, category: "travel", cardUsed: "marriott-bonvoy-boundless", cardUsedName: "Marriott Bonvoy", optimalCard: "marriott-bonvoy-boundless", optimalCardName: "Marriott Bonvoy", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-04-08", merchant: "Whole Foods", amount: 167.80, category: "groceries", cardUsed: "citi-strata-premier", cardUsedName: "Citi Strata Premier", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 4.19, isOptimal: false },
  { id: txnId(), date: "2024-03-18", merchant: "The Cheesecake Factory", amount: 112.50, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-02-14", merchant: "Per Se", amount: 650.00, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-01-20", merchant: "American Airlines", amount: 740.00, category: "travel", cardUsed: "citi-strata-premier", cardUsedName: "Citi Strata Premier", optimalCard: "citi-strata-premier", optimalCardName: "Citi Strata Premier", missedValue: 0, isOptimal: true },

  // 2023
  { id: txnId(), date: "2023-12-22", merchant: "Marriott - NYC Times Square", amount: 980.00, category: "travel", cardUsed: "marriott-bonvoy-boundless", cardUsedName: "Marriott Bonvoy", optimalCard: "marriott-bonvoy-boundless", optimalCardName: "Marriott Bonvoy", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-11-20", merchant: "Nobu NYC", amount: 275.00, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-10-05", merchant: "JetBlue - Chicago", amount: 220.00, category: "travel", cardUsed: "citi-strata-premier", cardUsedName: "Citi Strata Premier", optimalCard: "citi-strata-premier", optimalCardName: "Citi Strata Premier", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-09-15", merchant: "Grubhub", amount: 67.90, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-08-10", merchant: "Marriott Bonvoy - Paris", amount: 2100.00, category: "travel", cardUsed: "marriott-bonvoy-boundless", cardUsedName: "Marriott Bonvoy", optimalCard: "marriott-bonvoy-boundless", optimalCardName: "Marriott Bonvoy", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-07-04", merchant: "Shake Shack", amount: 41.20, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-06-18", merchant: "Whole Foods", amount: 198.40, category: "groceries", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-05-22", merchant: "Delta Airlines", amount: 560.00, category: "travel", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "citi-strata-premier", optimalCardName: "Citi Strata Premier", missedValue: 5.60, isOptimal: false },
  { id: txnId(), date: "2023-04-12", merchant: "Cosme Restaurant", amount: 215.00, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-03-08", merchant: "Trader Joe's", amount: 112.60, category: "groceries", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
];

// ─── CUSTOMER 2: Marcus Johnson ───────────────────────────────────────────────
// Manual setup · 7 cards: Amex Platinum, Chase Sapphire Reserve, Capital One Savor,
// Wells Fargo Active Cash, Delta SkyMiles Gold, Discover It, Macy's
// Heavy traveler + entertainment spender, lives in Atlanta

const marcusTransactions: Transaction[] = [
  // 2025
  { id: txnId(), date: "2025-03-06", merchant: "Delta Airlines - NYC", amount: 620.00, category: "travel", cardUsed: "delta-skymiles-gold", cardUsedName: "Delta SkyMiles Gold", optimalCard: "delta-skymiles-gold", optimalCardName: "Delta SkyMiles Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-03-04", merchant: "Nobu Atlanta", amount: 310.00, category: "dining", cardUsed: "capital-one-savor", cardUsedName: "Capital One Savor", optimalCard: "capital-one-savor", optimalCardName: "Capital One Savor", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-03-01", merchant: "Macy's", amount: 289.00, category: "shopping", cardUsed: "macys-credit-card", cardUsedName: "Macy's Credit Card", optimalCard: "macys-credit-card", optimalCardName: "Macy's Credit Card", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-02-26", merchant: "Centurion Lounge ATL", amount: 0, category: "travel", cardUsed: "amex-platinum", cardUsedName: "Amex Platinum", optimalCard: "amex-platinum", optimalCardName: "Amex Platinum", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-02-22", merchant: "Amazon", amount: 456.90, category: "shopping", cardUsed: "discover-it-cash-back", cardUsedName: "Discover It", optimalCard: "discover-it-cash-back", optimalCardName: "Discover It", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-02-18", merchant: "Movie Tavern Atlanta", amount: 87.50, category: "entertainment", cardUsed: "capital-one-savor", cardUsedName: "Capital One Savor", optimalCard: "capital-one-savor", optimalCardName: "Capital One Savor", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-02-14", merchant: "The Optimist Restaurant", amount: 320.00, category: "dining", cardUsed: "capital-one-savor", cardUsedName: "Capital One Savor", optimalCard: "capital-one-savor", optimalCardName: "Capital One Savor", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-02-10", merchant: "Delta Airlines - LA", amount: 890.00, category: "travel", cardUsed: "wells-fargo-active-cash", cardUsedName: "Wells Fargo Active Cash", optimalCard: "delta-skymiles-gold", optimalCardName: "Delta SkyMiles Gold", missedValue: 8.90, isOptimal: false },
  { id: txnId(), date: "2025-02-05", merchant: "Uber Cash (Amex)", amount: 38.00, category: "travel", cardUsed: "amex-platinum", cardUsedName: "Amex Platinum", optimalCard: "amex-platinum", optimalCardName: "Amex Platinum", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-01-30", merchant: "Macy's - Suits", amount: 645.00, category: "shopping", cardUsed: "macys-credit-card", cardUsedName: "Macy's Credit Card", optimalCard: "macys-credit-card", optimalCardName: "Macy's Credit Card", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-01-25", merchant: "Marriott Buckhead Atlanta", amount: 540.00, category: "travel", cardUsed: "chase-sapphire-reserve", cardUsedName: "Chase Sapphire Reserve", optimalCard: "chase-sapphire-reserve", optimalCardName: "Chase Sapphire Reserve", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-01-18", merchant: "Delta SkyClub", amount: 0, category: "travel", cardUsed: "delta-skymiles-gold", cardUsedName: "Delta SkyMiles Gold", optimalCard: "delta-skymiles-gold", optimalCardName: "Delta SkyMiles Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-01-12", merchant: "Costco Gas", amount: 95.00, category: "gas", cardUsed: "wells-fargo-active-cash", cardUsedName: "Wells Fargo Active Cash", optimalCard: "wells-fargo-active-cash", optimalCardName: "Wells Fargo Active Cash", missedValue: 0, isOptimal: true },

  // 2024
  { id: txnId(), date: "2024-12-20", merchant: "Delta - Christmas Travel", amount: 1240.00, category: "travel", cardUsed: "delta-skymiles-gold", cardUsedName: "Delta SkyMiles Gold", optimalCard: "delta-skymiles-gold", optimalCardName: "Delta SkyMiles Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-12-15", merchant: "Macy's Holiday Shopping", amount: 1100.00, category: "shopping", cardUsed: "macys-credit-card", cardUsedName: "Macy's Credit Card", optimalCard: "macys-credit-card", optimalCardName: "Macy's Credit Card", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-11-25", merchant: "Whole Foods Thanksgiving", amount: 340.00, category: "groceries", cardUsed: "wells-fargo-active-cash", cardUsedName: "Wells Fargo Active Cash", optimalCard: "wells-fargo-active-cash", optimalCardName: "Wells Fargo Active Cash", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-11-10", merchant: "Regal Cinema Atlanta", amount: 68.00, category: "entertainment", cardUsed: "capital-one-savor", cardUsedName: "Capital One Savor", optimalCard: "capital-one-savor", optimalCardName: "Capital One Savor", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-10-18", merchant: "AmexTravel.com - Hotel", amount: 890.00, category: "travel", cardUsed: "amex-platinum", cardUsedName: "Amex Platinum", optimalCard: "amex-platinum", optimalCardName: "Amex Platinum", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-09-22", merchant: "Discover Q3 - Groceries", amount: 450.00, category: "groceries", cardUsed: "discover-it-cash-back", cardUsedName: "Discover It", optimalCard: "discover-it-cash-back", optimalCardName: "Discover It", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-08-30", merchant: "Delta Airlines - Europe", amount: 2100.00, category: "travel", cardUsed: "delta-skymiles-gold", cardUsedName: "Delta SkyMiles Gold", optimalCard: "delta-skymiles-gold", optimalCardName: "Delta SkyMiles Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-07-15", merchant: "Six Flags Georgia", amount: 180.00, category: "entertainment", cardUsed: "capital-one-savor", cardUsedName: "Capital One Savor", optimalCard: "capital-one-savor", optimalCardName: "Capital One Savor", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-06-20", merchant: "Macy's Summer Sale", amount: 520.00, category: "shopping", cardUsed: "macys-credit-card", cardUsedName: "Macy's Credit Card", optimalCard: "macys-credit-card", optimalCardName: "Macy's Credit Card", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-05-12", merchant: "Chase Sapphire Reserve Travel", amount: 1500.00, category: "travel", cardUsed: "chase-sapphire-reserve", cardUsedName: "Chase Sapphire Reserve", optimalCard: "chase-sapphire-reserve", optimalCardName: "Chase Sapphire Reserve", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-04-08", merchant: "CLEAR Membership", amount: 189.00, category: "travel", cardUsed: "amex-platinum", cardUsedName: "Amex Platinum", optimalCard: "amex-platinum", optimalCardName: "Amex Platinum", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-03-22", merchant: "Saks Fifth Avenue", amount: 310.00, category: "shopping", cardUsed: "amex-platinum", cardUsedName: "Amex Platinum", optimalCard: "amex-platinum", optimalCardName: "Amex Platinum", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-02-14", merchant: "Bones Atlanta", amount: 380.00, category: "dining", cardUsed: "capital-one-savor", cardUsedName: "Capital One Savor", optimalCard: "capital-one-savor", optimalCardName: "Capital One Savor", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-01-18", merchant: "Delta - New Year", amount: 840.00, category: "travel", cardUsed: "discover-it-cash-back", cardUsedName: "Discover It", optimalCard: "delta-skymiles-gold", optimalCardName: "Delta SkyMiles Gold", missedValue: 8.40, isOptimal: false },

  // 2023
  { id: txnId(), date: "2023-12-23", merchant: "Macy's Christmas", amount: 1350.00, category: "shopping", cardUsed: "macys-credit-card", cardUsedName: "Macy's Credit Card", optimalCard: "macys-credit-card", optimalCardName: "Macy's Credit Card", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-11-22", merchant: "Delta - Thanksgiving", amount: 680.00, category: "travel", cardUsed: "delta-skymiles-gold", cardUsedName: "Delta SkyMiles Gold", optimalCard: "delta-skymiles-gold", optimalCardName: "Delta SkyMiles Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-10-14", merchant: "AmexTravel Hotel - Cancun", amount: 2200.00, category: "travel", cardUsed: "amex-platinum", cardUsedName: "Amex Platinum", optimalCard: "amex-platinum", optimalCardName: "Amex Platinum", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-09-08", merchant: "World of Coca-Cola", amount: 95.00, category: "entertainment", cardUsed: "capital-one-savor", cardUsedName: "Capital One Savor", optimalCard: "capital-one-savor", optimalCardName: "Capital One Savor", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-08-15", merchant: "Kroger", amount: 310.00, category: "groceries", cardUsed: "wells-fargo-active-cash", cardUsedName: "Wells Fargo Active Cash", optimalCard: "wells-fargo-active-cash", optimalCardName: "Wells Fargo Active Cash", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-07-04", merchant: "Piedmont Park Event", amount: 150.00, category: "entertainment", cardUsed: "capital-one-savor", cardUsedName: "Capital One Savor", optimalCard: "capital-one-savor", optimalCardName: "Capital One Savor", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-06-20", merchant: "Delta - Summer Europe", amount: 3200.00, category: "travel", cardUsed: "delta-skymiles-gold", cardUsedName: "Delta SkyMiles Gold", optimalCard: "delta-skymiles-gold", optimalCardName: "Delta SkyMiles Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-05-12", merchant: "Macy's Spring", amount: 430.00, category: "shopping", cardUsed: "macys-credit-card", cardUsedName: "Macy's Credit Card", optimalCard: "macys-credit-card", optimalCardName: "Macy's Credit Card", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-04-18", merchant: "Buckhead dining", amount: 245.00, category: "dining", cardUsed: "capital-one-savor", cardUsedName: "Capital One Savor", optimalCard: "capital-one-savor", optimalCardName: "Capital One Savor", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-03-10", merchant: "Delta - Spring Break", amount: 1100.00, category: "travel", cardUsed: "delta-skymiles-gold", cardUsedName: "Delta SkyMiles Gold", optimalCard: "delta-skymiles-gold", optimalCardName: "Delta SkyMiles Gold", missedValue: 0, isOptimal: true },
];

// ─── CUSTOMER 3: Emily Rodriguez ──────────────────────────────────────────────
// Plaid connected · Amex Gold, Chase Sapphire Reserve
// Young professional, San Francisco, dining + travel

const emilyTransactions: Transaction[] = [
  // 2025
  { id: txnId(), date: "2025-03-05", merchant: "Tartine Bakery", amount: 42.50, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-03-02", merchant: "United Airlines - NYC", amount: 480.00, category: "travel", cardUsed: "chase-sapphire-reserve", cardUsedName: "Chase Sapphire Reserve", optimalCard: "chase-sapphire-reserve", optimalCardName: "Chase Sapphire Reserve", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-02-28", merchant: "Whole Foods SF", amount: 98.70, category: "groceries", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-02-22", merchant: "Benu Restaurant", amount: 425.00, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-02-18", merchant: "Uber", amount: 28.90, category: "travel", cardUsed: "chase-sapphire-reserve", cardUsedName: "Chase Sapphire Reserve", optimalCard: "chase-sapphire-reserve", optimalCardName: "Chase Sapphire Reserve", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-02-14", merchant: "State Bird Provisions", amount: 210.00, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-02-08", merchant: "Alaska Airlines", amount: 320.00, category: "travel", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "chase-sapphire-reserve", optimalCardName: "Chase Sapphire Reserve", missedValue: 3.20, isOptimal: false },
  { id: txnId(), date: "2025-01-28", merchant: "Grubhub SF", amount: 55.40, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-01-22", merchant: "Airbnb - LA", amount: 680.00, category: "travel", cardUsed: "chase-sapphire-reserve", cardUsedName: "Chase Sapphire Reserve", optimalCard: "chase-sapphire-reserve", optimalCardName: "Chase Sapphire Reserve", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2025-01-15", merchant: "Trader Joe's", amount: 87.30, category: "groceries", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },

  // 2024
  { id: txnId(), date: "2024-12-24", merchant: "Atelier Crenn", amount: 580.00, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-12-20", merchant: "United - Holiday Travel", amount: 890.00, category: "travel", cardUsed: "chase-sapphire-reserve", cardUsedName: "Chase Sapphire Reserve", optimalCard: "chase-sapphire-reserve", optimalCardName: "Chase Sapphire Reserve", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-12-10", merchant: "SFO Priority Pass Lounge", amount: 0, category: "travel", cardUsed: "chase-sapphire-reserve", cardUsedName: "Chase Sapphire Reserve", optimalCard: "chase-sapphire-reserve", optimalCardName: "Chase Sapphire Reserve", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-11-22", merchant: "Whole Foods Thanksgiving", amount: 245.00, category: "groceries", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-10-15", merchant: "Lazy Bear SF", amount: 380.00, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-09-20", merchant: "Airbnb - NYC", amount: 1100.00, category: "travel", cardUsed: "chase-sapphire-reserve", cardUsedName: "Chase Sapphire Reserve", optimalCard: "chase-sapphire-reserve", optimalCardName: "Chase Sapphire Reserve", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-08-14", merchant: "Uber Eats SF", amount: 48.90, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-07-04", merchant: "Saison SF", amount: 490.00, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-06-15", merchant: "United - Japan", amount: 1800.00, category: "travel", cardUsed: "chase-sapphire-reserve", cardUsedName: "Chase Sapphire Reserve", optimalCard: "chase-sapphire-reserve", optimalCardName: "Chase Sapphire Reserve", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-05-08", merchant: "Resy - Quince SF", amount: 340.00, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-04-12", merchant: "Lyft", amount: 34.50, category: "travel", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "chase-sapphire-reserve", optimalCardName: "Chase Sapphire Reserve", missedValue: 0.35, isOptimal: false },
  { id: txnId(), date: "2024-03-18", merchant: "The French Laundry", amount: 780.00, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-02-14", merchant: "Californios SF", amount: 420.00, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2024-01-20", merchant: "Alaska Airlines - Seattle", amount: 280.00, category: "travel", cardUsed: "chase-sapphire-reserve", cardUsedName: "Chase Sapphire Reserve", optimalCard: "chase-sapphire-reserve", optimalCardName: "Chase Sapphire Reserve", missedValue: 0, isOptimal: true },

  // 2023
  { id: txnId(), date: "2023-12-22", merchant: "Napa Valley Trip", amount: 1650.00, category: "travel", cardUsed: "chase-sapphire-reserve", cardUsedName: "Chase Sapphire Reserve", optimalCard: "chase-sapphire-reserve", optimalCardName: "Chase Sapphire Reserve", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-11-18", merchant: "Eleven Madison Park NY", amount: 620.00, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-10-10", merchant: "United - Chicago", amount: 390.00, category: "travel", cardUsed: "chase-sapphire-reserve", cardUsedName: "Chase Sapphire Reserve", optimalCard: "chase-sapphire-reserve", optimalCardName: "Chase Sapphire Reserve", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-09-14", merchant: "Bix Restaurant SF", amount: 195.00, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-08-08", merchant: "Uber Eats", amount: 62.30, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-07-04", merchant: "Airbnb - Tahoe", amount: 850.00, category: "travel", cardUsed: "chase-sapphire-reserve", cardUsedName: "Chase Sapphire Reserve", optimalCard: "chase-sapphire-reserve", optimalCardName: "Chase Sapphire Reserve", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-06-15", merchant: "Whole Foods", amount: 134.80, category: "groceries", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-05-20", merchant: "United Airlines - Hawaii", amount: 960.00, category: "travel", cardUsed: "chase-sapphire-reserve", cardUsedName: "Chase Sapphire Reserve", optimalCard: "chase-sapphire-reserve", optimalCardName: "Chase Sapphire Reserve", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-04-12", merchant: "Quince SF", amount: 360.00, category: "dining", cardUsed: "amex-gold", cardUsedName: "Amex Gold", optimalCard: "amex-gold", optimalCardName: "Amex Gold", missedValue: 0, isOptimal: true },
  { id: txnId(), date: "2023-03-08", merchant: "SFO Priority Pass", amount: 0, category: "travel", cardUsed: "chase-sapphire-reserve", cardUsedName: "Chase Sapphire Reserve", optimalCard: "chase-sapphire-reserve", optimalCardName: "Chase Sapphire Reserve", missedValue: 0, isOptimal: true },
];

// ─── Exported demo customers ──────────────────────────────────────────────────
export const DEMO_CUSTOMERS: DemoCustomer[] = [
  {
    id: "demo-customer-1",
    email: "sarah.chen@demo.com",
    password: "Demo1234!",
    name: "Sarah Chen",
    setupMethod: "manual",
    cardIds: ["amex-gold", "citi-strata-premier", "marriott-bonvoy-boundless"],
    transactions: sarahTransactions,
    benefitUsage: {
      "amex-gold-uber-cash": { status: "used",   amountUsed: 120 },
      "amex-gold-dining":    { status: "used",   amountUsed: 120 },
      "amex-gold-resy":      { status: "used",   amountUsed: 100 },
      "amex-gold-dunkin":    { status: "unused", amountUsed: 0   },
      "citi-hotel-credit":   { status: "used",   amountUsed: 100 },
      "bonvoy-free-night":   { status: "used",   amountUsed: 150 },
      "bonvoy-silver":       { status: "used",   amountUsed: 50  },
    },
  },
  {
    id: "demo-customer-2",
    email: "marcus.johnson@demo.com",
    password: "Demo1234!",
    name: "Marcus Johnson",
    setupMethod: "manual",
    cardIds: ["amex-platinum", "chase-sapphire-reserve", "capital-one-savor", "wells-fargo-active-cash", "delta-skymiles-gold", "discover-it-cash-back", "macys-credit-card"],
    transactions: marcusTransactions,
    benefitUsage: {
      "amex-plat-uber-cash":  { status: "used",    amountUsed: 200 },
      "amex-plat-airline":    { status: "used",    amountUsed: 200 },
      "amex-plat-hotel":      { status: "partial", amountUsed: 100 },
      "amex-plat-clear":      { status: "used",    amountUsed: 189 },
      "amex-plat-walmart":    { status: "unused",  amountUsed: 0   },
      "amex-plat-digital":    { status: "partial", amountUsed: 120 },
      "amex-plat-saks":       { status: "used",    amountUsed: 100 },
      "amex-plat-lounge":     { status: "used",    amountUsed: 300 },
      "csr-travel-credit":    { status: "used",    amountUsed: 300 },
      "csr-lounge":           { status: "used",    amountUsed: 250 },
      "csr-dining":           { status: "unused",  amountUsed: 0   },
      "csr-rental-car":       { status: "unused",  amountUsed: 0   },
      "wfac-cell-protection": { status: "unused",  amountUsed: 0   },
      "delta-checked-bag":    { status: "used",    amountUsed: 180 },
      "delta-flight-credit":  { status: "used",    amountUsed: 200 },
      "discover-5pct-q2":     { status: "used",    amountUsed: 75  },
      "macys-star-rewards":   { status: "used",    amountUsed: 60  },
      "macys-birthday":       { status: "used",    amountUsed: 25  },
    },
  },
  {
    id: "demo-customer-3",
    email: "emily.rodriguez@demo.com",
    password: "Demo1234!",
    name: "Emily Rodriguez",
    setupMethod: "plaid",
    cardIds: ["amex-gold", "chase-sapphire-reserve"],
    transactions: emilyTransactions,
    benefitUsage: {
      "amex-gold-uber-cash": { status: "partial", amountUsed: 60  },
      "amex-gold-dining":    { status: "used",    amountUsed: 120 },
      "amex-gold-resy":      { status: "used",    amountUsed: 100 },
      "amex-gold-dunkin":    { status: "unused",  amountUsed: 0   },
      "csr-travel-credit":   { status: "used",    amountUsed: 300 },
      "csr-lounge":          { status: "used",    amountUsed: 250 },
      "csr-dining":          { status: "unused",  amountUsed: 0   },
      "csr-rental-car":      { status: "unused",  amountUsed: 0   },
    },
  },
];
