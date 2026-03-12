"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
  CreditCard,
  LayoutDashboard,
  Zap,
  Bell,
  PieChart,
  UserCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/optimizer", label: "Optimizer", icon: Zap },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/portfolio", label: "Portfolio", icon: PieChart },
  { href: "/profile", label: "Profile", icon: UserCircle },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => { if (data.name) setUserName(data.name); })
      .catch(() => {});
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  async function handleSignOut() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="h-16 flex items-center gap-2.5 px-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shrink-0">
          <CreditCard className="w-4 h-4 text-white" />
        </div>
        <span className="text-lg font-bold text-gray-900">CardIQ</span>
        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="ml-auto md:hidden p-1.5 hover:bg-gray-100 rounded-lg"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Greeting */}
      {userName && (
        <div className="px-5 py-3 border-b border-gray-100">
          <p className="text-sm text-gray-500">Hi, <span className="font-semibold text-gray-900">{userName}</span></p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className={cn("w-4 h-4", active ? "text-brand-600" : "text-gray-400")} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 pb-4">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors w-full text-left"
        >
          <LogOut className="w-4 h-4 text-gray-400" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-100 flex items-center px-4 z-30 md:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 hover:bg-gray-100 rounded-lg"
        >
          <Menu className="w-5 h-5 text-gray-700" />
        </button>
        <div className="flex items-center gap-2 ml-3">
          <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center">
            <CreditCard className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-base font-bold text-gray-900">CardIQ</span>
        </div>
        {userName && (
          <span className="ml-auto text-sm text-gray-500">Hi, <span className="font-semibold text-gray-700">{userName}</span></span>
        )}
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop: always visible, mobile: drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-60 bg-white border-r border-gray-100 flex flex-col z-50 transition-transform duration-200",
          "md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
