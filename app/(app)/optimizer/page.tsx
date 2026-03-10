"use client";

import { useEffect, useState } from "react";
import type { Transaction } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CheckCircle, AlertTriangle, Loader2, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

const CATEGORY_LABELS: Record<string, string> = {
  dining: "Dining",
  groceries: "Groceries",
  travel: "Travel",
  gas: "Gas",
  streaming: "Streaming",
  shopping: "Shopping",
  drugstore: "Drugstore",
};

export default function OptimizerPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalMissed, setTotalMissed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "suboptimal">("all");
  const [aiQuery, setAiQuery] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/transactions")
      .then((r) => r.json())
      .then(({ transactions: t, totalMissed: m }) => {
        setTransactions(t ?? []);
        setTotalMissed(m ?? 0);
        setLoading(false);
      });
  }, []);

  const displayed = filter === "suboptimal"
    ? transactions.filter((t) => !t.isOptimal)
    : transactions;

  // Category summary
  const categoryStats = transactions.reduce<Record<string, { total: number; missed: number; txns: number }>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = { total: 0, missed: 0, txns: 0 };
    acc[t.category].total += t.amount;
    acc[t.category].missed += t.missedValue;
    acc[t.category].txns++;
    return acc;
  }, {});

  async function handleAIQuery(e: React.FormEvent) {
    e.preventDefault();
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResult("");

    const userCards = [
      { id: "amex-gold", name: "Amex Gold", rewards: "4x dining, 4x groceries, 3x flights" },
      { id: "chase-sapphire-preferred", name: "Chase Sapphire Preferred", rewards: "5x Chase Travel, 3x dining, 3x streaming" },
      { id: "chase-freedom-unlimited", name: "Chase Freedom Unlimited", rewards: "3% dining/drugstores, 1.5% everything else" },
    ];

    const res = await fetch("/api/ai/optimize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        merchant: aiQuery,
        category: "general",
        userCards,
      }),
    });
    const data = await res.json();
    setAiResult(data.recommendation ?? "Unable to get a recommendation.");
    setAiLoading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Purchase Optimizer</h1>
        <p className="text-sm text-gray-500 mt-0.5">See where you&apos;re leaving rewards on the table</p>
      </div>

      {/* Summary banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-red-500">{formatCurrency(totalMissed)}</p>
          <p className="text-sm text-gray-500 mt-1">Missed rewards (90 days)</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-gray-900">
            {transactions.filter((t) => !t.isOptimal).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">Suboptimal transactions</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-600">
            {transactions.length > 0
              ? Math.round((transactions.filter((t) => t.isOptimal).length / transactions.length) * 100)
              : 0}%
          </p>
          <p className="text-sm text-gray-500 mt-1">Optimal card usage rate</p>
        </div>
      </div>

      {/* AI Ask Panel */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <h2 className="text-sm font-semibold text-brand-700">Ask AI: Which card should I use?</h2>
        </div>
        <form onSubmit={handleAIQuery} className="flex gap-2">
          <input
            type="text"
            value={aiQuery}
            onChange={(e) => setAiQuery(e.target.value)}
            className="input flex-1"
            placeholder='e.g., "Whole Foods", "Delta flight", "Netflix subscription"'
          />
          <button type="submit" disabled={aiLoading} className="btn-primary px-4">
            {aiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ask"}
          </button>
        </form>
        {aiResult && (
          <div className="mt-3 bg-brand-50 rounded-xl p-3 text-sm text-gray-700 leading-relaxed">
            {aiResult}
          </div>
        )}
      </div>

      {/* Category breakdown */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Spending by Category (90 days)</h2>
        <div className="space-y-2">
          {Object.entries(categoryStats)
            .sort((a, b) => b[1].missed - a[1].missed)
            .map(([cat, stats]) => (
              <div key={cat} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-24 shrink-0">
                  {CATEGORY_LABELS[cat] ?? cat}
                </span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-400 rounded-full"
                    style={{ width: `${Math.min(100, (stats.total / 700) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-700 w-20 text-right shrink-0">
                  {formatCurrency(stats.total)}
                </span>
                {stats.missed > 0 && (
                  <span className="text-xs text-red-500 w-20 text-right shrink-0">
                    -{formatCurrency(stats.missed)} missed
                  </span>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Transaction feed */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Recent Transactions</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === "all" ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("suboptimal")}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                filter === "suboptimal" ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Suboptimal only
            </button>
          </div>
        </div>

        <div className="space-y-1">
          {displayed.map((txn) => (
            <div key={txn.id}>
              <button
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                onClick={() => setExpandedId(expandedId === txn.id ? null : txn.id)}
              >
                {/* Status icon */}
                {txn.isOptimal ? (
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-orange-400 shrink-0" />
                )}

                {/* Date */}
                <span className="text-xs text-gray-400 w-20 shrink-0">{formatDate(txn.date)}</span>

                {/* Merchant */}
                <span className="flex-1 text-sm font-medium text-gray-800 truncate">{txn.merchant}</span>

                {/* Category */}
                <span className="text-xs text-gray-400 hidden sm:block w-20 shrink-0">
                  {CATEGORY_LABELS[txn.category] ?? txn.category}
                </span>

                {/* Amount */}
                <span className="text-sm font-semibold text-gray-900 w-16 text-right shrink-0">
                  {formatCurrency(txn.amount)}
                </span>

                {/* Missed value */}
                {txn.missedValue > 0 ? (
                  <span className="text-xs text-red-500 font-medium w-20 text-right shrink-0">
                    -{formatCurrency(txn.missedValue)}
                  </span>
                ) : (
                  <span className="w-20 shrink-0" />
                )}

                {expandedId === txn.id ? (
                  <ChevronUp className="w-4 h-4 text-gray-300 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-300 shrink-0" />
                )}
              </button>

              {/* Expanded detail */}
              {expandedId === txn.id && (
                <div className="mx-3 mb-2 bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-600 space-y-1.5">
                  <div className="flex gap-2">
                    <span className="text-gray-400">Card used:</span>
                    <span className="font-medium text-gray-700">{txn.cardUsedName}</span>
                  </div>
                  {!txn.isOptimal && (
                    <div className="flex gap-2">
                      <span className="text-gray-400">Optimal card:</span>
                      <span className="font-medium text-green-700">{txn.optimalCardName}</span>
                    </div>
                  )}
                  {txn.missedValue > 0 && (
                    <div className="flex gap-2">
                      <span className="text-gray-400">Missed value:</span>
                      <span className="font-medium text-red-600">{formatCurrency(txn.missedValue)}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
