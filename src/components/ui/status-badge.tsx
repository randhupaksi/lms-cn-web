import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type StatusTone = "neutral" | "success" | "warning" | "danger";

const toneClass: Record<StatusTone, string> = {
  neutral: "",
  success: "status-active",
  warning: "status-warning",
  danger: "status-danger",
};

export function StatusBadge({
  tone = "neutral",
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: StatusTone }) {
  return <span className={cn("status-badge", toneClass[tone], className)} {...props} />;
}
