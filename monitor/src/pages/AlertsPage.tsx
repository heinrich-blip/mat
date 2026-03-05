import AlertCard from "@/components/alerts/AlertCard";
import AlertFilterBar from "@/components/alerts/AlertFilterBar";
import { useAlertFilters } from "@/hooks/useAlertFilters";
import { useAlertCounts, useAlerts } from "@/hooks/useAlerts";
import { cn } from "@/lib/utils";
import { Bell, RefreshCw } from "lucide-react";

/* Professional severity count styling */
const SEVERITY_COLORS = {
  critical: "text-destructive bg-destructive/10 border-destructive/20",
  high: "text-severity-high bg-severity-high/10 border-severity-high/20",
  medium: "text-severity-medium bg-severity-medium/10 border-severity-medium/20",
  low: "text-severity-low bg-severity-low/10 border-severity-low/20",
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
      {/* Professional Page Header */}
      <div className="flex-shrink-0 px-6 pt-6 pb-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground tracking-tight">Live Alert Feed</h1>
              {totalCount > 0 && (
                <span className="text-sm text-muted-foreground">
                  {totalCount.toLocaleString()} alert{totalCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>

          {/* Severity count pills - using real counts from the API */}
          <div className="flex items-center gap-2">
            {(["critical", "high", "medium", "low"] as const).map((sev) => {
              const count = counts?.[sev] ?? 0;
              return count > 0 ? (
                <span
                  key={sev}
                  className={cn(
                    "text-xs font-semibold px-2.5 py-1 rounded-md border",
                    SEVERITY_COLORS[sev]
                  )}
                >
                  {count} {sev.charAt(0).toUpperCase() + sev.slice(1)}
                </span>
              ) : null;
            })}

            <button
              onClick={() => refetch()}
              disabled={isRefetching}
              className="ml-2 p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors border border-transparent hover:border-border"
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
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
              <Bell className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <p className="text-muted-foreground text-sm">No alerts match the current filters</p>
            <button
              onClick={filterState.resetFilters}
              className="text-xs text-primary hover:text-primary/80 font-medium transition-colors"
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
                className="w-full py-3 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 font-medium"
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
