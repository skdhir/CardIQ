"use client";

import { ChevronRight, Clock } from "lucide-react";
import type { CardBenefit, BenefitStatus } from "@/types";
import Badge from "@/components/ui/Badge";
import { formatCurrency, getDaysUntil } from "@/lib/utils";

interface BenefitItemProps {
  benefit: CardBenefit;
  status: BenefitStatus;
  amountUsed: number;
  onClick: () => void;
}

export default function BenefitItem({
  benefit,
  status,
  amountUsed,
  onClick,
}: BenefitItemProps) {
  const daysLeft = benefit.expiresAt ? getDaysUntil(benefit.expiresAt) : null;
  const isExpiringSoon = daysLeft !== null && daysLeft <= 14 && daysLeft >= 0;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-colors text-left group"
    >
      {/* Dollar value */}
      <div className="w-14 text-right shrink-0">
        <span className="text-sm font-semibold text-gray-900">
          {formatCurrency(benefit.dollarValue)}
        </span>
      </div>

      {/* Benefit name + expiry */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{benefit.name}</p>
        {isExpiringSoon && (
          <div className="flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3 text-red-500" />
            <span className="text-xs text-red-600 font-medium">
              Expires in {daysLeft}d
            </span>
          </div>
        )}
        {amountUsed > 0 && status === "partial" && (
          <p className="text-xs text-gray-400 mt-0.5">
            {formatCurrency(amountUsed)} of {formatCurrency(benefit.dollarValue)} used
          </p>
        )}
      </div>

      {/* Status badge */}
      <Badge status={status} />

      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-400 shrink-0" />
    </button>
  );
}
