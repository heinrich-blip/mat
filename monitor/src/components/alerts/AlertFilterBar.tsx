import { useState } from "react";
import { Search, X, Filter, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AlertSeverity, AlertStatus } from "@/types";
import { useAlertFilters } from "@/hooks/useAlertFilters";

type FilterBarReturn = ReturnType<typeof useAlertFilters>;

interface AlertFilterBarProps extends FilterBarReturn {}

const TIME_PRESETS: { label: string; value: FilterBarReturn["filters"]["timeRange"] }[] = [
  { label: "1H",  value: "last1h" },
  { label: "6H",  value: "last6h" },
  { label: "24H", value: "last24h" },
  { label: "7D",  value: "last7d" },
  { label: "30D", value: "last30d" },
];

const SEVERITIES: { value: AlertSeverity; color: string; label: string }[] = [
  { value: "critical", color: "text-red-400 bg-red-500/10 border-red-500/30",     label: "Critical" },
  { value: "high",     color: "text-orange-400 bg-orange-500/10 border-orange-500/30", label: "High" },
  { value: "medium",   color: "text-amber-400 bg-amber-500/10 border-amber-500/30",   label: "Medium" },
  { value: "low",      color: "text-blue-400 bg-blue-500/10 border-blue-500/30",    label: "Low" },
  { value: "info",     color: "text-gray-400 bg-gray-500/10 border-gray-500/30",    label: "Info" },
];

const STATUSES: { value: AlertStatus; label: string }[] = [
  { value: "active",       label: "Active" },
  { value: "acknowledged", label: "Acknowledged" },
  { value: "resolved",     label: "Resolved" },
];

export default function AlertFilterBar({
  filters,
  setTimeRange,
  toggleSeverity,
  toggleStatus,
  setSearchQuery,
  resetFilters,
  activeFilterCount,
}: AlertFilterBarProps) {
  const [searchValue, setSearchValue] = useState(filters.searchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setSearchQuery(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchValue("");
    setSearchQuery("");
  };

  return (
    <div className="space-y-3 p-4 bg-card border border-border rounded-lg">
      {/* Row 1: Time range + Search */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Time range */}
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <Clock className="h-3.5 w-3.5 text-muted-foreground ml-1.5" />
          {TIME_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setTimeRange(preset.value)}
              className={cn(
                "text-xs px-2.5 py-1 rounded-md font-medium transition-colors",
                filters.timeRange === preset.value
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search alerts…"
            value={searchValue}
            onChange={handleSearchChange}
            className="w-full bg-muted border border-border rounded-md pl-8 pr-8 py-1.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          {searchValue && (
            <button
              onClick={handleSearchClear}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Reset */}
        {activeFilterCount > 0 && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
          >
            <Filter className="h-3 w-3" />
            Reset ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Row 2: Severity filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground">Severity:</span>
        {SEVERITIES.map((sev) => (
          <button
            key={sev.value}
            onClick={() => toggleSeverity(sev.value)}
            className={cn(
              "text-xs px-2.5 py-1 rounded-full border font-medium transition-all",
              filters.severities.includes(sev.value)
                ? sev.color + " opacity-100"
                : "text-muted-foreground bg-transparent border-border opacity-60 hover:opacity-100"
            )}
          >
            {sev.label}
          </button>
        ))}

        <span className="text-xs text-muted-foreground ml-4">Status:</span>
        {STATUSES.map((st) => (
          <button
            key={st.value}
            onClick={() => toggleStatus(st.value)}
            className={cn(
              "text-xs px-2.5 py-1 rounded-full border font-medium transition-all",
              filters.statuses.includes(st.value)
                ? "bg-primary/20 text-primary border-primary/30"
                : "text-muted-foreground bg-transparent border-border opacity-60 hover:opacity-100"
            )}
          >
            {st.label}
          </button>
        ))}
      </div>
    </div>
  );
}
