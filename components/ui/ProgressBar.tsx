import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0–100
  className?: string;
  color?: "brand" | "green" | "yellow" | "red";
}

const colorClasses = {
  brand: "bg-brand-500",
  green: "bg-green-500",
  yellow: "bg-yellow-400",
  red: "bg-red-500",
};

export default function ProgressBar({
  value,
  className,
  color = "brand",
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));
  const barColor =
    pct >= 70 ? colorClasses.green : pct >= 40 ? colorClasses.yellow : colorClasses.red;

  return (
    <div className={cn("h-2 bg-gray-100 rounded-full overflow-hidden", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500", color === "brand" ? colorClasses.brand : barColor)}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
