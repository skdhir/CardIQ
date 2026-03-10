import { cn } from "@/lib/utils";
import type { BenefitStatus } from "@/types";

interface BadgeProps {
  status: BenefitStatus;
  className?: string;
}

const config: Record<BenefitStatus, { label: string; classes: string }> = {
  used: { label: "Used", classes: "bg-green-100 text-green-700" },
  partial: { label: "Partial", classes: "bg-yellow-100 text-yellow-700" },
  unused: { label: "Unused", classes: "bg-gray-100 text-gray-600" },
  expired: { label: "Expired", classes: "bg-red-100 text-red-600" },
};

export default function Badge({ status, className }: BadgeProps) {
  const { label, classes } = config[status];
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
        classes,
        className
      )}
    >
      {label}
    </span>
  );
}
