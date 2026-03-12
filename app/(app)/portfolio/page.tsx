"use client";

import { useEffect, useState } from "react";
import type { CardCatalogEntry, CardROI } from "@/types";
import { formatCurrency } from "@/lib/utils";
import ProgressBar from "@/components/ui/ProgressBar";
import { Sparkles, Loader2, TrendingUp, TrendingDown, Minus, RefreshCw } from "lucide-react";
import ConfidenceWarning from "@/components/ui/ConfidenceWarning";
import ReportIssueButton from "@/components/ui/ReportIssueButton";
import CoachingTip from "@/components/ui/CoachingTip";

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
  interface AICardAdvice {
    cardName: string;
    recommendation: string;
    rationale: string;
    netROI: string;
  }
  interface AIAdviceData {
    cards: AICardAdvice[];
    overallSummary: string;
    tradeoffs: string;
  }
  const [aiAdvice, setAiAdvice] = useState<AIAdviceData | null>(null);
  const [aiConfidence, setAiConfidence] = useState<"HIGH" | "MEDIUM" | "LOW">("HIGH");
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
    setAiAdvice(null);

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
    if (data.overallSummary) {
      if (data.confidence) setAiConfidence(data.confidence);
      setAiAdvice({
        cards: data.cards ?? [],
        overallSummary: data.overallSummary,
        tradeoffs: data.tradeoffs ?? "",
      });
    } else {
      setAiConfidence("LOW");
      setAiAdvice({
        cards: [],
        overallSummary: data.advice ?? "Unable to generate advice at this time.",
        tradeoffs: "",
      });
    }
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
          <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
            Total annual fees
            <CoachingTip tip="What you pay each year to hold these cards. This is the cost side of your card portfolio equation." />
          </p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-600">{formatCurrency(totalCaptured)}</p>
          <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
            Total value captured
            <CoachingTip tip="Dollar value of benefits you've redeemed. When this exceeds your annual fees, your cards are paying for themselves." />
          </p>
        </div>
        <div className="card text-center">
          <p className={`text-3xl font-bold ${totalNet >= 0 ? "text-green-600" : "text-red-500"}`}>
            {totalNet >= 0 ? "+" : ""}{formatCurrency(totalNet)}
          </p>
          <p className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
            Net portfolio ROI
            <CoachingTip tip="Benefits captured minus annual fees. Green = your cards are earning more than they cost. Red = consider downgrading." />
          </p>
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
                <div className="flex items-center gap-1.5">
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
                  <CoachingTip tip={
                    roi.recommendation === "keep"
                      ? "This card's captured benefits exceed its annual fee — it's paying for itself."
                      : roi.recommendation === "downgrade"
                      ? "You're losing over $100/yr on this card. Consider a no-fee alternative from the same issuer."
                      : "This card is borderline. Use more benefits or consider if a different card fits your spending better."
                  } />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
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
          <div className="space-y-4">
            {/* Per-card AI advice */}
            {aiAdvice.cards.length > 0 && (
              <div className="space-y-2">
                {aiAdvice.cards.map((c, i) => {
                  const rec = c.recommendation?.toLowerCase();
                  const isKeep = rec === "keep";
                  const isDowngrade = rec === "downgrade" || rec === "consider downgrade";
                  return (
                    <div key={i} className={`rounded-xl border px-4 py-3 ${
                      isKeep ? "bg-green-50 border-green-200" :
                      isDowngrade ? "bg-red-50 border-red-200" :
                      "bg-yellow-50 border-yellow-200"
                    }`}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm text-gray-900">{c.cardName}</span>
                        <span className={`text-xs font-bold uppercase tracking-wide ${
                          isKeep ? "text-green-700" :
                          isDowngrade ? "text-red-600" :
                          "text-yellow-700"
                        }`}>
                          {c.recommendation}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{c.rationale}</p>
                      {c.netROI && (
                        <p className="text-xs text-gray-400 mt-1">{c.netROI}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Overall summary */}
            <div className="bg-gradient-to-br from-brand-50 to-indigo-50 rounded-xl p-4">
              <p className="text-xs font-semibold text-brand-700 uppercase tracking-wide mb-1.5">Summary</p>
              <p className="text-sm text-gray-700 leading-relaxed">{aiAdvice.overallSummary}</p>
            </div>

            {/* Tradeoffs */}
            {aiAdvice.tradeoffs && (
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Tradeoffs to Consider</p>
                <p className="text-sm text-gray-600 leading-relaxed">{aiAdvice.tradeoffs}</p>
              </div>
            )}

            <ConfidenceWarning confidence={aiConfidence} />
            <p className="text-[10px] text-gray-400">CardIQ provides information, not financial advice. Verify terms with your card issuer.</p>
            <ReportIssueButton context="portfolio:analysis" />
          </div>
        )}
      </div>
    </div>
  );
}
