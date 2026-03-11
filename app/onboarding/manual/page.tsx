"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Search, Check } from "lucide-react";
import { CARD_CATALOG } from "@/lib/mock-data/cards";
import { formatCurrency } from "@/lib/utils";

const TIER_LABELS: Record<string, string> = {
  premium: "Premium Travel",
  "mid-tier": "Mid-Tier Rewards",
  "cash-back": "Cash Back",
  "hotel-airline": "Hotel & Airline",
};

const TIER_ORDER = ["premium", "mid-tier", "cash-back", "hotel-airline"];

export default function ManualOnboardingPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filtered = CARD_CATALOG.filter(
    (c) =>
      search === "" ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.issuer.toLowerCase().includes(search.toLowerCase())
  );

  const byTier = TIER_ORDER.reduce<Record<string, typeof CARD_CATALOG>>((acc, tier) => {
    const cards = filtered.filter((c) => c.tier === tier);
    if (cards.length > 0) acc[tier] = cards;
    return acc;
  }, {});

  function toggleCard(cardId: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  }

  async function handleSave() {
    if (selected.size === 0) return;

    setSaving(true);
    setError("");

    try {
      // Add each selected card one by one
      for (const cardId of Array.from(selected)) {
        const res = await fetch("/api/cards/user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ cardId }),
        });
        if (!res.ok) throw new Error("Failed to add card");
      }
      const cardIds = Array.from(selected).join(",");
      router.push(`/onboarding/review?cards=${cardIds}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col" style={{ maxHeight: "90vh" }}>

          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
            <button
              onClick={() => router.back()}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 text-gray-400" />
            </button>
            <div className="flex-1">
              <h1 className="text-base font-semibold text-gray-900">Select your cards</h1>
              <p className="text-xs text-gray-400">
                {selected.size === 0
                  ? "Pick all the cards you currently own"
                  : `${selected.size} card${selected.size !== 1 ? "s" : ""} selected`}
              </p>
            </div>
            {selected.size > 0 && (
              <span className="text-xs bg-brand-100 text-brand-700 font-semibold px-2 py-1 rounded-full">
                {selected.size} selected
              </span>
            )}
          </div>

          {/* Search */}
          <div className="px-4 py-3 border-b border-gray-100 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by card name or bank…"
                className="input pl-9"
              />
            </div>
          </div>

          {/* Card list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5">
            {Object.entries(byTier).map(([tier, cards]) => (
              <div key={tier}>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {TIER_LABELS[tier]}
                </p>
                <div className="space-y-2">
                  {cards.map((card) => {
                    const isSelected = selected.has(card.id);
                    const benefitTotal = card.benefits.reduce((s, b) => s + b.dollarValue, 0);
                    return (
                      <button
                        key={card.id}
                        onClick={() => toggleCard(card.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? "border-brand-500 bg-brand-50"
                            : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {/* Card color swatch */}
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} shrink-0`} />

                        {/* Card info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{card.name}</p>
                          <p className="text-xs text-gray-400">
                            {card.annualFee === 0 ? "No annual fee" : `${formatCurrency(card.annualFee)}/yr`}
                            {benefitTotal > 0 && (
                              <span className="text-green-600 font-medium"> · {formatCurrency(benefitTotal)} benefits</span>
                            )}
                          </p>
                        </div>

                        {/* Checkbox */}
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          isSelected
                            ? "border-brand-600 bg-brand-600"
                            : "border-gray-300"
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {Object.keys(byTier).length === 0 && (
              <div className="text-center py-8 text-gray-400 text-sm">
                No cards found for &quot;{search}&quot;
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-100 shrink-0 space-y-2">
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            <button
              onClick={handleSave}
              disabled={saving || selected.size === 0}
              className={`w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                selected.size === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "btn-primary"
              }`}
            >
              {saving ? (
                "Saving your cards…"
              ) : selected.size > 0 ? (
                <>
                  Add {selected.size} card{selected.size !== 1 ? "s" : ""} to my portfolio
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                "Select at least one card"
              )}
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full text-center text-xs text-gray-400 hover:text-gray-600 py-1 transition-colors"
            >
              Skip for now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
