"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, Mail, ArrowRight } from "lucide-react";

type Step = "form" | "confirm-email";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? "Signup failed");
      setLoading(false);
    } else {
      setLoading(false);
      setStep("confirm-email");
    }
  }

  // ── Email confirmation screen ──────────────────────────────────────────────
  if (step === "confirm-email") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">CardIQ</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-brand-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">Check your email</h1>
            <p className="text-sm text-gray-500 mb-1">
              We sent a confirmation link to
            </p>
            <p className="text-sm font-medium text-gray-900 mb-6">{email}</p>
            <p className="text-xs text-gray-400 mb-8">
              Click the link in the email to verify your account, then come back here to continue.
            </p>

            <button
              onClick={() => router.push("/onboarding")}
              className="btn-primary w-full py-2.5 flex items-center justify-center gap-2"
            >
              Continue to setup
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-xs text-gray-400 mt-4">
              Didn&apos;t receive it?{" "}
              <button
                onClick={() => setStep("form")}
                className="text-brand-600 hover:text-brand-700 font-medium"
              >
                Try again
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Signup form ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">CardIQ</span>
          </div>
          <p className="text-gray-500 text-sm">Start maximizing your credit card benefits</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Create your account</h1>
          <p className="text-sm text-gray-500 mb-6">Free forever. No credit card required.</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="At least 8 characters"
                minLength={8}
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5">
              {loading ? "Creating account…" : "Create free account"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-600 hover:text-brand-700 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
