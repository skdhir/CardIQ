"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Lock, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";

// All cards imported across all linked accounts
const ALL_PLAID_CARDS = [
  "chase-sapphire-reserve",
  "amex-platinum",
  "citi-double-cash",
  "capital-one-venture-x",
];

const SCANNING_BANKS = [
  { name: "Chase", logo: "🏦" },
  { name: "American Express", logo: "💳" },
  { name: "Citi", logo: "🏛️" },
  { name: "Capital One", logo: "⚡" },
];

type Step = "credentials" | "connecting" | "success";

export default function PlaidOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("credentials");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [scanStep, setScanStep] = useState(0);

  async function handleConnect() {
    setStep("connecting");

    // Animate through each bank being scanned
    for (let i = 0; i <= SCANNING_BANKS.length; i++) {
      await new Promise((res) => setTimeout(res, 700));
      setScanStep(i);
    }

    // Save all cards
    for (const cardId of ALL_PLAID_CARDS) {
      await fetch("/api/cards/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardId }),
      });
    }

    setStep("success");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Step 1 — Credentials */}
        {step === "credentials" && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4 text-gray-400" />
              </button>
              <div>
                <h1 className="text-base font-semibold text-gray-900">Connect with Plaid</h1>
                <p className="text-xs text-gray-400">Secured · Read-only access</p>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2 bg-blue-50 rounded-xl px-3 py-2.5">
                <Lock className="w-4 h-4 text-blue-600 shrink-0" />
                <p className="text-xs text-blue-700">
                  Your credentials are encrypted end-to-end. CardIQ never stores or sees your password.
                </p>
              </div>

              {/* Bank logos */}
              <div className="flex items-center justify-center gap-3 py-2">
                {SCANNING_BANKS.map((b) => (
                  <div key={b.name} className="flex flex-col items-center gap-1">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-xl border border-gray-100">
                      {b.logo}
                    </div>
                    <span className="text-xs text-gray-400">{b.name}</span>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plaid username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input"
                  placeholder="Enter your username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plaid password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  placeholder="••••••••"
                />
              </div>

              <button
                onClick={handleConnect}
                disabled={!username || !password}
                className={`w-full py-2.5 rounded-xl font-medium transition-all ${
                  username && password
                    ? "btn-primary"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                Connect securely
              </button>

              <div className="flex items-center gap-2 justify-center">
                <Shield className="w-3.5 h-3.5 text-gray-300" />
                <p className="text-center text-xs text-gray-400">
                  256-bit encryption · Plaid&apos;s{" "}
                  <span className="text-brand-600 cursor-pointer">Terms</span> &{" "}
                  <span className="text-brand-600 cursor-pointer">Privacy Policy</span> apply
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 — Connecting / scanning banks */}
        {step === "connecting" && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-6">
              <Loader2 className="w-10 h-10 text-brand-500 animate-spin mx-auto mb-3" />
              <h2 className="text-lg font-semibold text-gray-900 mb-1">Scanning your accounts…</h2>
              <p className="text-sm text-gray-400">Importing cards and transactions from all linked banks</p>
            </div>

            <div className="space-y-3">
              {SCANNING_BANKS.map((bank, i) => (
                <div key={bank.name} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  scanStep > i ? "bg-green-50" : scanStep === i ? "bg-brand-50" : "bg-gray-50"
                }`}>
                  <span className="text-xl">{bank.logo}</span>
                  <span className="text-sm font-medium text-gray-700 flex-1">{bank.name}</span>
                  {scanStep > i ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : scanStep === i ? (
                    <Loader2 className="w-4 h-4 text-brand-500 animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 — Success */}
        {step === "success" && (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">All accounts connected!</h2>
            <p className="text-sm text-gray-500 mb-1">
              We found <strong>{ALL_PLAID_CARDS.length} credit cards</strong> across{" "}
              <strong>{SCANNING_BANKS.length} banks</strong>
            </p>
            <p className="text-xs text-gray-400 mb-6">
              and imported <strong>30 recent transactions</strong>
            </p>

            {/* Imported cards */}
            <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
              {ALL_PLAID_CARDS.map((cardId) => (
                <div key={cardId} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 shrink-0" />
                  <span className="text-sm text-gray-700">
                    {cardId.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push("/dashboard")}
              className="btn-primary w-full py-2.5"
            >
              Go to my Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
