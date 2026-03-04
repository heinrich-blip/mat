import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { formatDistanceToNow, format } from "date-fns";
import {
  ArrowLeft, Check, CheckCheck, MessageSquare, Send, Clock, AlertCircle,
  Truck, User, Wrench, Fuel, MapPin, Server, Package,
} from "lucide-react";
import { useAlert, useAlertComments, useAcknowledgeAlert, useResolveAlert, useAddAlertComment } from "@/hooks/useAlerts";
import { useAuth } from "@/contexts/AuthContext";
import SeverityBadge from "@/components/alerts/SeverityBadge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const SOURCE_ICONS: Record<string, React.ElementType> = {
  vehicle: Truck, driver: User, maintenance: Wrench, fuel: Fuel,
  geofence: MapPin, system: Server, load: Package, tyre: AlertCircle,
  trip: MapPin, manual: AlertCircle,
};

const BORDER_COLORS: Record<string, string> = {
  critical: "border-red-500",
  high:     "border-orange-500",
  medium:   "border-amber-500",
  low:      "border-blue-500",
  info:     "border-gray-500",
};

export default function AlertDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [commentText, setCommentText] = useState("");

  const { data: alert, isLoading } = useAlert(id);
  const { data: comments = [] } = useAlertComments(id);
  const acknowledge = useAcknowledgeAlert();
  const resolve = useResolveAlert();
  const addComment = useAddAlertComment();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!alert) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Alert not found.{" "}
        <Link to="/alerts" className="text-primary hover:underline">Back to feed</Link>
      </div>
    );
  }

  const SourceIcon = SOURCE_ICONS[alert.source_type] ?? AlertCircle;
  const isActive = alert.status === "active";
  const isAcknowledged = alert.status === "acknowledged";

  const handleAcknowledge = async () => {
    if (!user) return;
    try {
      await acknowledge.mutateAsync({ alertId: alert.id, userId: user.id });
      toast.success("Alert acknowledged");
    } catch { toast.error("Failed"); }
  };

  const handleResolve = async () => {
    try {
      await resolve.mutateAsync({ alertId: alert.id });
      toast.success("Alert resolved");
    } catch { toast.error("Failed"); }
  };

  const handleComment = async () => {
    if (!commentText.trim() || !user) return;
    try {
      await addComment.mutateAsync({ alertId: alert.id, userId: user.id, comment: commentText.trim() });
      setCommentText("");
    } catch { toast.error("Failed to post comment"); }
  };

  const metaEntries = Object.entries(alert.metadata ?? {});

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        {/* Back link */}
        <Link
          to="/alerts"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Alert Feed
        </Link>

        {/* Alert header card */}
        <div className={cn("bg-card border border-border border-l-4 rounded-xl p-6 space-y-4", BORDER_COLORS[alert.severity] ?? "border-l-gray-500")}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center flex-shrink-0">
              <SourceIcon className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <SeverityBadge severity={alert.severity} size="md" dot />
                <span className={cn(
                  "text-xs font-semibold px-2.5 py-1 rounded-full border",
                  alert.status === "active"        ? "bg-red-500/10 text-red-400 border-red-500/20" :
                  alert.status === "acknowledged"   ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                  alert.status === "resolved"       ? "bg-green-500/10 text-green-400 border-green-500/20" :
                  "bg-gray-500/10 text-gray-400 border-gray-500/20"
                )}>
                  {alert.status.toUpperCase()}
                </span>
              </div>
              <h2 className="text-lg font-bold text-foreground">{alert.title}</h2>
              {alert.source_label && (
                <p className="text-sm text-primary mt-1">{alert.source_label}</p>
              )}
              <p className="text-sm text-muted-foreground mt-2">{alert.message}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground border-t border-border pt-4">
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              <span>Triggered: {format(new Date(alert.triggered_at), "PPpp")}</span>
            </div>
            {alert.acknowledged_at && (
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-blue-400" />
                <span>Acknowledged: {format(new Date(alert.acknowledged_at), "PPpp")}</span>
              </div>
            )}
            {alert.resolved_at && (
              <div className="flex items-center gap-1.5">
                <CheckCheck className="h-3.5 w-3.5 text-green-400" />
                <span>Resolved: {format(new Date(alert.resolved_at), "PPpp")}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            {isActive && (
              <button
                onClick={handleAcknowledge}
                disabled={acknowledge.isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <Check className="h-4 w-4" /> Acknowledge
              </button>
            )}
            {(isActive || isAcknowledged) && (
              <button
                onClick={handleResolve}
                disabled={resolve.isPending}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <CheckCheck className="h-4 w-4" /> Resolve
              </button>
            )}
          </div>
        </div>

        {/* Metadata */}
        {metaEntries.length > 0 && (
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Alert Details</h3>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3">
              {metaEntries.map(([key, value]) => (
                <div key={key}>
                  <dt className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5">
                    {key.replace(/_/g, " ")}
                  </dt>
                  <dd className="text-sm text-foreground font-medium">{String(value)}</dd>
                </div>
              ))}
              <div>
                <dt className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5">Category</dt>
                <dd className="text-sm text-foreground font-medium">{alert.category.replace(/_/g, " ")}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-muted-foreground uppercase tracking-wider mb-0.5">Source Type</dt>
                <dd className="text-sm text-foreground font-medium">{alert.source_type}</dd>
              </div>
            </dl>
            {alert.resolution_note && (
              <div className="mt-3 pt-3 border-t border-border">
                <dt className="text-[11px] text-muted-foreground uppercase tracking-wider mb-1">Resolution Note</dt>
                <dd className="text-sm text-foreground">{alert.resolution_note}</dd>
              </div>
            )}
          </div>
        )}

        {/* Comments */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Comments ({comments.length})
          </h3>

          {comments.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No comments yet.</p>
          ) : (
            <div className="space-y-3 mb-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-primary uppercase">
                      {(comment.user_id ?? "U").charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-foreground">
                        {comment.profile?.full_name ?? "User"}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{comment.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment input */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-border">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleComment()}
              placeholder="Add a comment…"
              className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleComment}
              disabled={!commentText.trim() || addComment.isPending}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
