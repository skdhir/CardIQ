"use client";

import { useState } from "react";
import { Flag, Loader2, CheckCircle } from "lucide-react";

interface ReportIssueButtonProps {
  context: string; // e.g., "benefit:amex-dining" or "optimizer:whole-foods" or "portfolio:amex-plat"
}

export default function ReportIssueButton({ context }: ReportIssueButtonProps) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit() {
    if (!feedback.trim()) return;
    setSending(true);
    try {
      await fetch("/api/ai/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, feedback: feedback.trim() }),
      });
      setSent(true);
      setTimeout(() => { setOpen(false); setSent(false); setFeedback(""); }, 2000);
    } catch {
      // Silently fail — non-critical
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-green-600 mt-2">
        <CheckCircle className="w-3 h-3" />
        Thanks for your feedback
      </div>
    );
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 transition-colors mt-2"
      >
        <Flag className="w-3 h-3" />
        Report an issue with this AI result
      </button>
    );
  }

  return (
    <div className="mt-2 space-y-2">
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="What looks wrong? (e.g., incorrect benefit amount, wrong card recommendation)"
        className="w-full text-xs border border-gray-200 rounded-lg p-2 resize-none focus:outline-none focus:ring-1 focus:ring-brand-500"
        rows={2}
      />
      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={sending || !feedback.trim()}
          className="text-xs px-3 py-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700 disabled:opacity-50 flex items-center gap-1.5"
        >
          {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
          Submit
        </button>
        <button
          onClick={() => { setOpen(false); setFeedback(""); }}
          className="text-xs px-3 py-1.5 text-gray-500 hover:text-gray-700"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
