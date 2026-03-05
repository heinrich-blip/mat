import { useAuth } from "@/contexts/AuthContext";
import { useAlertFilters } from "@/hooks/useAlertFilters";
import { useAlertCounts } from "@/hooks/useAlerts";
import { useAlertStream } from "@/hooks/useAlertStream";
import { useDieselCounts } from "@/hooks/useDieselCounts";
import { useDocumentCounts } from "@/hooks/useDocumentCounts";
import { useFaultCounts } from "@/hooks/useFaultCounts";
import { useTripAlertCounts } from "@/hooks/useTripAlertCounts";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Bell,
  FileText,
  Fuel,
  LogOut,
  Settings,
  Shield,
  Truck,
  Wrench,
} from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import RealtimeStatusBadge from "./RealtimeStatusBadge";

const NAV_ITEMS = [
  { to: "/alerts", icon: Bell, label: "Alert Feed", badge: "alerts" },
  { to: "/trip-alerts", icon: Truck, label: "Trip Alerts", badge: "trip" },
  { to: "/faults", icon: Wrench, label: "Faults", badge: "faults" },
  { to: "/documents", icon: FileText, label: "Documents", badge: "documents" },
  { to: "/diesel-alerts", icon: Fuel, label: "Diesel", badge: "diesel" },
  { to: "/analytics", icon: BarChart3, label: "Analytics", badge: false },
  { to: "/config", icon: Settings, label: "Alert Rules", badge: false },
];

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { filters } = useAlertFilters();

  // Start the global realtime stream
  useAlertStream();

  const { data: counts } = useAlertCounts(filters);
  const { data: faultCounts } = useFaultCounts();
  const { data: tripAlertCounts } = useTripAlertCounts();
  const { data: documentCounts } = useDocumentCounts();
  const { data: dieselCounts } = useDieselCounts();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 border-r border-border bg-card flex flex-col">
        {/* Logo */}
        <div className="px-4 py-5 border-b border-border flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center flex-shrink-0 shadow-subtle">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-sm text-foreground leading-tight tracking-tight">MAT Monitor</p>
            <p className="text-xs text-muted-foreground">Fleet Command Center</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 space-y-0.5 px-2">
          {NAV_ITEMS.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-all duration-150 group",
                  isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )
              }
            >
              <Icon className={cn(
                "h-4 w-4 flex-shrink-0 transition-colors",
                "group-hover:text-foreground"
              )} />
              <span className="flex-1">{label}</span>
              {badge === "alerts" && counts && (
                <>
                  {counts.critical > 0 && (
                    <span className="ml-auto bg-destructive text-destructive-foreground text-xs font-semibold rounded-md min-w-[20px] h-5 flex items-center justify-center px-1.5">
                      {counts.critical > 99 ? "99+" : counts.critical}
                    </span>
                  )}
                  {counts.critical === 0 && counts.high > 0 && (
                    <span className="ml-auto bg-severity-high text-white text-xs font-semibold rounded-md min-w-[20px] h-5 flex items-center justify-center px-1.5">
                      {counts.high > 99 ? "99+" : counts.high}
                    </span>
                  )}
                </>
              )}
              {badge === "trip" && tripAlertCounts && tripAlertCounts.active > 0 && (
                <span className="ml-auto bg-severity-medium text-white text-xs font-semibold rounded-md min-w-[20px] h-5 flex items-center justify-center px-1.5">
                  {tripAlertCounts.active > 99 ? "99+" : tripAlertCounts.active}
                </span>
              )}
              {badge === "faults" && faultCounts && faultCounts.total > 0 && (
                <span className="ml-auto bg-severity-medium text-white text-xs font-semibold rounded-md min-w-[20px] h-5 flex items-center justify-center px-1.5">
                  {faultCounts.total > 99 ? "99+" : faultCounts.total}
                </span>
              )}
              {badge === "documents" && documentCounts && documentCounts.total > 0 && (
                <span className="ml-auto bg-severity-low text-white text-xs font-semibold rounded-md min-w-[20px] h-5 flex items-center justify-center px-1.5">
                  {documentCounts.total > 99 ? "99+" : documentCounts.total}
                </span>
              )}
              {badge === "diesel" && dieselCounts && dieselCounts.total > 0 && (
                <span className="ml-auto bg-emerald-500 text-white text-xs font-semibold rounded-md min-w-[20px] h-5 flex items-center justify-center px-1.5">
                  {dieselCounts.total > 99 ? "99+" : dieselCounts.total}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Status */}
        <div className="border-t border-border p-3 space-y-3">
          <RealtimeStatusBadge />
          <div className="flex items-center gap-3 px-1">
            <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center flex-shrink-0 border border-border">
              <span className="text-xs font-semibold text-foreground uppercase">
                {(user?.email ?? "U").charAt(0)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate text-foreground">
                {user?.email?.split("@")[0] ?? "User"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {user?.email?.split("@")[1] ?? ""}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-1.5 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-background">
        <Outlet />
      </main>
    </div>
  );
}
