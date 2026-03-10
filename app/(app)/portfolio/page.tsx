"use client";

import { useEffect, useState } from "react";
import type { CardCatalogEntry, CardROI } from "@/types";
import { formatCurrency } from "@/lib/utils";
import ProgressBar from "@/components/ui/ProgressBar";
import { Sparkles, Loader2, TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";

interface BenefitTrackingItem {
  benefitId: string;
  cardId: string;
  status: string;
  amountUsed: number;
  dollarValue: number;
}

export default function PortfolioPage() {
  const [cards, setCards] = useState<CardCatalogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiAdvice, setAiAdvice] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [roiCards, setRoiCards] = useState<CardROI[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/cards/user").then((r) => r.json()),
      fetch("/api/benefits").then((r) => r.json()),
    ]).then(([{ cards: c }, { benefits }]) => {
      const fetchedCards: CardCatalogEntry[] = c ?? [];
      const benefitList: BenefitTrackingItem[] = benefits ?? [];
      setCards(fetchedCards);

      // Build a map of benefitId -> tracking
      const trackingMap = new Map(benefitList.map((b) => [b.benefitId, b]));

      const rois: CardROI[] = fetchedCards.map((card) => {
        const totalBenefitValue = card.benefits.reduce((s, b) => s + b.dollarValue, 0);

        // Use real tracked data
        const capturedValue = card.benefits.reduce((s, b) => {
          const tracked = trackingMap.get(b.id);
          if (!tracked || tracked.status === "unused" || tracked.status === "expired") return s;
          if (tracked.status === "used") return s + b.dollarValue;
          if (tracked.status === "partial") return s + tracked.amountUsed;
          return s;
        }, 0);

        const captureRate = totalBenefitValue > 0
          ? Math.round((capturedValue / totalBenefitValue) * 100)
          : 0;
        const netROI = capturedValue - card.annualFee;

        let recommendation: "keep" | "downgrade" | "evaluate" = "evaluate";
        if (netROI >= 0 && captureRate >= 60) recommendation = "keep";
        else if (netROI < -100) recommendation = "downgrade";

        return {
          cardId: card.id,
          cardName: card.name,
          annualFee: card.annualFee,
          totalBenefitValue,
          capturedValue,
          captureRate,
          netROI,
          recommendation,
        };
      });

      setRoiCards(rois);
      setLoading(false);
    });
  }, []);

  async function getAIAdvice() {
    setAiLoading(true);
    setAiAdvice("");

    const res = await fetch("/api/ai/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cards: roiCards.map((r) => ({
          name: r.cardName,
          annualFee: r.annualFee,
          capturedValue: r.capturedValue,
          captureRate: r.captureRate,
        })),
      }),
    });

    const data = await res.json();
    setAiAdvice(data.advice ?? "Unable to generate advice at this time.");
    setAiLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  const totalFees = roiCards.reduce((s, r) => s + r.annualFee, 0);
  const totalCaptured = roiCards.reduce((s, r) => s + r.capturedValue, 0);
  const totalNet = totalCaptured - totalFees;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Portfolio Strategy</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Understand which cards earn their keep
        </p>
      </div>

      {/* Portfolio totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalFees)}</p>
          <p className="text-sm text-gray-500 mt-1">Total annual fees</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-600">{formatCurrency(totalCaptured)}</p>
          <p className="text-sm text-gray-500 mt-1">Total value captured</p>
        </div>
        <div className="card text-center">
          <p className={`text-3xl font-bold ${totalNet >= 0 ? "text-green-600" : "text-red-500"}`}>
            {totalNet >= 0 ? "+" : ""}{formatCurrency(totalNet)}
          </p>
          <p className="text-sm text-gray-500 mt-1">Net portfolio ROI</p>
        </div>
      </div>

      {/* Per-card ROI */}
      <div className="space-y-4">
        {roiCards.map((roi) => {
          const card = cards.find((c) => c.id === roi.cardId);
          return (
            <div key={roi.cardId} className="card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  {card && (
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-lg bg-gradient-to-r ${card.color} mb-1.5`}>
                      <span className="text-white text-xs font-semibold">{card?.issuer}</span>
                    </div>
                  )}
                  <h3 className="font-semibold text-gray-900">{roi.cardName}</h3>
                  <p className="text-sm text-gray-400">
                    {roi.annualFee === 0 ? "No annual fee" : `${formatCurrency(roi.annualFee)}/yr`}
                  </p>
                </div>

                {/* Recommendation badge */}
                <div>
                  {roi.recommendation === "keep" && (
                    <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                      <TrendingUp className="w-3 h-3" /> Keep
                    </span>
                  )}
                  {roi.recommendation === "downgrade" && (
                    <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-full">
                      <TrendingDown className="w-3 h-3" /> Consider Downgrade
                    </span>
                  )}
                  {roi.recommendation === "evaluate" && (
                    <span className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                      <Minus className="w-3 h-3" /> Evaluate
                    </span>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Benefits available</p>
                  <p className="text-lg font-bold text-gray-900">{formatCurrency(roi.totalBenefitValue)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Captured</p>
                  <p className="text-lg font-bold text-green-600">{formatCurrency(roi.capturedValue)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Net ROI</p>
                  <p className={`text-lg font-bold ${roi.netROI >= 0 ? "text-green-600" : "text-red-500"}`}>
                    {roi.netROI >= 0 ? "+" : ""}{formatCurrency(roi.netROI)}
                  </p>
                </div>
              </div>

              {/* Capture rate bar */}
              {roi.totalBenefitValue > 0 && (
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500">Capture rate</span>
                    <span className="text-xs font-semibold text-gray-700">{roi.captureRate}%</span>
                  </div>
                  <ProgressBar value={roi.captureRate} color="green" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Advice */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <h2 className="text-sm font-semibold text-brand-700">AI Portfolio Advice</h2>
          </div>
          <button
            onClick={getAIAdvice}
            disabled={aiLoading || roiCards.length === 0}
            className="btn-secondary text-xs flex items-center gap-1.5"
          >
            {aiLoading ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
            {aiAdvice ? "Refresh" : "Get AI Analysis"}
          </button>
        </div>

        {!aiAdvice && !aiLoading && (
          <p className="text-sm text-gray-400 text-center py-6">
            Click &quot;Get AI Analysis&quot; for personalized portfolio recommendations powered by Claude.
          </p>
        )}

        {aiLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
            <Loader2 className="w-4 h-4 animate-spin" />
            Analyzing your portfolio…
          </div>
        )}

        {aiAdvice && !aiLoading && (
          <div className="bg-gradient-to-br from-brand-50 to-indigo-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {aiAdvice}
          </div>
        )}
      </div>
    </div>
  );
}
