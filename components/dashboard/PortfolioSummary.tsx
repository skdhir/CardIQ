import type { PortfolioSummary as PortfolioSummaryType } from "@/types";
import ProgressBar from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, DollarSign, AlertCircle, CreditCard } from "lucide-react";

interface Props {
  summary: PortfolioSummaryType;
}

export default function PortfolioSummary({ summary }: Props) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-semibold text-gray-900">Portfolio Overview</h2>
        <span className="text-xs text-gray-400">{summary.cardCount} cards tracked</span>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
        <Metric
          icon={<CreditCard className="w-4 h-4 text-gray-400" />}
          label="Annual Fees"
          value={formatCurrency(summary.totalAnnualFees)}
          sub="total paid"
        />
        <Metric
          icon={<TrendingUp className="w-4 h-4 text-green-500" />}
          label="Benefits Captured"
          value={formatCurrency(summary.totalCaptured)}
          sub="this year"
          highlight="green"
        />
        <Metric
          icon={<AlertCircle className="w-4 h-4 text-red-400" />}
          label="Left on Table"
          value={formatCurrency(summary.totalMissed)}
          sub="unclaimed"
          highlight="red"
        />
        <Metric
          icon={<DollarSign className="w-4 h-4 text-brand-500" />}
          label="Total Available"
          value={formatCurrency(summary.totalBenefitValue)}
          sub="in benefits"
        />
      </div>

      {/* Capture rate bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-gray-700">Overall Capture Rate</span>
          <span className="text-sm font-bold text-gray-900">{summary.captureRate}%</span>
        </div>
        <ProgressBar value={summary.captureRate} color="green" className="h-3" />
        <p className="text-xs text-gray-400 mt-1.5">
          Target: 70% capture rate within 90 days
        </p>
      </div>
    </div>
  );
}

function Metric({
  icon,
  label,
  value,
  sub,
  highlight,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  highlight?: "green" | "red";
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-3">
      <div className="flex items-center gap-1.5 mb-1">{icon}<span className="text-xs text-gray-500">{label}</span></div>
      <p
        className={`text-xl font-bold ${
          highlight === "green" ? "text-green-600" : highlight === "red" ? "text-red-500" : "text-gray-900"
        }`}
      >
        {value}
      </p>
      <p className="text-xs text-gray-400">{sub}</p>
    </div>
  );
}
