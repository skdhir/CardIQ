import { type ClassValue, clsx } from "clsx";
import type { BenefitStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeTime(dateString: string): string {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diff = now - then;

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function getDaysUntil(dateString: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const target = new Date(dateString);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / 86400000);
}

export function getBenefitStatusColor(status: BenefitStatus): string {
  switch (status) {
    case "used":
      return "text-green-700 bg-green-100";
    case "partial":
      return "text-yellow-700 bg-yellow-100";
    case "unused":
      return "text-gray-600 bg-gray-100";
    case "expired":
      return "text-red-700 bg-red-100";
  }
}

export function getBenefitStatusLabel(status: BenefitStatus): string {
  switch (status) {
    case "used":
      return "Used";
    case "partial":
      return "Partial";
    case "unused":
      return "Unused";
    case "expired":
      return "Expired";
  }
}
