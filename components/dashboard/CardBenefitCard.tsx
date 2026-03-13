"use client";

import { useState } from "react";
import Link from "next/link";
import type { CardCatalogEntry, BenefitStatus } from "@/types";
import BenefitItem from "./BenefitItem";
import BenefitDetailModal from "./BenefitDetailModal";
import ProgressBar from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/lib/utils";
import { Upload } from "lucide-react";

interface BenefitState {
  status: BenefitStatus;
  amountUsed: number;
}

interface CardBenefitCardProps {
  card: CardCatalogEntry;
  benefitStates: Record<string, BenefitState>;
  onUpdateBenefit: (benefitId: string, status: BenefitStatus) => Promise<void>;
}

export default function CardBenefitCard({
  card,
  benefitStates,
  onUpdateBenefit,
}: CardBenefitCardProps) {
  const [selectedBenefitId, setSelectedBenefitId] = useState<string | null>(null);

  const totalValue = card.benefits.reduce((sum, b) => sum + b.dollarValue, 0);
  const capturedValue = card.benefits.reduce((sum, b) => {
    const state = benefitStates[b.id];
    if (!state || state.status === "unused" || state.status === "expired") return sum;
    if (state.status === "used") return sum + b.dollarValue;
    if (state.status === "partial") return sum + state.amountUsed;
    return sum;
  }, 0);
  const captureRate = totalValue > 0 ? Math.round((capturedValue / totalValue) * 100) : 0;
  const netROI = capturedValue - card.annualFee;

  const selectedBenefit = selectedBenefitId
    ? card.benefits.find((b) => b.id === selectedBenefitId)
    : null;

  // Sort benefits: expiring soon first, then by value
  const sortedBenefits = [...card.benefits].sort((a, b) => {
    const aExpires = a.expiresAt ? new Date(a.expiresAt).getTime() : Infinity;
    const bExpires = b.expiresAt ? new Date(b.expiresAt).getTime() : Infinity;
    if (aExpires !== bExpires) return aExpires - bExpires;
    return b.dollarValue - a.dollarValue;
  });

  return (
    <>
      <div className="card">
        {/* Card header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className={`inline-flex items-center px-3 py-1 rounded-lg bg-gradient-to-r ${card.color} mb-2`}>
              <span className="text-white text-xs font-semibold">{card.issuer}</span>
            </div>
            <h3 className="font-semibold text-gray-900">{card.name}</h3>
            <p className="text-sm text-gray-400">
              {card.annualFee === 0 ? "No annual fee" : `$${card.annualFee}/yr annual fee`}
            </p>
          </div>
          <div className="text-right space-y-1.5">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Net ROI</p>
              <p className={`text-lg font-bold ${netROI >= 0 ? "text-green-600" : "text-red-500"}`}>
                {netROI >= 0 ? "+" : ""}{formatCurrency(netROI)}
              </p>
            </div>
            <Link
              href={`/upload?card=${card.id}`}
              className="inline-flex items-center gap-1 text-[11px] text-gray-400 hover:text-brand-600 transition-colors"
            >
              <Upload className="w-3 h-3" />
              Upload Statement
            </Link>
          </div>
        </div>

        {/* Capture progress */}
        {totalValue > 0 && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs text-gray-500">Benefits captured</span>
              <span className="text-xs font-semibold text-gray-700">
                {formatCurrency(capturedValue)} / {formatCurrency(totalValue)} ({captureRate}%)
              </span>
            </div>
            <ProgressBar value={captureRate} color="green" />
          </div>
        )}

        {/* Benefits list */}
        {card.benefits.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            This card earns cash back or points — no specific credits to track.
          </p>
        ) : (
          <div className="-mx-2">
            {sortedBenefits.map((benefit) => {
              const state = benefitStates[benefit.id] ?? { status: "unused" as BenefitStatus, amountUsed: 0 };
              return (
                <BenefitItem
                  key={benefit.id}
                  benefit={benefit}
                  status={state.status}
                  amountUsed={state.amountUsed}
                  onClick={() => setSelectedBenefitId(benefit.id)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedBenefit && (
        <BenefitDetailModal
          benefit={selectedBenefit}
          cardName={card.name}
          status={benefitStates[selectedBenefit.id]?.status ?? "unused"}
          amountUsed={benefitStates[selectedBenefit.id]?.amountUsed ?? 0}
          onClose={() => setSelectedBenefitId(null)}
          onMarkUsed={async (id, status) => {
            await onUpdateBenefit(id, status);
          }}
        />
      )}
    </>
  );
}
