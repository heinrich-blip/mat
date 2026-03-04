import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

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

  const dotColor =
    status === "connected" ? "bg-green-500" :
    status === "connecting" ? "bg-yellow-500" :
    "bg-red-500";

  const label =
    status === "connected" ? "LIVE" :
    status === "connecting" ? "Connecting…" :
    "Offline";

  const secondsAgo = Math.floor((Date.now() - lastUpdate.getTime()) / 1000);
  const timeLabel = secondsAgo < 5 ? "just now" : `${secondsAgo}s ago`;

  return (
    <div className="flex items-center gap-1.5 px-1 py-0.5">
      <span
        className={cn(
          "w-2 h-2 rounded-full flex-shrink-0",
          dotColor,
          status === "connected" && "animate-pulse-dot"
        )}
      />
      <span className="text-xs text-muted-foreground">
        {label}
        {status === "connected" && (
          <span className="text-muted-foreground/60 ml-1">{timeLabel}</span>
        )}
      </span>
    </div>
  );
}
