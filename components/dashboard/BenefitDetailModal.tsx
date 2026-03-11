"use client";

import { useEffect, useState } from "react";
import { X, Sparkles, Loader2, CheckCircle } from "lucide-react";
import type { CardBenefit, BenefitStatus } from "@/types";
import Badge from "@/components/ui/Badge";
import ConfidenceWarning from "@/components/ui/ConfidenceWarning";
import ReportIssueButton from "@/components/ui/ReportIssueButton";
import { formatCurrency, getDaysUntil } from "@/lib/utils";

interface BenefitDetailModalProps {
  benefit: CardBenefit;
  cardName: string;
  status: BenefitStatus;
  amountUsed: number;
  onClose: () => void;
  onMarkUsed: (benefitId: string, status: BenefitStatus) => Promise<void>;
}

export default function BenefitDetailModal({
  benefit,
  cardName,
  status,
  amountUsed,
  onClose,
  onMarkUsed,
}: BenefitDetailModalProps) {
  const [explanation, setExplanation] = useState<string>("");
  const [confidence, setConfidence] = useState<"HIGH" | "MEDIUM" | "LOW">("HIGH");
  const [loadingAI, setLoadingAI] = useState(false);
  const [marking, setMarking] = useState(false);
  const [marked, setMarked] = useState(false);

  // Fetch AI explanation on open
  useEffect(() => {
    let cancelled = false;
    setLoadingAI(true);

    fetch("/api/ai/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        benefitName: benefit.name,
        cardName,
        description: benefit.description,
        redemptionInstructions: benefit.redemptionInstructions,
      }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          setExplanation(data.explanation ?? benefit.description);
          if (data.confidence) setConfidence(data.confidence);
          setLoadingAI(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setExplanation(benefit.description);
          setLoadingAI(false);
        }
      });

    return () => { cancelled = true; };
  }, [benefit, cardName]);

  async function handleMarkUsed() {
    setMarking(true);
    await onMarkUsed(benefit.id, "used");
    setMarking(false);
    setMarked(true);
  }

  const daysLeft = benefit.expiresAt ? getDaysUntil(benefit.expiresAt) : null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{cardName}</p>
            <h2 className="text-lg font-semibold text-gray-900">{benefit.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Value + Status */}
          <div className="flex items-center gap-4">
            <div className="bg-brand-50 rounded-xl px-4 py-3 text-center">
              <p className="text-2xl font-bold text-brand-700">{formatCurrency(benefit.dollarValue)}</p>
              <p className="text-xs text-brand-500 font-medium">annual value</p>
            </div>
            <div className="space-y-1.5">
              <Badge status={status} />
              {amountUsed > 0 && (
                <p className="text-xs text-gray-500">{formatCurrency(amountUsed)} used so far</p>
              )}
              {daysLeft !== null && daysLeft <= 30 && daysLeft >= 0 && (
                <p className="text-xs text-red-600 font-medium">
                  ⚠️ Expires in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
                </p>
              )}
              <p className="text-xs text-gray-400 capitalize">
                Resets: {benefit.resetFrequency}
              </p>
            </div>
          </div>

          {/* AI Explanation */}
          <div className="bg-gradient-to-br from-brand-50 to-indigo-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-brand-600" />
              <span className="text-xs font-semibold text-brand-700 uppercase tracking-wide">
                AI Insight
              </span>
            </div>
            {loadingAI ? (
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                Getting AI insight…
              </div>
            ) : (
              <p className="text-sm text-gray-700 leading-relaxed">{explanation}</p>
            )}
            <ConfidenceWarning confidence={confidence} />
            <p className="text-[10px] text-gray-400 mt-2">CardIQ provides information, not financial advice. Verify terms with your card issuer.</p>
            <ReportIssueButton context={`benefit:${benefit.id}`} />
          </div>

          {/* Redemption Instructions */}
          <div>
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              How to Redeem
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              {benefit.redemptionInstructions}
            </p>
          </div>

          {/* Action */}
          {status !== "used" && status !== "expired" && (
            <button
              onClick={handleMarkUsed}
              disabled={marking || marked}
              className="w-full btn-primary py-2.5 flex items-center justify-center gap-2"
            >
              {marked ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Marked as used!
                </>
              ) : marking ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : (
                "Mark as Used"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
