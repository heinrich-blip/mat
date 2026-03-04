import { cn } from "@/lib/utils";
import type { AlertSeverity } from "@/types";

interface SeverityBadgeProps {
  severity: AlertSeverity;
  size?: "sm" | "md";
  dot?: boolean;
}

const SEVERITY_CONFIG: Record<AlertSeverity, { label: string; classes: string; dot: string }> = {
  critical: { label: "CRITICAL", classes: "bg-red-500/20 text-red-400 border-red-500/30",     dot: "bg-red-500" },
  high:     { label: "HIGH",     classes: "bg-orange-500/20 text-orange-400 border-orange-500/30", dot: "bg-orange-500" },
  medium:   { label: "MEDIUM",   classes: "bg-amber-500/20 text-amber-400 border-amber-500/30",   dot: "bg-amber-500" },
  low:      { label: "LOW",      classes: "bg-blue-500/20 text-blue-400 border-blue-500/30",    dot: "bg-blue-500" },
  info:     { label: "INFO",     classes: "bg-gray-500/20 text-gray-400 border-gray-500/30",    dot: "bg-gray-500" },
};

export default function SeverityBadge({ severity, size = "sm", dot = false }: SeverityBadgeProps) {
  const config = SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.info;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold border rounded-full",
        config.classes,
        size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-2.5 py-1"
      )}
    >
      {dot && (
        <span
          className={cn(
            "rounded-full flex-shrink-0",
            config.dot,
            size === "sm" ? "w-1.5 h-1.5" : "w-2 h-2",
            severity === "critical" && "animate-pulse"
          )}
        />
      )}
      {config.label}
    </span>
  );
}

export { SEVERITY_CONFIG };
