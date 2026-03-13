"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { CardCatalogEntry } from "@/types";
import { Upload, FileText, Loader2, CheckCircle, AlertTriangle, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

function UploadPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [cards, setCards] = useState<CardCatalogEntry[]>([]);
  const [selectedCard, setSelectedCard] = useState("");
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    imported: number;
    total: number;
    totalMissed: number;
  } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/cards/user")
      .then((r) => r.json())
      .then(({ cards: c }) => {
        setCards(c ?? []);
        const preselect = searchParams.get("card");
        if (preselect && c?.some((card: CardCatalogEntry) => card.id === preselect)) {
          setSelectedCard(preselect);
        } else if (c?.length > 0) {
          setSelectedCard(c[0].id);
        }
        setLoading(false);
      });
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    const isPDF = f.type === "application/pdf" || f.name.toLowerCase().endsWith(".pdf");
    const isCSV = f.type === "text/csv" || f.name.toLowerCase().endsWith(".csv");

    if (!isPDF && !isCSV) {
      setError("Please upload a PDF or CSV file.");
      setFile(null);
      return;
    }

    if (f.size > 10 * 1024 * 1024) {
      setError("File too large (max 10 MB).");
      setFile(null);
      return;
    }

    setError("");
    setResult(null);
    setFile(f);
  }

  async function handleUpload() {
    if (!file || !selectedCard) return;
    setUploading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("cardId", selectedCard);
    formData.append("file", file);

    try {
      const res = await fetch("/api/transactions/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
      } else {
        setResult({
          success: true,
          imported: data.imported,
          total: data.total,
          totalMissed: data.totalMissed,
        });
      }
    } catch {
      setError("Network error — please try again.");
    }
    setUploading(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Upload Statement</h1>
        <div className="card text-center py-12">
          <p className="text-gray-500">Add cards to your portfolio first before uploading statements.</p>
          <button onClick={() => router.push("/dashboard")} className="btn-primary mt-4">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const selectedCardObj = cards.find((c) => c.id === selectedCard);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Upload Statement</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Upload a PDF or CSV credit card statement to analyze your spending
        </p>
      </div>

      {/* Step 1: Select card */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">1. Select the card this statement is for</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => { setSelectedCard(card.id); setResult(null); setError(""); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left ${
                selectedCard === card.id
                  ? "border-brand-500 bg-brand-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className={`w-8 h-5 rounded bg-gradient-to-r ${card.color}`} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{card.name}</p>
                <p className="text-xs text-gray-400">{card.issuer}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Upload file */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">2. Upload your statement</h2>

        <div
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            file
              ? "border-brand-300 bg-brand-50"
              : "border-gray-300 hover:border-brand-400 hover:bg-gray-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.csv"
            onChange={handleFileChange}
            className="hidden"
          />

          {file ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-8 h-8 text-brand-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{file.name}</p>
                <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(0)} KB</p>
              </div>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-600 font-medium">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-400 mt-1">PDF or CSV, up to 10 MB</p>
            </>
          )}
        </div>

        {file && (
          <p className="text-xs text-gray-400 mt-2 text-center">
            Click the area above to change file
          </p>
        )}
      </div>

      {/* Step 3: Process */}
      <div className="card">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">3. Process with AI</h2>
        <p className="text-xs text-gray-500 mb-4">
          Claude will read your statement, extract transactions, and categorize each merchant for rewards optimization.
          {selectedCardObj && (
            <span className="font-medium text-gray-700"> Transactions will be tagged to your {selectedCardObj.name}.</span>
          )}
        </p>

        <button
          onClick={handleUpload}
          disabled={!file || !selectedCard || uploading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing statement...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload & Analyze
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="card border-red-200 bg-red-50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Success */}
      {result && (
        <div className="card border-green-200 bg-green-50">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
            <div className="space-y-2">
              <p className="text-sm font-semibold text-green-800">
                Successfully imported {result.imported} transactions
              </p>
              <p className="text-sm text-green-700">
                Total transactions across all cards: {result.total}
              </p>
              {result.totalMissed > 0 && (
                <p className="text-sm text-green-700">
                  Potential missed rewards identified: <span className="font-semibold">{formatCurrency(result.totalMissed)}</span>
                </p>
              )}
              <button
                onClick={() => router.push("/optimizer")}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:text-brand-800 mt-2"
              >
                View in Purchase Optimizer <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sample files for demo */}
      <div className="card">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Sample Statements (for testing)</p>
        <div className="flex flex-wrap gap-2">
          <a href="/samples/amex-platinum-statement.csv" download className="text-xs text-brand-600 hover:text-brand-700 underline">
            Amex Platinum CSV
          </a>
          <a href="/samples/chase-sapphire-reserve-statement.csv" download className="text-xs text-brand-600 hover:text-brand-700 underline">
            Chase Sapphire Reserve CSV
          </a>
          <a href="/samples/amex-gold-statement.csv" download className="text-xs text-brand-600 hover:text-brand-700 underline">
            Amex Gold CSV
          </a>
          <a href="/samples/capital-one-venture-x-statement.csv" download className="text-xs text-brand-600 hover:text-brand-700 underline">
            Capital One Venture X CSV
          </a>
          <a href="/samples/chase-freedom-unlimited-statement.csv" download className="text-xs text-brand-600 hover:text-brand-700 underline">
            Chase Freedom Unlimited CSV
          </a>
        </div>
      </div>

      <p className="text-[10px] text-gray-400 text-center">
        Your statement is processed by Claude AI for transaction extraction only. CardIQ does not store the original PDF/CSV file.
      </p>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
      </div>
    }>
      <UploadPageContent />
    </Suspense>
  );
}
