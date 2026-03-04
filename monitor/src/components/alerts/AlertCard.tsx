import { useState } from "react";
import { formatDistanceToNow, format } from "date-fns";
import {
  Truck, User, Wrench, Fuel, MapPin, Server, Package, AlertCircle,
  Check, CheckCheck, MessageSquare, ChevronDown, ChevronUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Alert } from "@/types";
import SeverityBadge from "./SeverityBadge";
import { useAcknowledgeAlert, useResolveAlert } from "@/hooks/useAlerts";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const SOURCE_ICONS: Record<string, React.ElementType> = {
  vehicle:     Truck,
  driver:      User,
  maintenance: Wrench,
  fuel:        Fuel,
  geofence:    MapPin,
  system:      Server,
  load:        Package,
  tyre:        AlertCircle,
  trip:        MapPin,
  manual:      AlertCircle,
};

const BORDER_COLORS: Record<string, string> = {
  critical: "border-l-red-500",
  high:     "border-l-orange-500",
  medium:   "border-l-amber-500",
  low:      "border-l-blue-500",
  info:     "border-l-gray-500",
};

interface AlertCardProps {
  alert: Alert;
}

export default function AlertCard({ alert }: AlertCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { user } = useAuth();
  const acknowledge = useAcknowledgeAlert();
  const resolve = useResolveAlert();

  const SourceIcon = SOURCE_ICONS[alert.source_type] ?? AlertCircle;
  const isActive = alert.status === "active";
  const isAcknowledged = alert.status === "acknowledged";

  const handleAcknowledge = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await acknowledge.mutateAsync({ alertId: alert.id, userId: user.id });
      toast.success("Alert acknowledged");
    } catch {
      toast.error("Failed to acknowledge alert");
    }
  };

  const handleResolve = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await resolve.mutateAsync({ alertId: alert.id });
      toast.success("Alert resolved");
    } catch {
      toast.error("Failed to resolve alert");
    }
  };

  const metaKeys = Object.keys(alert.metadata ?? {}).filter(
    (k) => !["lat", "lng"].includes(k)
  );

  return (
    <div
      className={cn(
        "bg-card border border-border border-l-4 rounded-lg overflow-hidden transition-shadow hover:shadow-md",
        BORDER_COLORS[alert.severity] ?? "border-l-gray-500",
        alert.severity === "critical" && isActive && "critical-pulse"
      )}
    >
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start gap-3">
          {/* Source icon */}
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
            <SourceIcon className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <SeverityBadge severity={alert.severity} dot />
              {alert.status !== "active" && (
                <span className={cn(
                  "text-[10px] font-semibold px-2 py-0.5 rounded-full border",
                  alert.status === "acknowledged" ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                  alert.status === "resolved" ? "bg-green-500/10 text-green-400 border-green-500/20" :
                  "bg-gray-500/10 text-gray-400 border-gray-500/20"
                )}>
                  {alert.status.toUpperCase()}
                </span>
              )}
              <span className="text-xs text-muted-foreground ml-auto flex-shrink-0" title={format(new Date(alert.triggered_at), "PPpp")}>
                {formatDistanceToNow(new Date(alert.triggered_at), { addSuffix: true })}
              </span>
            </div>

            <p className="text-sm font-semibold text-foreground">{alert.title}</p>

            {alert.source_label && (
              <p className="text-xs text-primary mt-0.5">{alert.source_label}</p>
            )}

            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{alert.message}</p>
          </div>
        </div>

        {/* Expanded metadata */}
        {expanded && metaKeys.length > 0 && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {metaKeys.map((key) => (
                <div key={key} className="flex flex-col">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{key.replace(/_/g, " ")}</span>
                  <span className="text-xs text-foreground">{String(alert.metadata[key])}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action row */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
          {isActive && (
            <button
              onClick={handleAcknowledge}
              disabled={acknowledge.isPending}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors disabled:opacity-50"
            >
              <Check className="h-3 w-3" />
              Acknowledge
            </button>
          )}
          {(isActive || isAcknowledged) && (
            <button
              onClick={handleResolve}
              disabled={resolve.isPending}
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors disabled:opacity-50"
            >
              <CheckCheck className="h-3 w-3" />
              Resolve
            </button>
          )}
          <Link
            to={`/alerts/${alert.id}`}
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded bg-muted text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <MessageSquare className="h-3 w-3" />
            Details
          </Link>

          {metaKeys.length > 0 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
            >
              {expanded
                ? <ChevronUp className="h-3.5 w-3.5" />
                : <ChevronDown className="h-3.5 w-3.5" />
              }
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
