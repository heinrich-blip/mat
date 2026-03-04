import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  Activity,
  Bell,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import RealtimeStatusBadge from "./RealtimeStatusBadge";
import { useAlertCounts } from "@/hooks/useAlerts";
import { useAlertFilters } from "@/hooks/useAlertFilters";
import { useAlertStream } from "@/hooks/useAlertStream";

const NAV_ITEMS = [
  { to: "/alerts",    icon: Bell,      label: "Alert Feed",  badge: true },
  { to: "/analytics", icon: BarChart3, label: "Analytics",   badge: false },
  { to: "/config",    icon: Settings,  label: "Alert Rules", badge: false },
];

export default function Layout() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { filters } = useAlertFilters();

  // Start the global realtime stream
  useAlertStream(filters);

  const { data: counts } = useAlertCounts(filters);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 border-r border-border flex flex-col">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-border flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center flex-shrink-0">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm text-foreground leading-tight">MAT Monitor</p>
            <p className="text-xs text-muted-foreground">Alerts & Analytics</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 space-y-1 px-2">
          {NAV_ITEMS.map(({ to, icon: Icon, label, badge }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                  isActive
                    ? "bg-primary/20 text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )
              }
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {badge && counts && counts.critical > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                  {counts.critical > 99 ? "99+" : counts.critical}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User + Status */}
        <div className="border-t border-border p-3 space-y-2">
          <RealtimeStatusBadge />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary uppercase">
                {(user?.email ?? "U").charAt(0)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium truncate">
                {user?.email?.split("@")[0] ?? "User"}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="text-muted-foreground hover:text-destructive transition-colors"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
