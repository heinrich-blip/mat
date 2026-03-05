import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Fuel,
  AlertTriangle,
  Clock,
  RefreshCw,
  Gauge,
  TrendingDown,
  Calendar,
  Truck,
  User,
  FileText,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Users,
  Download,
} from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { generateDieselPDF, generateDriverDieselPDF } from "@/lib/dieselExport";

interface DieselAlert {
  id: string;
  title: string;
  message: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  status: "active" | "acknowledged" | "resolved";
  created_at: string;
  triggered_at: string;
  metadata: {
    diesel_record_id?: string;
    fleet_number?: string;
    driver_name?: string;
    date?: string;
    km_per_litre?: number;
    probe_discrepancy?: number;
    issue_type?: string;
    litres_filled?: number;
    distance_travelled?: number;
    consumption_rate?: number;
    [key: string]: unknown;
  };
}

interface DriverWithStats {
  name: string;
  alertCount: number;
  activeCount: number;
  criticalCount: number;
  latestAlert?: DieselAlert;
}

export default function DieselAlertsPage() {
  const [filter, setFilter] = useState<"all" | "active" | "acknowledged">("active");
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const { data: alerts = [], isLoading, refetch, isRefetching } = useQuery<DieselAlert[]>({
    queryKey: ["diesel-alerts", filter],
    queryFn: async () => {
      let query = supabase.from("alerts").select("*").eq("category", "fuel_anomaly");
      if (filter !== "all") query = query.eq("status", filter);
      const { data, error } = await query.order("severity", { ascending: false }).order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    refetchInterval: 30000,
  });

  const drivers = useMemo(() => {
    const driverMap = new Map<string, DriverWithStats>();
    alerts.forEach((alert) => {
      const driverName = alert.metadata.driver_name || "Unassigned";
      const existing = driverMap.get(driverName) || {
        name: driverName,
        alertCount: 0,
        activeCount: 0,
        criticalCount: 0,
      };
      existing.alertCount++;
      if (alert.status === "active") existing.activeCount++;
      if (alert.severity === "critical") existing.criticalCount++;
      if (!existing.latestAlert || new Date(alert.created_at) > new Date(existing.latestAlert.created_at)) {
        existing.latestAlert = alert;
      }
      driverMap.set(driverName, existing);
    });
    return Array.from(driverMap.values()).sort((a, b) => b.alertCount - a.alertCount);
  }, [alerts]);

  const driverAlerts = useMemo(() => {
    if (!selectedDriver) return [];
    return alerts.filter((alert) => (alert.metadata.driver_name || "Unassigned") === selectedDriver);
  }, [alerts, selectedDriver]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 text-red-600 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-600 border-orange-200";
      case "medium":
        return "bg-amber-100 text-amber-600 border-amber-200";
      case "low":
        return "bg-blue-100 text-blue-600 border-blue-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const getIssueIcon = (issueType: string = "unknown") => {
    switch (issueType) {
      case "low_efficiency":
        return <TrendingDown className="h-5 w-5" />;
      case "probe_discrepancy":
        return <AlertTriangle className="h-5 w-5" />;
      case "missing_debrief":
        return <Clock className="h-5 w-5" />;
      case "high_consumption":
        return <Gauge className="h-5 w-5" />;
      default:
        return <Fuel className="h-5 w-5" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "acknowledged":
        return <Clock className="h-4 w-4 text-amber-500" />;
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      default:
        return <XCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading diesel alerts…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-muted/10">
      <div className="max-w-[1600px] mx-auto w-full flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-4 border-b bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Fuel className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold">Diesel Alerts</h1>
                <p className="text-sm text-muted-foreground">
                  Fuel anomalies and debrief records by driver
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
                {(["all", "active", "acknowledged"] as const).map((f) => (
                  <Button
                    key={f}
                    variant={filter === f ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setFilter(f)}
                    className="h-8 px-3 text-sm capitalize"
                  >
                    {f}
                  </Button>
                ))}
              </div>

              <DropdownMenu open={exportDropdownOpen} onOpenChange={setExportDropdownOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 h-8">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={() => {
                      generateDieselPDF(alerts, filter);
                      setExportDropdownOpen(false);
                    }}
                  >
                    Export All Drivers
                  </DropdownMenuItem>
                  {selectedDriver && (
                    <DropdownMenuItem
                      onClick={() => {
                        generateDriverDieselPDF(selectedDriver, driverAlerts);
                        setExportDropdownOpen(false);
                      }}
                    >
                      Export {selectedDriver}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      const activeAlerts = alerts.filter((a) => a.status === "active");
                      generateDieselPDF(activeAlerts, "active");
                      setExportDropdownOpen(false);
                    }}
                  >
                    Export Active Only
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isRefetching}
                className="gap-2 h-8"
              >
                <RefreshCw className={cn("h-4 w-4", isRefetching && "animate-spin")} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* KPI Summary */}
        <div className="px-6 py-4 border-b bg-background">
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Total Alerts</div>
                <div className="text-2xl font-semibold mt-1">{alerts.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Active</div>
                <div className="text-2xl font-semibold mt-1 text-red-500">
                  {alerts.filter((a) => a.status === "active").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Critical</div>
                <div className="text-2xl font-semibold mt-1 text-red-600">
                  {alerts.filter((a) => a.severity === "critical").length}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground">Drivers Affected</div>
                <div className="text-2xl font-semibold mt-1">{drivers.length}</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex min-h-0">
          {/* Drivers Sidebar */}
          <div className="w-80 border-r bg-background flex flex-col">
            <div className="p-4 border-b flex items-center gap-2 font-medium text-sm">
              <Users className="h-5 w-5" />
              <span>Drivers ({drivers.length})</span>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-2">
                {drivers.map((driver) => (
                  <button
                    key={driver.name}
                    onClick={() => setSelectedDriver(driver.name)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-lg transition-colors",
                      selectedDriver === driver.name
                        ? "bg-primary/20 text-primary"
                        : "hover:bg-muted"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium truncate">{driver.name}</span>
                      <ChevronRight
                        className={cn(
                          "h-5 w-5 transition-transform",
                          selectedDriver === driver.name && "translate-x-1"
                        )}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{driver.alertCount} alerts</span>
                      {driver.activeCount > 0 && <span className="text-red-500">{driver.activeCount} active</span>}
                      {driver.criticalCount > 0 && <span className="text-red-600">{driver.criticalCount} critical</span>}
                    </div>
                    {driver.latestAlert && (
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        Latest: {format(new Date(driver.latestAlert.created_at), "dd MMM")}
                      </p>
                    )}
                  </button>
                ))}

                {drivers.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No drivers with alerts
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Alerts Panel */}
          <div className="flex-1 min-w-0 flex flex-col">
            {!selectedDriver ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Driver Selected</h3>
                  <p className="text-sm text-muted-foreground">
                    Select a driver from the sidebar to view their diesel alerts and debrief records.
                  </p>
                </div>
              </div>
            ) : driverAlerts.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-md">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 className="h-12 w-12 text-green-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Active Alerts</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedDriver} has no {filter === "all" ? "" : filter} diesel alerts at this time.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col min-h-0">
                {/* Driver Header */}
                <div className="flex-shrink-0 p-4 border-b bg-background">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">{selectedDriver}</h2>
                      <p className="text-sm text-muted-foreground">
                        {driverAlerts.length} alerts • {driverAlerts.filter((a) => a.status === "active").length} active
                      </p>
                    </div>
                  </div>
                </div>

                {/* Alerts List */}
                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-4">
                    {driverAlerts.map((alert) => (
                      <Card
                        key={alert.id}
                        className={cn(
                          "cursor-pointer transition-all shadow hover:shadow-lg",
                          expandedAlert === alert.id && "ring-2 ring-primary"
                        )}
                        onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <div
                              className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                                getSeverityColor(alert.severity).split(" ")[0]
                              )}
                            >
                              {getIssueIcon(alert.metadata.issue_type)}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-base font-semibold">{alert.title}</h3>
                                    <Badge variant="outline" className={cn("text-xs px-2", getSeverityColor(alert.severity))}>
                                      {alert.severity}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2">{alert.message}</p>
                                </div>

                                <Badge variant="secondary" className="shrink-0 gap-1 text-sm">
                                  {getStatusIcon(alert.status)}
                                  <span className="capitalize">{alert.status}</span>
                                </Badge>
                              </div>

                              {/* Metadata */}
                              <div className="flex flex-wrap gap-2 mt-2 text-sm text-muted-foreground">
                                {alert.metadata.fleet_number && (
                                  <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded">
                                    <Truck className="h-4 w-4" />
                                    <span>{alert.metadata.fleet_number}</span>
                                  </div>
                                )}
                                {alert.metadata.date && (
                                  <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded">
                                    <Calendar className="h-4 w-4" />
                                    <span>{format(new Date(alert.metadata.date), "dd MMM yyyy")}</span>
                                  </div>
                                )}
                                {alert.metadata.km_per_litre && (
                                  <div className="flex items-center gap-1 bg-muted/50 px-2 py-1 rounded">
                                    <Gauge className="h-4 w-4" />
                                    <span>{alert.metadata.km_per_litre.toFixed(2)} km/L</span>
                                  </div>
                                )}
                              </div>

                              {/* Expanded Details */}
                              {expandedAlert === alert.id && (
                                <div className="mt-3 pt-3 border-t space-y-3">
                                  <div className="grid grid-cols-2 gap-3 text-sm">
                                    {alert.metadata.litres_filled && (
                                      <div>
                                        <div className="text-muted-foreground">Litres</div>
                                        <div className="font-medium">{alert.metadata.litres_filled.toFixed(1)} L</div>
                                      </div>
                                    )}
                                    {alert.metadata.distance_travelled && (
                                      <div>
                                        <div className="text-muted-foreground">Distance</div>
                                        <div className="font-medium">{alert.metadata.distance_travelled.toFixed(1)} km</div>
                                      </div>
                                    )}
                                    {alert.metadata.consumption_rate && (
                                      <div>
                                        <div className="text-muted-foreground">Consumption</div>
                                        <div className="font-medium">{alert.metadata.consumption_rate.toFixed(1)} L/100km</div>
                                      </div>
                                    )}
                                    {alert.metadata.probe_discrepancy && (
                                      <div>
                                        <div className="text-muted-foreground">Discrepancy</div>
                                        <div className="font-medium text-red-500">{alert.metadata.probe_discrepancy.toFixed(1)}%</div>
                                      </div>
                                    )}
                                  </div>

                                  <Link to={`/alerts/${alert.id}`}>
                                    <Button size="sm" variant="outline" className="w-full gap-2 h-8 text-sm">
                                      <FileText className="h-4 w-4" />
                                      View Full Details
                                    </Button>
                                  </Link>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}