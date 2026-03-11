"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, CheckCircle, X, Plus, ChevronDown, ChevronUp, Loader2, Sparkles } from "lucide-react";
import { CARD_CATALOG } from "@/lib/mock-data/cards";
import { formatCurrency } from "@/lib/utils";
import type { CardBenefit, CardCatalogEntry } from "@/types";

// Evidence snippets shown per benefit category
const EVIDENCE: Record<string, string> = {
  "statement-credit": "detected from recent charges",
  "lounge":           "airport visit detected",
  "insurance":        "rental or travel charge detected",
  "membership":       "subscription charge detected",
  "bonus":            "account activity detected",
  "rewards":          "spending pattern detected",
  "protection":       "eligible purchase detected",
  "status":           "hotel/airline activity detected",
};

// Per-card, per-benefit merchant-specific evidence
const MERCHANT_HINTS: Record<string, Record<string, string>> = {
  "amex-platinum":           { "amex-plat-uber-cash": "4 Uber charges detected", "amex-plat-airline": "Delta charge $342 detected", "amex-plat-hotel": "Amex Travel hotel booking detected", "amex-plat-clear": "CLEAR renewal charge detected", "amex-plat-digital": "Disney+ & NYT charges detected", "amex-plat-saks": "Saks purchase detected", "amex-plat-lounge": "3 lounge visits detected", "amex-plat-walmart": "Walmart+ charge detected" },
  "chase-sapphire-reserve":  { "csr-travel-credit": "United + Uber travel charges detected", "csr-lounge": "Priority Pass visit detected", "csr-dining": "hotel booking detected", "csr-rental-car": "Hertz charge detected" },
  "capital-one-venture-x":   { "venturex-travel-credit": "Capital One Travel booking detected", "venturex-bonus-miles": "anniversary milestone detected", "venturex-lounge": "lounge access detected" },
  "amex-gold":               { "amex-gold-uber-cash": "3 Uber Eats charges detected", "amex-gold-dining": "Grubhub & Five Guys charges detected", "amex-gold-resy": "Resy restaurant booking detected", "amex-gold-dunkin": "Dunkin' charges detected" },
  "chase-sapphire-preferred":{ "csp-hotel-credit": "Chase Travel hotel booking detected", "csp-dashpass": "DoorDash subscription detected", "csp-rental-car": "Enterprise charge detected" },
  "chase-freedom-unlimited": { "cfu-dashpass": "DoorDash charge detected" },
  "wells-fargo-active-cash": { "wfac-cell-phone": "phone bill charge detected" },
  "amex-blue-cash-preferred":{ "abcp-groceries": "supermarket charges detected", "abcp-streaming": "streaming charges detected" },
  "marriott-bonvoy-boundless":{ "marriott-free-night": "Marriott stay detected" },
  "delta-skymiles-gold":     { "delta-checked-bag": "Delta flight detected" },
  "united-explorer":         { "united-checked-bag": "United flight detected" },
};

// Pick a realistic random subset of benefits to show as "detected" (40-80%)
function pickDetectedBenefits(card: CardCatalogEntry): CardBenefit[] {
  const all = card.benefits;
  if (all.length === 0) return [];
  const seed = card.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const ratio = 0.4 + ((seed % 41) / 100); // 0.40-0.80
  const count = Math.max(1, Math.round(all.length * ratio));
  const shuffled = [...all].sort((a, b) => {
    const ha = (a.id + card.id).split("").reduce((s, c) => s + c.charCodeAt(0), seed);
    const hb = (b.id + card.id).split("").reduce((s, c) => s + c.charCodeAt(0), seed);
    return ha - hb;
  });
  return shuffled.slice(0, count);
}

interface CardGroup {
  card: CardCatalogEntry;
  detected: CardBenefit[];
  available: CardBenefit[];  // not auto-detected; user can add
  expanded: boolean;
  addingIds: Set<string>;
  removedIds: Set<string>;
}

function ReviewBenefitsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cardGroups, setCardGroups] = useState<CardGroup[]>([]);
  const [confirming, setConfirming] = useState(false);
  const [showAddFor, setShowAddFor] = useState<string | null>(null);

  useEffect(() => {
    const cardIdsParam = searchParams.get("cards");
    if (!cardIdsParam) { router.push("/dashboard"); return; }

    const cardIds = cardIdsParam.split(",").filter(Boolean);
    const groups: CardGroup[] = cardIds
      .map((id) => CARD_CATALOG.find((c) => c.id === id))
      .filter((c): c is CardCatalogEntry => !!c)
      .map((card) => {
        const detected = pickDetectedBenefits(card);
        const detectedIds = new Set(detected.map((b) => b.id));
        const available = card.benefits.filter((b) => !detectedIds.has(b.id));
        return { card, detected, available, expanded: true, addingIds: new Set<string>(), removedIds: new Set<string>() };
      });

    setCardGroups(groups);
  }, [searchParams, router]);

  function toggleRemove(cardId: string, benefitId: string) {
    setCardGroups((prev) => prev.map((g) => {
      if (g.card.id !== cardId) return g;
      const removedIds = new Set(g.removedIds);
      if (removedIds.has(benefitId)) removedIds.delete(benefitId);
      else removedIds.add(benefitId);
      return { ...g, removedIds };
    }));
  }

  function toggleAdd(cardId: string, benefitId: string) {
    setCardGroups((prev) => prev.map((g) => {
      if (g.card.id !== cardId) return g;
      const addingIds = new Set(g.addingIds);
      if (addingIds.has(benefitId)) addingIds.delete(benefitId);
      else addingIds.add(benefitId);
      return { ...g, addingIds };
    }));
  }

  function toggleExpanded(cardId: string) {
    setCardGroups((prev) => prev.map((g) =>
      g.card.id === cardId ? { ...g, expanded: !g.expanded } : g
    ));
  }

  async function handleConfirm() {
    setConfirming(true);

    // Collect all active benefits (detected minus removed, plus manually added)
    const patches: Array<{ id: string; dollarValue: number }> = [];
    for (const g of cardGroups) {
      for (const b of g.detected) {
        if (!g.removedIds.has(b.id)) patches.push({ id: b.id, dollarValue: b.dollarValue });
      }
      for (const benefitId of Array.from(g.addingIds)) {
        const b = g.available.find((x) => x.id === benefitId);
        if (b) patches.push({ id: b.id, dollarValue: b.dollarValue });
      }
    }

    // Collect card IDs from the onboarding flow
    const onboardingCardIds = cardGroups.map((g) => g.card.id);

    // Save cards + benefits via API
    await Promise.all([
      ...onboardingCardIds.map((cardId) =>
        fetch("/api/cards/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cardId }),
        })
      ),
      ...patches.map(({ id }) =>
        fetch(`/api/benefits/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: "unused", amountUsed: 0 }),
        })
      ),
    ]);

    // Persist onboarding data in localStorage as a fallback for serverless
    // (Lambda instances have ephemeral filesystems — this ensures the dashboard
    // can re-hydrate user data if it lands on a different instance)
    try {
      localStorage.setItem(
        "cardiq_onboarding",
        JSON.stringify({
          cards: onboardingCardIds,
          benefits: patches.map(({ id }) => ({ id, status: "unused", amountUsed: 0 })),
        })
      );
    } catch { /* localStorage unavailable — API calls are the primary path */ }

    router.push("/dashboard");
  }

  const totalEnabled = cardGroups.reduce((sum, g) =>
    sum + g.detected.filter((b) => !g.removedIds.has(b.id)).length + g.addingIds.size, 0);

  const totalValue = cardGroups.reduce((sum, g) => {
    const fromDetected = g.detected.filter((b) => !g.removedIds.has(b.id)).reduce((s, b) => s + b.dollarValue, 0);
    const fromAdded = g.available.filter((b) => g.addingIds.has(b.id)).reduce((s, b) => s + b.dollarValue, 0);
    return sum + fromDetected + fromAdded;
  }, 0);

  if (cardGroups.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col" style={{ maxHeight: "92vh" }}>

          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100 shrink-0">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-brand-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Benefits we detected</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Based on your transaction history. Remove anything that doesn&apos;t apply — or add benefits we missed.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-brand-50 rounded-xl px-4 py-3">
              <div className="flex-1">
                <p className="text-xs text-brand-600 font-medium">Benefits detected</p>
                <p className="text-lg font-bold text-brand-700">{totalEnabled}</p>
              </div>
              <div className="w-px h-8 bg-brand-200" />
              <div className="flex-1">
                <p className="text-xs text-brand-600 font-medium">Annual value</p>
                <p className="text-lg font-bold text-brand-700">{formatCurrency(totalValue)}</p>
              </div>
            </div>
          </div>

          {/* Card groups */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cardGroups.map((group) => {
              const { card, detected, available, expanded, addingIds, removedIds } = group;
              const hints = MERCHANT_HINTS[card.id] ?? {};
              const activeCount = detected.filter((b) => !removedIds.has(b.id)).length + addingIds.size;

              return (
                <div key={card.id} className="border border-gray-100 rounded-xl overflow-hidden">
                  {/* Card header */}
                  <button
                    onClick={() => toggleExpanded(card.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} shrink-0`} />
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-gray-900">{card.name}</p>
                      <p className="text-xs text-gray-400">{activeCount} benefit{activeCount !== 1 ? "s" : ""} active</p>
                    </div>
                    {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                  </button>

                  {expanded && (
                    <div>
                      {/* Auto-detected benefits */}
                      <div className="divide-y divide-gray-50">
                        {detected.map((benefit) => {
                          const isRemoved = removedIds.has(benefit.id);
                          const evidence = hints[benefit.id] ?? EVIDENCE[benefit.category] ?? "detected from activity";
                          return (
                            <div key={benefit.id} className={`flex items-start gap-3 px-4 py-3 transition-colors ${isRemoved ? "bg-gray-50 opacity-50" : "bg-white"}`}>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium ${isRemoved ? "line-through text-gray-400" : "text-gray-900"}`}>
                                  {benefit.name}
                                </p>
                                {!isRemoved && (
                                  <p className="text-xs text-brand-600 mt-0.5 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3 shrink-0" />
                                    {evidence}
                                  </p>
                                )}
                              </div>
                              <span className={`text-sm font-semibold shrink-0 mt-0.5 ${isRemoved ? "text-gray-300" : "text-green-600"}`}>
                                {formatCurrency(benefit.dollarValue)}
                              </span>
                              <button
                                onClick={() => toggleRemove(card.id, benefit.id)}
                                className={`shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                                  isRemoved
                                    ? "border-gray-300 bg-white hover:border-brand-400"
                                    : "border-brand-600 bg-brand-600 hover:bg-red-500 hover:border-red-500"
                                }`}
                                title={isRemoved ? "Re-add benefit" : "Remove benefit"}
                              >
                                {isRemoved
                                  ? <Plus className="w-3 h-3 text-gray-400" />
                                  : <X className="w-3 h-3 text-white" strokeWidth={3} />
                                }
                              </button>
                            </div>
                          );
                        })}

                        {/* Manually added benefits */}
                        {Array.from(addingIds).map((benefitId) => {
                          const benefit = available.find((b) => b.id === benefitId);
                          if (!benefit) return null;
                          return (
                            <div key={benefit.id} className="flex items-start gap-3 px-4 py-3 bg-green-50">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">{benefit.name}</p>
                                <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
                                  <Plus className="w-3 h-3 shrink-0" />
                                  added manually
                                </p>
                              </div>
                              <span className="text-sm font-semibold text-green-600 shrink-0 mt-0.5">
                                {formatCurrency(benefit.dollarValue)}
                              </span>
                              <button
                                onClick={() => toggleAdd(card.id, benefit.id)}
                                className="shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 border-red-400 bg-red-400 hover:bg-red-500 flex items-center justify-center transition-all"
                                title="Remove"
                              >
                                <X className="w-3 h-3 text-white" strokeWidth={3} />
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* Add missing benefits */}
                      {available.filter((b) => !addingIds.has(b.id)).length > 0 && (
                        <div className="border-t border-gray-100">
                          <button
                            onClick={() => setShowAddFor(showAddFor === card.id ? null : card.id)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-xs text-gray-400 hover:text-brand-600 hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Add a benefit we missed
                            {showAddFor === card.id
                              ? <ChevronUp className="w-3 h-3 ml-auto" />
                              : <ChevronDown className="w-3 h-3 ml-auto" />
                            }
                          </button>

                          {showAddFor === card.id && (
                            <div className="bg-gray-50 divide-y divide-gray-100">
                              {available
                                .filter((b) => !addingIds.has(b.id))
                                .map((benefit) => (
                                  <button
                                    key={benefit.id}
                                    onClick={() => toggleAdd(card.id, benefit.id)}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-100 transition-colors text-left"
                                  >
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm text-gray-700">{benefit.name}</p>
                                      <p className="text-xs text-gray-400 truncate">{benefit.description}</p>
                                    </div>
                                    <span className="text-sm font-medium text-gray-500 shrink-0">
                                      {formatCurrency(benefit.dollarValue)}
                                    </span>
                                    <div className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-brand-500 flex items-center justify-center shrink-0">
                                      <Plus className="w-3 h-3 text-gray-400" />
                                    </div>
                                  </button>
                                ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-100 shrink-0 space-y-2">
            <button
              onClick={handleConfirm}
              disabled={confirming}
              className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
            >
              {confirming ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  Confirm — go to my Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full text-center text-xs text-gray-400 hover:text-gray-600 py-1 transition-colors"
            >
              Skip review
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ReviewBenefitsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    }>
      <ReviewBenefitsContent />
    </Suspense>
  );
}
