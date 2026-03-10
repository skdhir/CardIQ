"use client";

import { useRouter } from "next/navigation";
import { CreditCard, Building2, ArrowRight, Shield, Zap, RefreshCw } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo + Welcome */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">CardIQ</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Connect your cards</h1>
          <p className="text-gray-500 text-sm">Link your accounts to automatically import your cards and start tracking benefits</p>
        </div>

        {/* Primary Plaid CTA */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
              <Building2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-semibold text-gray-900">Connect through Plaid</h2>
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Recommended</span>
              </div>
              <p className="text-xs text-gray-400">Secure · Takes 2 minutes</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <Shield className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Bank-level security</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <Zap className="w-5 h-5 text-brand-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Auto card import</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-xl">
              <RefreshCw className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Live transactions</p>
            </div>
          </div>

          <button
            onClick={() => router.push("/onboarding/plaid")}
            className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-base"
          >
            Connect through Plaid
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Secondary manual option */}
        <button
          onClick={() => router.push("/onboarding/manual")}
          className="w-full bg-white rounded-xl shadow-sm border border-gray-100 px-5 py-4 flex items-center gap-3 hover:border-brand-200 hover:shadow-md transition-all text-left mb-3"
        >
          <div className="w-9 h-9 bg-brand-50 rounded-lg flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4 text-brand-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">Add cards manually</p>
            <p className="text-xs text-gray-400">Pick from our 20+ card catalog</p>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300 shrink-0" />
        </button>

        {/* Skip */}
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full text-center text-xs text-gray-400 hover:text-gray-600 py-2 transition-colors"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
