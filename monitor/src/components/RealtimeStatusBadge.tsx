import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type Status = "connected" | "connecting" | "offline";

export default function RealtimeStatusBadge() {
  const [status, setStatus] = useState<Status>("connecting");
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    const channel = supabase
      .channel("monitor-status-ping")
      .on("postgres_changes", { event: "*", schema: "public", table: "alerts" }, () => {
        setLastUpdate(new Date());
      })
      .subscribe((s) => {
        if (s === "SUBSCRIBED") setStatus("connected");
        else if (s === "CHANNEL_ERROR" || s === "TIMED_OUT") setStatus("offline");
        else setStatus("connecting");
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  /* Professional status colors */
  const dotColor =
    status === "connected" ? "bg-emerald-500" :
      status === "connecting" ? "bg-severity-medium" :
        "bg-destructive";

  const label =
    status === "connected" ? "LIVE" :
      status === "connecting" ? "Connecting…" :
        "Offline";

  const secondsAgo = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);
  const timeLabel = secondsAgo < 5 ? "just now" : `${secondsAgo}s ago`;

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-secondary/50 border border-border">
      <span
        className={cn(
          "w-2 h-2 rounded-full flex-shrink-0",
          dotColor,
          status === "connected" && "animate-pulse-subtle"
        )}
      />
      <span className="text-xs font-medium text-foreground">
        {label}
      </span>
      {status === "connected" && (
        <span className="text-xs text-muted-foreground tabular-nums">
          {timeLabel}
        </span>
      )}
    </div>
  );
}
