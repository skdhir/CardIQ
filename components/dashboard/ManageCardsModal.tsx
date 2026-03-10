"use client";

import { useState } from "react";
import { X, Plus, Trash2, Search } from "lucide-react";
import { CARD_CATALOG } from "@/lib/mock-data/cards";
import type { CardCatalogEntry } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ManageCardsModalProps {
  userCards: CardCatalogEntry[];
  onClose: () => void;
  onAdd: (cardId: string) => Promise<void>;
  onRemove: (cardId: string) => Promise<void>;
}

const TIER_LABELS: Record<string, string> = {
  premium: "Premium Travel",
  "mid-tier": "Mid-Tier Rewards",
  "cash-back": "Cash Back",
  "hotel-airline": "Hotel & Airline",
};

export default function ManageCardsModal({
  userCards,
  onClose,
  onAdd,
  onRemove,
}: ManageCardsModalProps) {
  const [search, setSearch] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [tab, setTab] = useState<"my-cards" | "add-cards">("my-cards");

  const userCardIds = new Set(userCards.map((c) => c.id));

  const filteredCatalog = CARD_CATALOG.filter(
    (c) =>
      !userCardIds.has(c.id) &&
      (search === "" ||
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.issuer.toLowerCase().includes(search.toLowerCase()))
  );

  // Group by tier
  const byTier = filteredCatalog.reduce<Record<string, CardCatalogEntry[]>>(
    (acc, card) => {
      if (!acc[card.tier]) acc[card.tier] = [];
      acc[card.tier].push(card);
      return acc;
    },
    {}
  );

  async function handleAdd(cardId: string) {
    setLoadingId(cardId);
    await onAdd(cardId);
    setLoadingId(null);
  }

  async function handleRemove(cardId: string) {
    setLoadingId(cardId);
    await onRemove(cardId);
    setLoadingId(null);
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">Manage Cards</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 shrink-0">
          <button
            onClick={() => setTab("my-cards")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === "my-cards"
                ? "text-brand-700 border-b-2 border-brand-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            My Cards ({userCards.length})
          </button>
          <button
            onClick={() => setTab("add-cards")}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              tab === "add-cards"
                ? "text-brand-700 border-b-2 border-brand-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Add Cards
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {tab === "my-cards" && (
            <div className="p-4 space-y-2">
              {userCards.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">
                  No cards added yet. Switch to &quot;Add Cards&quot; to get started.
                </p>
              )}
              {userCards.map((card) => (
                <div
                  key={card.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50"
                >
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} shrink-0`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{card.name}</p>
                    <p className="text-xs text-gray-400">
                      {card.annualFee === 0 ? "No annual fee" : `${formatCurrency(card.annualFee)}/yr`}
                      {" · "}
                      {card.benefits.length} benefit{card.benefits.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemove(card.id)}
                    disabled={loadingId === card.id}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    title="Remove card"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {tab === "add-cards" && (
            <div className="p-4 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search cards…"
                  className="input pl-9"
                />
              </div>

              {filteredCatalog.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8">
                  {search ? "No cards match your search." : "All available cards are already in your portfolio!"}
                </p>
              )}

              {Object.entries(byTier).map(([tier, cards]) => (
                <div key={tier}>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    {TIER_LABELS[tier] ?? tier}
                  </p>
                  <div className="space-y-2">
                    {cards.map((card) => (
                      <div
                        key={card.id}
                        className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50"
                      >
                        <div
                          className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} shrink-0`}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{card.name}</p>
                          <p className="text-xs text-gray-400">
                            {card.annualFee === 0 ? "No annual fee" : `${formatCurrency(card.annualFee)}/yr`}
                            {card.benefits.length > 0 && ` · ${formatCurrency(card.benefits.reduce((s, b) => s + b.dollarValue, 0))} in benefits`}
                          </p>
                        </div>
                        <button
                          onClick={() => handleAdd(card.id)}
                          disabled={loadingId === card.id}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-600 text-white text-xs font-medium rounded-lg hover:bg-brand-700 transition-colors disabled:opacity-50 shrink-0"
                        >
                          <Plus className="w-3 h-3" />
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
