import { Bell, RefreshCw } from "lucide-react";
import AlertCard from "@/components/alerts/AlertCard";
import AlertFilterBar from "@/components/alerts/AlertFilterBar";
import { useAlerts, useAlertCounts } from "@/hooks/useAlerts";
import { useAlertFilters } from "@/hooks/useAlertFilters";
import { cn } from "@/lib/utils";

const SEVERITY_COLORS = {
  critical: "text-red-400 bg-red-500/10",
  high:     "text-orange-400 bg-orange-500/10",
  medium:   "text-amber-400 bg-amber-500/10",
  low:      "text-blue-400 bg-blue-500/10",
};

export default function AlertsPage() {
  const filterState = useAlertFilters();
  const { filters } = filterState;

  const { data: pages, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch, isRefetching } =
    useAlerts(filters);

  const { data: counts } = useAlertCounts(filters);

  const allAlerts = pages?.pages.flatMap((p) => p.alerts) ?? [];
  const totalCount = pages?.pages[0]?.count ?? 0;

  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-bold text-foreground">Live Alert Feed</h1>
            {totalCount > 0 && (
              <span className="text-sm text-muted-foreground">
                {totalCount.toLocaleString()} alert{totalCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Severity count pills */}
          <div className="flex items-center gap-2">
            {(["critical", "high", "medium", "low"] as const).map((sev) => (
              counts && counts[sev] > 0 ? (
                <span
                  key={sev}
                  className={cn(
                    "text-xs font-semibold px-2.5 py-1 rounded-full",
                    SEVERITY_COLORS[sev]
                  )}
                >
                  {counts[sev]} {sev.charAt(0).toUpperCase() + sev.slice(1)}
                </span>
              ) : null
            ))}

            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className="ml-2 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              title="Refresh"
            >
              <RefreshCw className={cn("h-4 w-4", isRefetching && "animate-spin")} />
            </button>
          </div>
        </div>

        {/* Filters */}
        <AlertFilterBar {...filterState} />
      </div>

      {/* Alert list */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-40">
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Loading alerts…</p>
            </div>
          </div>
        ) : allAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-3">
            <Bell className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-muted-foreground text-sm">No alerts match the current filters</p>
            <button
              onClick={filterState.resetFilters}
              className="text-xs text-primary hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {allAlerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}

            {/* Load more */}
            {hasNextPage && (
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="w-full py-3 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
              >
                {isFetchingNextPage ? "Loading more…" : "Load more alerts"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
