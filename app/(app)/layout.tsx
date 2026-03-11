import Sidebar from "@/components/layout/Sidebar";
import ChatWidget from "@/components/ChatWidget";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 md:ml-60 overflow-auto pt-14 md:pt-0">
        <div className="max-w-5xl mx-auto px-4 py-6 sm:px-8 sm:py-8">{children}</div>
      </main>
      <ChatWidget />
    </div>
  );
}
