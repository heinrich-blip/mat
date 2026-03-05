import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Alert } from "@/types";

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#f59e0b",
  low: "#3b82f6",
  info: "#6b7280",
};

const getToastOptions = (severity: string, color: string) => {
  const base = {
    duration: severity === "critical" ? 10_000 : severity === "high" ? 7_000 : 5_000,
    style: { borderLeft: `4px solid ${color}` },
  };

  if (severity === "critical") {
    return { ...base, variant: "error" as const };
  }
  if (severity === "high") {
    return { ...base, variant: "warning" as const };
  }
  return { ...base, variant: "default" as const };
};

export function useAlertStream() {
  const queryClient = useQueryClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    // Cleanup any previous channel subscription
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    const channel = supabase
      .channel("monitor-alert-stream")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "alerts" },
        (payload) => {
          const newAlert = payload.new as Alert;

          // Refresh related queries
          queryClient.invalidateQueries({ queryKey: ["alerts"] });
          queryClient.invalidateQueries({ queryKey: ["alert-counts"] });

          // Show toast notification
          const color = SEVERITY_COLORS[newAlert.severity] ?? "#6b7280";
          const { variant, duration, style } = getToastOptions(newAlert.severity, color);

          const message = `[${newAlert.severity.toUpperCase()}] ${newAlert.title}`;
          const description = `${newAlert.source_label ?? ""} • ${newAlert.message}`;

          // Use conditional rendering based on variant
          if (variant === "error") {
            toast.error(message, { description, duration, style });
          } else if (variant === "warning") {
            toast.warning(message, { description, duration, style });
          } else {
            toast(message, { description, duration, style });
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "alerts" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["alerts"] });
          queryClient.invalidateQueries({ queryKey: ["alert-counts"] });
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [queryClient]);

  return {
    isConnected: channelRef.current !== null,
  };
}

// ─── Realtime connection status hook ─────────────────────────────────────────

export function useRealtimeStatus() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("monitor-heartbeat")
      .on("broadcast", { event: "heartbeat" }, () => {
        queryClient.invalidateQueries({ queryKey: ["realtime-status"] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}