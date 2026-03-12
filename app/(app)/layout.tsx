import Sidebar from "@/components/layout/Sidebar";
import ChatWidget from "@/components/ChatWidget";
import { AlertTriangle } from "lucide-react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 md:ml-60 overflow-auto pt-14 md:pt-0">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-8 sm:py-8">
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-5 text-xs text-amber-800">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>CardIQ can make mistakes. AI-generated insights are informational only — not financial advice. Always verify with your card issuer.</span>
          </div>
          {children}
        </div>
      </main>
      <ChatWidget />
    </div>
  );
}
