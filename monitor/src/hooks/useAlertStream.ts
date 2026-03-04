import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Alert, AlertFilters } from "@/types";

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#f59e0b",
  low: "#3b82f6",
  info: "#6b7280",
};

export function useAlertStream(filters: AlertFilters) {
  const queryClient = useQueryClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    // Clean up previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel("monitor-alert-stream")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "alerts" },
        (payload) => {
          const newAlert = payload.new as Alert;

          // Invalidate queries so the list refreshes
          queryClient.invalidateQueries({ queryKey: ["alerts"] });
          queryClient.invalidateQueries({ queryKey: ["alert-counts"] });

          // Show in-app toast notification
          const color = SEVERITY_COLORS[newAlert.severity] ?? "#6b7280";
          const prefix = newAlert.severity.toUpperCase();

          if (newAlert.severity === "critical") {
            toast.error(`[${prefix}] ${newAlert.title}`, {
              description: `${newAlert.source_label ?? ""} • ${newAlert.message}`,
              duration: 10_000,
            });
          } else if (newAlert.severity === "high") {
            toast.warning(`[${prefix}] ${newAlert.title}`, {
              description: `${newAlert.source_label ?? ""} • ${newAlert.message}`,
              duration: 7_000,
              style: { borderLeft: `4px solid ${color}` },
            });
          } else {
            toast(`[${prefix}] ${newAlert.title}`, {
              description: `${newAlert.source_label ?? ""} • ${newAlert.message}`,
              duration: 5_000,
              style: { borderLeft: `4px solid ${color}` },
            });
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
      supabase.removeChannel(channel);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient]);

  // Return realtime connection status
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
