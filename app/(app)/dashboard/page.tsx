"use client";

import { useEffect, useState, useCallback } from "react";
import type { CardCatalogEntry, BenefitStatus, PortfolioSummary } from "@/types";
import PortfolioSummaryComponent from "@/components/dashboard/PortfolioSummary";
import CardBenefitCard from "@/components/dashboard/CardBenefitCard";
import ManageCardsModal from "@/components/dashboard/ManageCardsModal";
import { Loader2, Settings2, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

interface BenefitState {
  status: BenefitStatus;
  amountUsed: number;
}

interface BenefitTracking {
  benefitId: string;
  cardId: string;
  status: BenefitStatus;
  amountUsed: number;
  dollarValue: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [cards, setCards] = useState<CardCatalogEntry[]>([]);
  const [benefitStates, setBenefitStates] = useState<Record<string, BenefitState>>({});
  const [loading, setLoading] = useState(true);
  const [showManage, setShowManage] = useState(false);

  const fetchData = useCallback(async () => {
    let [cardsRes, benefitsRes] = await Promise.all([
      fetch("/api/cards/user"),
      fetch("/api/benefits"),
    ]);
    let { cards: fetchedCards } = await cardsRes.json();
    let { benefits } = await benefitsRes.json();

    // Serverless fallback: if no cards returned but localStorage has onboarding
    // data, re-seed this Lambda instance and re-fetch
    if ((!fetchedCards || fetchedCards.length === 0)) {
      try {
        const saved = localStorage.getItem("cardiq_onboarding");
        if (saved) {
          const { cards: savedCards, benefits: savedBenefits } = JSON.parse(saved);
          if (savedCards?.length) {
            // Re-POST cards + benefits to whichever Lambda instance is handling this
            await Promise.all([
              ...savedCards.map((cardId: string) =>
                fetch("/api/cards/user", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ cardId }),
                })
              ),
              ...(savedBenefits ?? []).map((b: { id: string; status: string; amountUsed: number }) =>
                fetch(`/api/benefits/${b.id}`, {
                  method: "PATCH",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ status: b.status, amountUsed: b.amountUsed }),
                })
              ),
            ]);
            // Re-fetch now that this instance has the data
            [cardsRes, benefitsRes] = await Promise.all([
              fetch("/api/cards/user"),
              fetch("/api/benefits"),
            ]);
            ({ cards: fetchedCards } = await cardsRes.json());
            ({ benefits } = await benefitsRes.json());
          }
        }
      } catch { /* localStorage unavailable — proceed with empty state */ }
    }

    setCards(fetchedCards ?? []);

    const states: Record<string, BenefitState> = {};
    for (const b of (benefits ?? []) as BenefitTracking[]) {
      states[b.benefitId] = { status: b.status, amountUsed: b.amountUsed };
    }
    setBenefitStates(states);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleUpdateBenefit(benefitId: string, status: BenefitStatus) {
    await fetch(`/api/benefits/${benefitId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, amountUsed: status === "used" ? getBenefitValue(benefitId) : 0 }),
    });
    setBenefitStates((prev) => ({
      ...prev,
      [benefitId]: { status, amountUsed: status === "used" ? getBenefitValue(benefitId) : 0 },
    }));
  }

  function getBenefitValue(benefitId: string): number {
    for (const card of cards) {
      const benefit = card.benefits.find((b) => b.id === benefitId);
      if (benefit) return benefit.dollarValue;
    }
    return 0;
  }

  async function handleAddCard(cardId: string) {
    await fetch("/api/cards/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId }),
    });
    await fetchData();
  }

  async function handleRemoveCard(cardId: string) {
    await fetch(`/api/cards/user?cardId=${cardId}`, { method: "DELETE" });
    await fetchData();
  }

  // Compute portfolio summary
  const summary: PortfolioSummary = (() => {
    let totalAnnualFees = 0;
    let totalBenefitValue = 0;
    let totalCaptured = 0;

    for (const card of cards) {
      totalAnnualFees += card.annualFee;
      for (const benefit of card.benefits) {
        totalBenefitValue += benefit.dollarValue;
        const state = benefitStates[benefit.id];
        if (state?.status === "used") totalCaptured += benefit.dollarValue;
        else if (state?.status === "partial") totalCaptured += state.amountUsed;
      }
    }

    const totalMissed = totalBenefitValue - totalCaptured;
    const captureRate = totalBenefitValue > 0
      ? Math.round((totalCaptured / totalBenefitValue) * 100)
      : 0;

    return {
      totalAnnualFees,
      totalBenefitValue,
      totalCaptured,
      totalMissed,
      captureRate,
      cardCount: cards.length,
    };
  })();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Benefits Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track and maximize every credit card perk</p>
        </div>
        <button
          onClick={() => setShowManage(true)}
          className="btn-secondary flex items-center gap-2"
        >
          <Settings2 className="w-4 h-4" />
          Manage Cards
        </button>
      </div>

      {/* Portfolio summary */}
      <PortfolioSummaryComponent summary={summary} />

      {/* Per-card sections */}
      {cards.length === 0 ? (
        <div className="card text-center py-12">
          <div className="w-14 h-14 bg-brand-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CreditCard className="w-7 h-7 text-brand-500" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">No cards added yet</h3>
          <p className="text-gray-400 text-sm mb-5">Add your credit cards to start tracking benefits</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => router.push("/onboarding/plaid")}
              className="btn-primary flex items-center justify-center gap-2"
            >
              Connect via Plaid
            </button>
            <button
              onClick={() => router.push("/onboarding/manual")}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              Add cards manually
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6">
          {cards.map((card) => (
            <CardBenefitCard
              key={card.id}
              card={card}
              benefitStates={benefitStates}
              onUpdateBenefit={handleUpdateBenefit}
            />
          ))}
        </div>
      )}

      {/* Manage Cards Modal */}
      {showManage && (
        <ManageCardsModal
          userCards={cards}
          onClose={() => setShowManage(false)}
          onAdd={handleAddCard}
          onRemove={handleRemoveCard}
        />
      )}
    </div>
  );
}
