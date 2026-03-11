"use client";

import { AlertTriangle, Info } from "lucide-react";

interface ConfidenceWarningProps {
  confidence: "HIGH" | "MEDIUM" | "LOW";
}

export default function ConfidenceWarning({ confidence }: ConfidenceWarningProps) {
  if (confidence === "HIGH") return null;

  if (confidence === "LOW") {
    return (
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mt-2">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700">
          <span className="font-semibold">Low confidence:</span> Some data could not be fully verified.
          Please confirm details with your card issuer before acting on this information.
        </p>
      </div>
    );
  }

  // MEDIUM
  return (
    <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 mt-2">
      <Info className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
      <p className="text-xs text-gray-500">
        <span className="font-semibold">Medium confidence:</span> Some estimates may be approximate.
        Verify current terms with your card issuer.
      </p>
    </div>
  );
}
