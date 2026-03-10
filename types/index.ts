export type BenefitStatus = "unused" | "partial" | "used" | "expired";
export type ResetFrequency = "monthly" | "quarterly" | "semi-annual" | "annual" | "one-time";
export type BenefitCategory =
  | "statement-credit"
  | "lounge"
  | "insurance"
  | "status"
  | "bonus"
  | "rewards"
  | "protection"
  | "membership";

export type CardTier = "premium" | "mid-tier" | "cash-back" | "hotel-airline";

export interface CardBenefit {
  id: string;
  cardId: string;
  name: string;
  description: string;
  dollarValue: number;
  resetFrequency: ResetFrequency;
  resetMonths?: number[]; // e.g. [1, 7] for Jan + Jul
  category: BenefitCategory;
  activationRequired: boolean;
  redemptionInstructions: string;
  expiresAt?: string; // ISO date string for current period expiry
}

export interface CardCatalogEntry {
  id: string;
  name: string;
  issuer: string;
  annualFee: number;
  tier: CardTier;
  verified: boolean;
  color: string; // tailwind gradient class
  benefits: CardBenefit[];
}

export interface UserCard {
  id: string;
  userId: string;
  cardId: string;
  addedAt: string;
  isActive: boolean;
  card: CardCatalogEntry;
}

export interface BenefitTracking {
  id: string;
  userId: string;
  benefitId: string;
  status: BenefitStatus;
  amountUsed: number;
  lastUpdated: string;
  notes?: string;
}

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: string;
  cardUsed: string; // card id
  cardUsedName: string;
  optimalCard: string; // card id
  optimalCardName: string;
  missedValue: number;
  isOptimal: boolean;
}

export interface Notification {
  id: string;
  type: "expiring-credit" | "weekly-digest" | "card-recommendation" | "category-activation" | "annual-fee";
  title: string;
  body: string;
  benefitId?: string;
  cardId?: string;
  createdAt: string;
  readAt?: string;
}

export interface PortfolioSummary {
  totalAnnualFees: number;
  totalBenefitValue: number;
  totalCaptured: number;
  totalMissed: number;
  captureRate: number; // 0–100
  cardCount: number;
}

export interface CardROI {
  cardId: string;
  cardName: string;
  annualFee: number;
  totalBenefitValue: number;
  capturedValue: number;
  captureRate: number;
  netROI: number; // captured - annualFee
  recommendation: "keep" | "downgrade" | "evaluate";
}
