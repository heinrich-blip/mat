# Secondary Monitoring Dashboard — Comprehensive Development Plan

**Project:** MAT Alerts & Analytics Satellite Dashboard  
**Parent System:** Matanuska Transport (MAT) Fleet Management Dashboard  
**Date:** March 4, 2026  
**Version:** 1.0

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Design](#2-architecture-design)
3. [Technology Stack](#3-technology-stack)
4. [Database Schema Design](#4-database-schema-design)
5. [API Endpoints & Communication Protocols](#5-api-endpoints--communication-protocols)
6. [UI Components & Layout](#6-ui-components--layout)
7. [Security Considerations](#7-security-considerations)
8. [Real-Time Notifications & Push Mechanisms](#8-real-time-notifications--push-mechanisms)
9. [Interactive Analytics & Filtering](#9-interactive-analytics--filtering)
10. [Deployment Strategy](#10-deployment-strategy)
11. [Implementation Roadmap](#11-implementation-roadmap)

---

## 1. Executive Summary

The secondary dashboard (referred to as **MAT Monitor**) is a standalone satellite application that integrates with the existing MAT Fleet Management Dashboard. Its sole responsibility is real-time alert monitoring and analytics visualization. It shares the same Supabase backend, authentication system, and data layer as the primary dashboard, but is deployed as an independent application with its own URL, optimized for monitoring roles (operations managers, fleet supervisors, control-room operators).

### Key Goals
- **Dedicated alert feed** with severity classification, timestamps, and source attribution
- **Live analytics** including KPIs, trend charts, and performance graphs
- **Real-time push notifications** via Supabase Realtime subscriptions and Web Push API
- **Interactive filtering** by time range, category, severity, vehicle, and route
- **Zero-trust cross-dashboard authentication** using shared Supabase JWT tokens

---

## 2. Architecture Design

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Shared Supabase Backend                     │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────┐   │
│  │  PostgreSQL │  │   Realtime   │  │   Edge Functions    │   │
│  │   Database  │  │  (WebSocket) │  │  (alert processor)  │   │
│  └─────────────┘  └──────────────┘  └─────────────────────┘   │
└─────────────────────────┬───────────────────────────────────────┘
                          │ Supabase JS Client (shared credentials)
          ┌───────────────┴───────────────┐
          │                               │
┌─────────▼──────────┐         ┌──────────▼──────────┐
│   MAT Main Dashboard│         │   MAT Monitor        │
│   (Primary App)    │         │   (Secondary App)    │
│   Vite + React     │         │   Vite + React       │
│   Port: 5173       │         │   Port: 5174         │
│   /workspaces/mat  │         │   /workspaces/mat-   │
│                    │         │   monitor            │
└────────────────────┘         └─────────────────────┘
```

### 2.2 Integration Pattern: Shared Backend, Independent Frontend

The two dashboards share:
- **Supabase project** (same URL, same anon/service keys)
- **Authentication** (same Supabase Auth, same user pool and roles)
- **Database tables** (alerts, analytics events, vehicles, drivers read from the same PostgreSQL)
- **Row Level Security policies** (same RLS enforced for both apps)

They are independent in:
- **Deployment URL** (separate Vercel/Docker container)
- **Codebase** (separate Git repo or subdirectory `/workspaces/mat-monitor`)
- **Routing** (dedicated pages: `/alerts`, `/analytics`, `/kpi`)
- **UI optimizations** (dark-mode first, high-density data display, real-time first)

### 2.3 Data Flow Diagram

```
Vehicle / GPS Event (Wialon)
        │
        ▼
Supabase Edge Function: alert_processor
        │  ─── writes to ──►  alerts table
        │  ─── writes to ──►  analytics_events table
        │
Supabase Realtime (PostgreSQL CDC)
        │
        ├──────────────────────────────────────────────────────────►
        │                                            MAT Monitor App
        │                                            (WebSocket subscription)
        │                                            Displays live alert feed
        │
        └─────────────────────────────────────────────────────────►
                                             MAT Main Dashboard
                                             (existing subscriptions)
```

### 2.4 Cross-Dashboard Communication (Optional Enhancement)

For cases where the secondary dashboard needs to **trigger actions** back in the main dashboard (e.g., acknowledge an alert, assign a vehicle), use a **shared Supabase table as a message bus**:

```
MAT Monitor ──writes──► dashboard_actions table ──realtime──► MAT Main Dashboard
```

This avoids direct app-to-app coupling.

---

## 3. Technology Stack

### 3.1 Core Framework (mirrors parent app for team consistency)

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | React 18 + TypeScript | Matches parent app; shared component patterns |
| **Build Tool** | Vite 5 | Fast HMR; same config pattern as parent |
| **Styling** | TailwindCSS 3 + shadcn/ui | Shared design system with parent |
| **Routing** | React Router DOM v6 | Same as parent app |
| **State/Server State** | TanStack React Query v5 | Same as parent; cache + realtime |
| **Backend/DB** | Supabase JS v2 | Shared instance; Auth + DB + Realtime |
| **Charts** | Recharts 2 + (optionally) Apache ECharts | Recharts matches parent; ECharts for advanced heatmaps |
| **Real-Time** | Supabase Realtime (WebSocket) | Already configured in parent |
| **Push Notifications** | Web Push API + Service Worker | Browser native, no extra server |
| **Icons** | Lucide React | Matches parent |
| **Forms** | React Hook Form + Zod | Matches parent |
| **Notifications (in-app)** | Sonner | Matches parent |
| **Date Handling** | date-fns | Matches parent |

### 3.2 Additional Libraries for MAT Monitor

| Library | Purpose |
|---------|---------|
| `@tanstack/react-virtual` | Virtualized scrolling for large alert lists |
| `react-use-websocket` | Fallback WebSocket hook if Supabase Realtime needs wrapping |
| `web-vitals` | Monitor app performance |
| `@nivo/heatmap` | Activity heatmap charts (optional, complements Recharts) |
| `fuse.js` | Client-side fuzzy search on alert lists |

### 3.3 Infrastructure

| Component | Choice | Notes |
|-----------|--------|-------|
| **Hosting** | Vercel (preferred) or Docker + Nginx | Vercel matches existing parent deployment |
| **CDN** | Vercel Edge Network | Auto-configured with Vercel |
| **DB** | Supabase PostgreSQL (shared) | No separate database needed |
| **Auth** | Supabase Auth (shared) | Same user pool |
| **Push Server** | Supabase Edge Function (VAPID key holder) | Serverless, no separate server |

---

## 4. Database Schema Design

All tables are created in the **shared Supabase PostgreSQL database**. The secondary dashboard reads from existing tables (vehicles, trips, incidents, fuel_entries) and introduces new alert-specific tables.

### 4.1 New Tables for MAT Monitor

#### `alert_configurations`
Stores user-defined alert rules (thresholds, categories, notification preferences).

```sql
CREATE TABLE alert_configurations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  category        TEXT NOT NULL CHECK (category IN (
                    'speed_violation', 'geofence_breach', 'fuel_anomaly',
                    'maintenance_due', 'driver_behavior', 'vehicle_fault',
                    'trip_delay', 'load_exception', 'tyre_pressure', 'custom'
                  )),
  severity        TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
  -- Threshold conditions stored as JSONB for flexibility
  conditions      JSONB NOT NULL DEFAULT '{}',
  -- e.g. {"speed_kmh": {"gt": 120}, "duration_seconds": {"gt": 30}}
  is_active       BOOLEAN NOT NULL DEFAULT true,
  notify_email    BOOLEAN NOT NULL DEFAULT false,
  notify_push     BOOLEAN NOT NULL DEFAULT true,
  notify_in_app   BOOLEAN NOT NULL DEFAULT true,
  -- Cooldown prevents alert spam (minutes)
  cooldown_minutes INTEGER NOT NULL DEFAULT 15,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_alert_configs_category ON alert_configurations(category);
CREATE INDEX idx_alert_configs_active ON alert_configurations(is_active);
```

#### `alerts`
The central alert feed — populated by Supabase Edge Functions or the main app.

```sql
CREATE TABLE alerts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  config_id       UUID REFERENCES alert_configurations(id) ON DELETE SET NULL,
  -- Source context
  source_type     TEXT NOT NULL CHECK (source_type IN (
                    'vehicle', 'driver', 'trip', 'load', 'geofence',
                    'system', 'maintenance', 'fuel', 'tyre', 'manual'
                  )),
  source_id       UUID,          -- FK to vehicles.id, drivers.id, trips.id, etc.
  source_label    TEXT,          -- Human-readable: "Truck MAT-007", "Driver John Doe"
  -- Alert content
  title           TEXT NOT NULL,
  message         TEXT NOT NULL,
  category        TEXT NOT NULL,
  severity        TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low', 'info')),
  -- Metadata payload (location, sensor readings, etc.)
  metadata        JSONB NOT NULL DEFAULT '{}',
  -- e.g. {"lat": -17.83, "lng": 31.05, "speed_kmh": 135, "vehicle_reg": "ABC123"}
  -- Lifecycle
  status          TEXT NOT NULL DEFAULT 'active'
                    CHECK (status IN ('active', 'acknowledged', 'resolved', 'suppressed')),
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMPTZ,
  resolved_at     TIMESTAMPTZ,
  resolution_note TEXT,
  -- Timestamps
  triggered_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at      TIMESTAMPTZ,    -- NULL = no expiry
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Performance indexes for common queries
CREATE INDEX idx_alerts_severity       ON alerts(severity);
CREATE INDEX idx_alerts_status         ON alerts(status);
CREATE INDEX idx_alerts_triggered_at   ON alerts(triggered_at DESC);
CREATE INDEX idx_alerts_source_type    ON alerts(source_type);
CREATE INDEX idx_alerts_source_id      ON alerts(source_id);
CREATE INDEX idx_alerts_category       ON alerts(category);
-- Composite for dashboard live feed
CREATE INDEX idx_alerts_live_feed      ON alerts(status, severity, triggered_at DESC);
```

#### `analytics_events`
Raw event stream for computing KPIs and trend analytics.

```sql
CREATE TABLE analytics_events (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type      TEXT NOT NULL,
  -- e.g. 'trip_completed', 'fuel_refill', 'speed_violation', 'inspection_passed'
  source_type     TEXT NOT NULL,
  source_id       UUID,
  -- Metric values as JSONB for schema flexibility
  metrics         JSONB NOT NULL DEFAULT '{}',
  -- e.g. {"distance_km": 245.3, "fuel_used_l": 78.2, "duration_minutes": 187}
  dimensions      JSONB NOT NULL DEFAULT '{}',
  -- e.g. {"route": "Harare-Beitbridge", "vehicle_type": "rigid", "driver_id": "..."}
  occurred_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_event_type  ON analytics_events(event_type);
CREATE INDEX idx_analytics_occurred_at ON analytics_events(occurred_at DESC);
CREATE INDEX idx_analytics_source      ON analytics_events(source_type, source_id);
```

#### `alert_subscriptions`
User subscriptions for push notifications (Web Push VAPID).

```sql
CREATE TABLE alert_subscriptions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  -- Web Push subscription object (endpoint + keys)
  push_subscription JSONB NOT NULL,
  device_label    TEXT,           -- "Chrome on Windows", "Safari on iPhone"
  is_active       BOOLEAN NOT NULL DEFAULT true,
  -- Filter preferences for this device
  min_severity    TEXT NOT NULL DEFAULT 'medium'
                    CHECK (min_severity IN ('critical', 'high', 'medium', 'low', 'info')),
  categories      TEXT[] DEFAULT NULL,  -- NULL = all categories
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_seen_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_alert_subs_user ON alert_subscriptions(user_id);
CREATE INDEX idx_alert_subs_active ON alert_subscriptions(is_active);
```

#### `dashboard_kpi_snapshots`
Pre-aggregated KPI snapshots for fast dashboard loading (avoids expensive real-time aggregation).

```sql
CREATE TABLE dashboard_kpi_snapshots (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date   DATE NOT NULL,
  period          TEXT NOT NULL CHECK (period IN ('hourly', 'daily', 'weekly', 'monthly')),
  kpi_name        TEXT NOT NULL,
  -- e.g. 'fleet_utilization', 'on_time_delivery_rate', 'avg_fuel_efficiency',
  --      'active_alerts_count', 'incident_rate', 'maintenance_compliance'
  value           NUMERIC NOT NULL,
  unit            TEXT,           -- '%', 'km/l', 'count', 'hours'
  dimensions      JSONB DEFAULT '{}',
  -- e.g. {"vehicle_type": "rigid"} for segmented KPIs
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (snapshot_date, period, kpi_name, dimensions)
);

CREATE INDEX idx_kpi_snapshots_date    ON dashboard_kpi_snapshots(snapshot_date DESC);
CREATE INDEX idx_kpi_snapshots_name    ON dashboard_kpi_snapshots(kpi_name);
```

#### `alert_comments`
Collaboration thread on individual alerts.

```sql
CREATE TABLE alert_comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id    UUID NOT NULL REFERENCES alerts(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES auth.users(id),
  comment     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_alert_comments_alert ON alert_comments(alert_id, created_at);
```

### 4.2 Row Level Security (RLS) Policies

```sql
-- Enable RLS on all new tables
ALTER TABLE alert_configurations   ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events       ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_subscriptions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_kpi_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_comments         ENABLE ROW LEVEL SECURITY;

-- alerts: all authenticated users can read; only service_role can insert
CREATE POLICY "Authenticated users can view alerts"
  ON alerts FOR SELECT TO authenticated USING (true);

CREATE POLICY "Service role can manage alerts"
  ON alerts FOR ALL TO service_role USING (true);

-- alert_configurations: users manage their own; admins see all
CREATE POLICY "Users manage own alert configs"
  ON alert_configurations FOR ALL TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- alert_subscriptions: users manage their own push subscriptions
CREATE POLICY "Users manage own push subscriptions"
  ON alert_subscriptions FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- KPI snapshots: read-only for all authenticated users
CREATE POLICY "Authenticated users can view KPI snapshots"
  ON dashboard_kpi_snapshots FOR SELECT TO authenticated USING (true);

-- Alert comments: users see all, write their own
CREATE POLICY "Users can view all comments"
  ON alert_comments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can write own comments"
  ON alert_comments FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
```

### 4.3 Database Functions & Triggers

```sql
-- Function: Auto-update updated_at on alert_configurations
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_alert_configs_updated_at
  BEFORE UPDATE ON alert_configurations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Aggregate hourly KPI snapshot (called by pg_cron or Edge Function)
CREATE OR REPLACE FUNCTION compute_hourly_kpi_snapshot(p_date DATE)
RETURNS void AS $$
BEGIN
  -- Active alerts count by severity
  INSERT INTO dashboard_kpi_snapshots (snapshot_date, period, kpi_name, value, unit)
  SELECT
    p_date,
    'hourly',
    'active_alerts_' || severity,
    COUNT(*),
    'count'
  FROM alerts
  WHERE status = 'active'
    AND triggered_at::DATE = p_date
  GROUP BY severity
  ON CONFLICT (snapshot_date, period, kpi_name, dimensions) DO UPDATE
    SET value = EXCLUDED.value;
END;
$$ LANGUAGE plpgsql;
```

---

## 5. API Endpoints & Communication Protocols

### 5.1 Communication Architecture

The secondary dashboard uses **Supabase as the sole API layer** — no separate REST/GraphQL backend is needed. Communication happens through:

1. **Supabase PostgREST** — auto-generated REST API for CRUD operations
2. **Supabase Realtime** — WebSocket-based CDC for live updates
3. **Supabase Edge Functions** — serverless functions for alert processing and push notifications
4. **Cross-origin (CORS)** — both apps share the same Supabase project, so no CORS issues

### 5.2 Supabase PostgREST Endpoints (used by MAT Monitor)

All endpoints use the Supabase client SDK. Equivalent REST paths shown for documentation:

#### Alerts API

```typescript
// GET /rest/v1/alerts — Fetch alert feed with filters
const { data, error } = await supabase
  .from('alerts')
  .select(`
    id, title, message, category, severity, status,
    source_type, source_label, metadata,
    triggered_at, acknowledged_at, resolved_at,
    acknowledged_by_profile:acknowledged_by(full_name, avatar_url)
  `)
  .in('status', ['active', 'acknowledged'])
  .gte('triggered_at', startDate.toISOString())
  .lte('triggered_at', endDate.toISOString())
  .in('severity', selectedSeverities)
  .order('triggered_at', { ascending: false })
  .range(offset, offset + pageSize - 1);

// PATCH /rest/v1/alerts?id=eq.{id} — Acknowledge alert
const { error } = await supabase
  .from('alerts')
  .update({
    status: 'acknowledged',
    acknowledged_by: userId,
    acknowledged_at: new Date().toISOString()
  })
  .eq('id', alertId);

// POST /rest/v1/alerts — Create manual alert
const { data, error } = await supabase
  .from('alerts')
  .insert({
    source_type: 'manual',
    title: 'Manual Alert',
    message: 'Operator flagged an issue',
    category: 'custom',
    severity: 'medium',
    metadata: { operator_id: userId }
  });
```

#### Analytics Events API

```typescript
// GET /rest/v1/analytics_events — Time-series data for charts
const { data } = await supabase
  .from('analytics_events')
  .select('event_type, metrics, dimensions, occurred_at')
  .eq('event_type', 'trip_completed')
  .gte('occurred_at', startDate.toISOString())
  .order('occurred_at', { ascending: true });

// GET /rest/v1/dashboard_kpi_snapshots — Pre-aggregated KPIs
const { data } = await supabase
  .from('dashboard_kpi_snapshots')
  .select('kpi_name, value, unit, snapshot_date')
  .eq('period', 'daily')
  .gte('snapshot_date', sub(new Date(), { days: 30 }).toISOString().split('T')[0])
  .order('snapshot_date', { ascending: true });
```

#### Alert Configurations API

```typescript
// GET /rest/v1/alert_configurations — User's alert rules
const { data } = await supabase
  .from('alert_configurations')
  .select('*')
  .eq('is_active', true)
  .order('created_at', { ascending: false });

// POST /rest/v1/alert_configurations — Create alert rule
const { data } = await supabase
  .from('alert_configurations')
  .insert({
    name: 'Speed Violation Alert',
    category: 'speed_violation',
    severity: 'high',
    conditions: { speed_kmh: { gt: 120 }, duration_seconds: { gt: 30 } },
    cooldown_minutes: 10
  });
```

### 5.3 Supabase Realtime Subscriptions

The secondary dashboard subscribes to real-time alert events using Supabase Realtime (PostgreSQL CDC over WebSocket):

```typescript
// Subscribe to new/updated alerts in real-time
const alertsChannel = supabase
  .channel('alerts-feed')
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'alerts',
    filter: `severity=in.(critical,high,medium)`
  }, (payload) => {
    // New alert received — add to feed, trigger toast notification
    handleNewAlert(payload.new as Alert);
  })
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'alerts'
  }, (payload) => {
    // Alert acknowledged/resolved — update in feed
    handleAlertUpdate(payload.new as Alert);
  })
  .subscribe();

// Subscribe to KPI updates
const kpiChannel = supabase
  .channel('kpi-updates')
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'dashboard_kpi_snapshots'
  }, (payload) => {
    queryClient.invalidateQueries({ queryKey: ['kpi-snapshots'] });
  })
  .subscribe();
```

### 5.4 Supabase Edge Functions

#### `alert-processor` — Evaluates events against alert configurations

```typescript
// supabase/functions/alert-processor/index.ts
// Triggered by: Supabase DB Webhook on analytics_events INSERT
// OR called directly from main app on significant events

Deno.serve(async (req) => {
  const event = await req.json(); // { event_type, source_type, source_id, metrics }
  
  // 1. Load matching active alert configurations
  // 2. Evaluate conditions against event metrics
  // 3. Check cooldown (prevent duplicate alerts)
  // 4. Insert into alerts table if threshold exceeded
  // 5. Trigger push notification via send-push-notification function
  
  return new Response(JSON.stringify({ processed: true }));
});
```

#### `send-push-notification` — Delivers Web Push messages

```typescript
// supabase/functions/send-push-notification/index.ts
// Called by alert-processor after creating a new alert

Deno.serve(async (req) => {
  const { alertId, severity, title, message } = await req.json();
  
  // 1. Fetch active push subscriptions for severity >= threshold
  // 2. Sign payload with VAPID private key
  // 3. Send to each subscribed endpoint via Web Push Protocol
  // 4. Handle expired subscriptions (remove 410 Gone responses)
  
  return new Response(JSON.stringify({ sent: subscriptionCount }));
});
```

#### `kpi-aggregator` — Computes periodic KPI snapshots

```typescript
// supabase/functions/kpi-aggregator/index.ts
// Triggered by: pg_cron job every hour
// OR Vercel Cron Job (if hosting on Vercel)

Deno.serve(async (req) => {
  // Compute and upsert into dashboard_kpi_snapshots:
  // - fleet_utilization_rate
  // - on_time_delivery_rate
  // - avg_fuel_efficiency_km_per_l
  // - active_alerts_count_by_severity
  // - maintenance_compliance_rate
  // - incident_rate_per_100_trips
  // - driver_behavior_score_avg
  
  return new Response(JSON.stringify({ computed: kpiCount }));
});
```

### 5.5 Cross-Dashboard Action Bus (Optional)

For bidirectional communication (e.g., MAT Monitor operator acknowledges alert, main dashboard reflects it):

```typescript
// Both apps subscribe to the same alerts table UPDATE events via Realtime
// No dedicated message bus needed — the shared database IS the message bus
// Action: Acknowledge alert in MAT Monitor → updates alerts table
//         → Supabase Realtime notifies main dashboard → UI updates

// For explicit cross-app signals (e.g., "dispatch vehicle from monitor"):
CREATE TABLE dashboard_actions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action_type TEXT NOT NULL,    -- 'assign_vehicle', 'dispatch_driver', etc.
  payload     JSONB NOT NULL DEFAULT '{}',
  source_app  TEXT NOT NULL,    -- 'monitor' | 'main'
  created_by  UUID REFERENCES auth.users(id),
  processed   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

---

## 6. UI Components & Layout

### 6.1 Application Structure

```
MAT Monitor App
├── / (root redirect → /alerts)
├── /alerts              — Live Alert Feed (primary view)
├── /alerts/:id          — Alert Detail & Comment Thread
├── /analytics           — Analytics Dashboard
├── /analytics/kpi       — KPI Scorecard View
├── /analytics/trends    — Trend Charts
├── /analytics/heatmap   — Activity Heatmap
├── /config              — Alert Configuration (rules editor)
└── /settings            — User notification preferences
```

### 6.2 Layout Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Header: MAT Monitor Logo | Nav Links | Realtime Status | User  │
├──────────┬──────────────────────────────────────────────────────┤
│          │                                                       │
│ Sidebar  │   Main Content Area                                   │
│          │                                                       │
│ 🔴 Alerts│   ┌─────────────────────────────────────────────┐   │
│   Feed   │   │  Page Title + Filter Bar                    │   │
│          │   │  [Time Range ▼] [Severity ▼] [Category ▼]  │   │
│ 📊 Analytics  │  [Source ▼] [Search...]      [Export ↓]   │   │
│          │   └─────────────────────────────────────────────┘   │
│ ⚙️ Config │                                                       │
│          │   Main Component (AlertFeed / AnalyticsDashboard)   │
│ 🔔 Notif  │                                                       │
│          │                                                       │
└──────────┴──────────────────────────────────────────────────────┘
```

### 6.3 Alert Feed Components

#### `AlertFeed` — Main alert list

```
┌─────────────────────────────────────────────────────────────────┐
│ Live Alert Feed              [🔴 12 Critical] [🟠 8 High]       │
│                              [🟡 23 Medium]  [🔵 5 Low]        │
├─────────────────────────────────────────────────────────────────┤
│ ● CRITICAL  Speed Violation          2 min ago                 │
│ 🚛 MAT-007 | Beitbridge Road         [Acknowledge] [Details]   │
│ Vehicle exceeded 130 km/h for 45 seconds                       │
├─────────────────────────────────────────────────────────────────┤
│ ● HIGH      Geofence Breach          5 min ago                 │
│ 🚛 MAT-012 | Harare Industrial Zone  [Acknowledge] [Details]   │
│ Vehicle entered restricted zone                                │
├─────────────────────────────────────────────────────────────────┤
│ ● MEDIUM    Maintenance Due          1 hr ago                  │
│ 🔧 MAT-003 | Workshop                [Assign] [Details]        │
│ 15,000 km service overdue by 2,340 km                         │
└─────────────────────────────────────────────────────────────────┘
```

#### Alert Card Component (`AlertCard.tsx`)

Key props and visual elements:
- **Severity Badge**: Color-coded pill (`critical`=red, `high`=orange, `medium`=amber, `low`=blue, `info`=gray)
- **Source Icon**: Vehicle 🚛 / Driver 👤 / Maintenance 🔧 / Fuel ⛽ / System ⚙️
- **Timestamp**: Relative time + absolute on hover (`2 min ago` → `Mar 4, 2026 12:42:29 UTC`)
- **Status Indicator**: Pulsing dot for `active`, static for `acknowledged`
- **Quick Actions**: Acknowledge, Resolve, Add Comment, View Details
- **Expand**: Click to show metadata (location map pin, sensor values)

#### `AlertDetailPanel` — Slide-over drawer

Activated when clicking "Details" on an alert card:
- Full alert metadata (vehicle reg, GPS coordinates, speed, sensor readings)
- Mini Leaflet map showing alert location
- Timeline of status changes (triggered → acknowledged → resolved)
- Comment thread with @mention support
- Action buttons: Acknowledge, Escalate, Suppress, Resolve with note

### 6.4 Analytics Dashboard Components

#### `KPIScorecard` — Top-row metric cards

```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Fleet Util.  │ │ On-Time Del. │ │ Fuel Effic.  │ │ Active Alerts│
│    78.4%     │ │    92.1%     │ │  3.2 km/L    │ │     43       │
│ ▲ +2.3%     │ │ ▼ -1.2%     │ │ ▲ +0.1 km/L  │ │ 🔴 12 Crit  │
└──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘
```

#### `AlertTrendChart` — Alert volume over time (Recharts AreaChart)

- X-axis: time (hourly / daily / weekly)
- Y-axis: alert count
- Multi-series: one area per severity level, stacked
- Tooltip: "March 4: 12 Critical, 8 High, 23 Medium"

#### `AlertByCategoryPieChart` — Distribution (Recharts PieChart)

- Segments: Speed Violation (32%), Geofence (18%), Maintenance (22%), Fuel (14%), Other (14%)
- Legend with counts

#### `FleetUtilizationChart` — Vehicle activity (Recharts BarChart)

- X-axis: vehicles (or vehicle types)
- Y-axis: utilization % or km driven
- Color: green (on schedule), orange (delayed), red (broken down)

#### `FuelEfficiencyTrendLine` — Time series (Recharts LineChart)

- Line per vehicle type
- Reference line: fleet average
- Brush component for zoom/pan

#### `DriverBehaviorHeatmap` — Violations by driver/day

- X-axis: days of week
- Y-axis: drivers
- Cell color: intensity of violations (green → red)
- Tooltip: "John Doe, Monday: 3 speed violations"

#### `AlertsBySourceTable` — Sortable, filterable table

- Columns: Source, Category, Total Alerts, Critical, High, Medium, Last Alert
- Sort by any column
- Click row → filter feed to that source

### 6.5 Filter Bar Component (`AlertFilterBar.tsx`)

Persistent filter bar with debounced inputs:

```typescript
interface AlertFilters {
  timeRange: { start: Date; end: Date } | 'last1h' | 'last24h' | 'last7d' | 'custom';
  severities: ('critical' | 'high' | 'medium' | 'low' | 'info')[];
  categories: string[];
  sourceTypes: string[];
  sourceIds: string[];   // specific vehicle/driver IDs
  statuses: ('active' | 'acknowledged' | 'resolved')[];
  searchQuery: string;
}
```

Filter UI elements:
- **Time Range Selector**: Preset buttons (1h, 24h, 7d, 30d) + DateRangePicker for custom
- **Severity Multi-Select**: Checkboxes with color-coded badges
- **Category Multi-Select**: Dropdown with category icons
- **Source Filter**: Searchable dropdown of vehicles and drivers
- **Status Toggle**: Active / Acknowledged / Resolved
- **Text Search**: Full-text on title + message (debounced 300ms, uses Fuse.js client-side)
- **Reset All**: Clears all filters instantly
- **Active Filter Chips**: Removable chips showing applied filters below the bar

### 6.6 Real-Time Connection Status Widget

Always visible in header:

```
● LIVE  |  Last update: 2s ago  |  47 alerts today
```

- Pulsing green dot when WebSocket connected
- Yellow dot when reconnecting
- Red dot when offline (shows "Reconnecting..." and retries)

### 6.7 Notification Panel (`NotificationCenter.tsx`)

Slide-over panel (bell icon in header):
- List of recent push notifications sent
- Toggle per alert category
- Push notification permission request button
- "Test notification" button for verification

---

## 7. Security Considerations

### 7.1 Authentication Strategy

Both dashboards share **Supabase Auth**. The secondary dashboard:

1. **Uses the same Supabase anon key** — the same key used in the main app
2. **JWT tokens are cross-app compatible** — a user logged into the main dashboard and opening MAT Monitor in another tab is automatically authenticated (same Supabase session via localStorage)
3. **No separate login page needed** — redirect unauthenticated users to main dashboard login OR implement the same Supabase Auth UI React login screen

```typescript
// Shared authentication check in MAT Monitor
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: { session }, isLoading } = useQuery({
    queryKey: ['session'],
    queryFn: () => supabase.auth.getSession().then(r => r.data)
  });
  
  if (isLoading) return <LoadingScreen />;
  if (!session) return <Navigate to="/login" replace />;
  return <>{children}</>;
};
```

### 7.2 Role-Based Access Control (RBAC)

Extend the existing user roles system with monitoring-specific roles:

```sql
-- Add to existing profiles/user_roles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
  monitor_access TEXT NOT NULL DEFAULT 'read_only'
  CHECK (monitor_access IN ('none', 'read_only', 'operator', 'admin'));

-- monitor_access levels:
-- 'none'       — cannot access MAT Monitor
-- 'read_only'  — view alerts and analytics only
-- 'operator'   — can acknowledge/resolve alerts, add comments
-- 'admin'      — full CRUD on alert configurations, user management
```

### 7.3 RLS Enforcement Per Role

```sql
-- Operators can acknowledge/resolve alerts
CREATE POLICY "Operators can update alert status"
  ON alerts FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND monitor_access IN ('operator', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND monitor_access IN ('operator', 'admin')
    )
  );

-- Only admins can manage alert configurations
CREATE POLICY "Admins manage alert configurations"
  ON alert_configurations FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid()
      AND monitor_access = 'admin'
    )
    OR created_by = auth.uid()
  );
```

### 7.4 API Key & Environment Security

```
# MAT Monitor .env — stored as Vercel/deployment environment variables
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon-key>          # Same as main app — public, safe in browser
VITE_VAPID_PUBLIC_KEY=<vapid-public-key>   # For Web Push registration

# Server-side only (Edge Functions — never exposed to browser)
SUPABASE_SERVICE_ROLE_KEY=<service-role>   # Only in Edge Functions
VAPID_PRIVATE_KEY=<vapid-private-key>      # VAPID signing — Edge Function secret
VAPID_SUBJECT=mailto:admin@mat.co.zw
```

### 7.5 Content Security Policy (CSP)

Add to the secondary app's `index.html` and Vercel headers:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self'
    https://*.supabase.co
    wss://*.supabase.co
    https://api.tiles.mapbox.com
    https://*.tile.openstreetmap.org;
  img-src 'self' data: https://*.tile.openstreetmap.org;
  frame-ancestors 'none';
```

### 7.6 Cross-Origin Resource Sharing (CORS)

Since both apps use the **same Supabase project**, there are no CORS issues with database access. For Edge Functions, configure allowed origins:

```typescript
// In Edge Functions — restrict CORS to known origins
const allowedOrigins = [
  'https://mat-dashboard.vercel.app',     // main app
  'https://mat-monitor.vercel.app',       // secondary app
  'http://localhost:5173',                 // local main app dev
  'http://localhost:5174',                 // local secondary app dev
];
```

### 7.7 Session Sharing Between Apps

For seamless SSO between the main and secondary dashboards (same browser):

```typescript
// Both apps use identical Supabase client initialization
// Supabase stores the session in localStorage under key: sb-<project-ref>-auth-token
// Both apps running in the same browser automatically share this session

// Optional: Cross-tab session sync using BroadcastChannel API
const authChannel = new BroadcastChannel('mat-auth');
supabase.auth.onAuthStateChange((event, session) => {
  authChannel.postMessage({ event, session });
});
authChannel.onmessage = ({ data }) => {
  if (data.event === 'SIGNED_OUT') {
    // Sync logout across all tabs/apps
    supabase.auth.signOut();
  }
};
```

### 7.8 Audit Logging

```sql
-- Audit log for sensitive actions in MAT Monitor
CREATE TABLE monitor_audit_log (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id),
  action      TEXT NOT NULL,
  -- e.g. 'alert.acknowledge', 'alert.resolve', 'config.create', 'config.delete'
  resource_id UUID,
  resource_type TEXT,
  metadata    JSONB DEFAULT '{}',
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_audit_log_user ON monitor_audit_log(user_id, created_at DESC);
CREATE INDEX idx_audit_log_action ON monitor_audit_log(action, created_at DESC);
```

---

## 8. Real-Time Notifications & Push Mechanisms

### 8.1 Three-Layer Notification Architecture

```
Layer 1: In-App Toast (Sonner)
  └── Immediate UI feedback when WebSocket event received
  └── Severity-colored toasts with sound option (critical = audio chime)
  └── Stacks up to 5 visible toasts, remainder in notification center

Layer 2: Browser Push Notifications (Web Push API)
  └── Works even when app is in background or closed
  └── Requires user permission grant (one-time prompt)
  └── Delivered via Supabase Edge Function + VAPID signing
  └── Click notification → deep links to alert detail page

Layer 3: Email Notifications (Supabase + Resend/SendGrid)
  └── Digest emails for critical alerts (configurable per user)
  └── Daily summary of unacknowledged alerts
  └── Sent via Supabase Edge Function trigger
```

### 8.2 Service Worker Implementation

```typescript
// public/sw.js — Service Worker for push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const { title, body, severity, alertId, icon } = data;

  const severityColors = {
    critical: '#ef4444',
    high: '#f97316',
    medium: '#f59e0b',
    low: '#3b82f6',
    info: '#6b7280',
  };

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: icon ?? '/icon-192.png',
      badge: '/icon-48.png',
      tag: `alert-${alertId}`,    // Replaces previous notification for same alert
      renotify: severity === 'critical',
      vibrate: severity === 'critical' ? [200, 100, 200] : [100],
      data: { alertId, url: `/alerts/${alertId}` },
      actions: [
        { action: 'acknowledge', title: '✓ Acknowledge' },
        { action: 'view',        title: '👁 View Details' },
      ],
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'acknowledge') {
    // Call Supabase Edge Function to acknowledge alert
    fetch('/api/alerts/acknowledge', {
      method: 'POST',
      body: JSON.stringify({ alertId: event.notification.data.alertId }),
    });
  } else {
    // Open/focus the MAT Monitor app at the alert detail page
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});
```

### 8.3 Push Subscription Registration

```typescript
// hooks/usePushNotifications.ts
export function usePushNotifications() {
  const { data: session } = useSession();

  const subscribe = async () => {
    // 1. Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return { success: false, reason: 'denied' };

    // 2. Get service worker registration
    const registration = await navigator.serviceWorker.ready;

    // 3. Subscribe to Web Push with VAPID key
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        import.meta.env.VITE_VAPID_PUBLIC_KEY
      ),
    });

    // 4. Store subscription in Supabase
    await supabase.from('alert_subscriptions').upsert({
      user_id: session!.user.id,
      push_subscription: subscription.toJSON(),
      device_label: `${navigator.platform} — ${getBrowserName()}`,
      is_active: true,
    });

    return { success: true };
  };

  const unsubscribe = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      await supabase
        .from('alert_subscriptions')
        .update({ is_active: false })
        .eq('user_id', session!.user.id);
    }
  };

  return { subscribe, unsubscribe };
}
```

### 8.4 In-App Real-Time Alert Stream

```typescript
// hooks/useAlertStream.ts
export function useAlertStream(filters: AlertFilters) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('alert-stream')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'alerts',
      }, (payload) => {
        const newAlert = payload.new as Alert;

        // Add to top of alerts list in React Query cache
        queryClient.setQueryData(['alerts', filters], (old: Alert[] = []) => {
          return [newAlert, ...old];
        });

        // Trigger toast notification
        const toastFn = newAlert.severity === 'critical' ? toast.error
          : newAlert.severity === 'high' ? toast.warning
          : toast.info;

        toastFn(`${newAlert.title}`, {
          description: `${newAlert.source_label} • ${newAlert.message}`,
          duration: newAlert.severity === 'critical' ? 10000 : 5000,
          action: {
            label: 'View',
            onClick: () => navigate(`/alerts/${newAlert.id}`),
          },
        });

        // Play audio for critical alerts
        if (newAlert.severity === 'critical') {
          new Audio('/alert-chime.mp3').play().catch(() => {});
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'alerts',
      }, (payload) => {
        queryClient.invalidateQueries({ queryKey: ['alerts'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filters, queryClient]);
}
```

### 8.5 Alert Severity Sound Configuration

```typescript
// constants/alertSounds.ts
export const ALERT_SOUNDS: Record<AlertSeverity, string | null> = {
  critical: '/sounds/critical-alarm.mp3',   // Loud urgent tone
  high:     '/sounds/high-beep.mp3',         // Double beep
  medium:   '/sounds/medium-chime.mp3',      // Single chime
  low:      null,                            // Silent
  info:     null,                            // Silent
};

// User can configure sound preferences in /settings
```

### 8.6 Email Notification via Supabase Edge Function

```typescript
// supabase/functions/send-alert-email/index.ts
// Triggered when a critical alert is created and notify_email = true

Deno.serve(async (req) => {
  const { alertId } = await req.json();

  // Fetch alert details
  const { data: alert } = await supabase
    .from('alerts')
    .select('*, config:alert_configurations(notify_email)')
    .eq('id', alertId)
    .single();

  if (!alert?.config?.notify_email) {
    return new Response(JSON.stringify({ skipped: true }));
  }

  // Fetch subscribers who want email for this severity
  const { data: subscribers } = await supabase
    .from('profiles')
    .select('email, full_name')
    .not('email', 'is', null);

  // Send via Resend API (or SendGrid)
  const emailHtml = renderAlertEmail(alert);
  await resend.emails.send({
    from: 'MAT Monitor <alerts@mat.co.zw>',
    to: subscribers.map(s => s.email),
    subject: `[${alert.severity.toUpperCase()}] ${alert.title}`,
    html: emailHtml,
  });

  return new Response(JSON.stringify({ sent: subscribers.length }));
});
```

---

## 9. Interactive Analytics & Filtering

### 9.1 Filter State Architecture

Use URL search params as the single source of truth for filters — makes filters shareable via URL and survives page refreshes:

```typescript
// hooks/useAlertFilters.ts
import { useSearchParams } from 'react-router-dom';
import { parseISO, sub } from 'date-fns';

export function useAlertFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: AlertFilters = {
    timeRange: searchParams.get('range') ?? 'last24h',
    startDate: searchParams.get('start')
      ? parseISO(searchParams.get('start')!)
      : sub(new Date(), { hours: 24 }),
    endDate: searchParams.get('end')
      ? parseISO(searchParams.get('end')!)
      : new Date(),
    severities: searchParams.getAll('severity') as AlertSeverity[],
    categories: searchParams.getAll('category'),
    sourceTypes: searchParams.getAll('sourceType'),
    statuses: searchParams.getAll('status') as AlertStatus[],
    searchQuery: searchParams.get('q') ?? '',
  };

  const updateFilter = (key: string, value: string | string[]) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete(key);
      if (Array.isArray(value)) {
        value.forEach(v => next.append(key, v));
      } else if (value) {
        next.set(key, value);
      }
      return next;
    }, { replace: true });
  };

  const resetFilters = () => setSearchParams({});

  return { filters, updateFilter, resetFilters };
}
```

### 9.2 Time Range Presets

```typescript
// components/TimeRangeSelector.tsx
const TIME_RANGE_PRESETS = [
  { label: '1H',   value: 'last1h',   hours: 1   },
  { label: '6H',   value: 'last6h',   hours: 6   },
  { label: '24H',  value: 'last24h',  hours: 24  },
  { label: '7D',   value: 'last7d',   days: 7    },
  { label: '30D',  value: 'last30d',  days: 30   },
  { label: '90D',  value: 'last90d',  days: 90   },
  { label: 'Custom', value: 'custom', custom: true },
];
```

For "Custom" — render a `react-day-picker` DateRange picker inline.

### 9.3 Server-Side Filtering with React Query

```typescript
// hooks/useAlerts.ts
export function useAlerts(filters: AlertFilters) {
  return useInfiniteQuery({
    queryKey: ['alerts', filters],
    queryFn: async ({ pageParam = 0 }) => {
      let query = supabase
        .from('alerts')
        .select('*', { count: 'exact' })
        .gte('triggered_at', filters.startDate.toISOString())
        .lte('triggered_at', filters.endDate.toISOString())
        .order('triggered_at', { ascending: false })
        .range(pageParam, pageParam + 49);  // 50 per page

      if (filters.severities.length > 0) {
        query = query.in('severity', filters.severities);
      }
      if (filters.categories.length > 0) {
        query = query.in('category', filters.categories);
      }
      if (filters.statuses.length > 0) {
        query = query.in('status', filters.statuses);
      }
      if (filters.searchQuery) {
        query = query.or(
          `title.ilike.%${filters.searchQuery}%,message.ilike.%${filters.searchQuery}%`
        );
      }

      const { data, count, error } = await query;
      if (error) throw error;
      return { data, count, nextOffset: pageParam + 50 };
    },
    getNextPageParam: (last, pages) =>
      last.data?.length === 50
        ? pages.length * 50
        : undefined,
    staleTime: 30_000,
  });
}
```

### 9.4 Analytics Filtering

```typescript
// hooks/useAnalyticsData.ts
export function useAnalyticsData(
  metricName: string,
  filters: AnalyticsFilters
) {
  return useQuery({
    queryKey: ['analytics', metricName, filters],
    queryFn: async () => {
      const { data } = await supabase
        .from('analytics_events')
        .select('metrics, dimensions, occurred_at')
        .eq('event_type', metricName)
        .gte('occurred_at', filters.startDate.toISOString())
        .lte('occurred_at', filters.endDate.toISOString())
        .order('occurred_at', { ascending: true });

      // Client-side aggregation for chart grouping
      return aggregateByPeriod(data ?? [], filters.granularity);
    },
    staleTime: 60_000,
  });
}

function aggregateByPeriod(
  events: AnalyticsEvent[],
  granularity: 'hour' | 'day' | 'week' | 'month'
) {
  // Group events by time period, sum/average metrics
  // Returns array suitable for Recharts: [{ period: 'Mar 4', value: 12 }, ...]
}
```

### 9.5 Saved Filter Presets

Allow users to save frequently-used filter combinations:

```sql
CREATE TABLE saved_alert_filters (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  filters     JSONB NOT NULL,   -- Serialized AlertFilters object
  is_default  BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

UI: "Save Filter" button in the filter bar → names and stores current filter set → shows in "My Saved Filters" dropdown for one-click restore.

### 9.6 Export Functionality

```typescript
// utils/exportAlerts.ts
export async function exportAlertsToCSV(filters: AlertFilters): Promise<void> {
  const { data } = await supabase
    .from('alerts')
    .select('*')
    .gte('triggered_at', filters.startDate.toISOString())
    .lte('triggered_at', filters.endDate.toISOString())
    .order('triggered_at', { ascending: false });

  const csv = convertToCSV(data ?? [], [
    'triggered_at', 'severity', 'category', 'source_label',
    'title', 'message', 'status', 'acknowledged_at', 'resolved_at',
  ]);

  downloadFile(csv, `mat-alerts-${formatDate(new Date())}.csv`, 'text/csv');
}

export async function exportAnalyticsToPDF(
  chartRefs: React.RefObject<HTMLDivElement>[],
  title: string
): Promise<void> {
  const pdf = new jsPDF({ orientation: 'landscape' });
  for (const ref of chartRefs) {
    const canvas = await html2canvas(ref.current!);
    pdf.addImage(canvas.toDataURL(), 'PNG', 10, 10, 280, 160);
    pdf.addPage();
  }
  pdf.save(`${title}-${formatDate(new Date())}.pdf`);
}
```

### 9.7 Drill-Down Analytics

Click any chart segment to automatically apply that dimension as a filter:

```typescript
// In AlertByCategoryPieChart
<Pie
  data={data}
  onClick={(entry) => {
    // Clicking "Speed Violation" segment → adds category filter
    updateFilter('category', entry.name);
  }}
/>

// In AlertTrendChart
<Bar
  onClick={(data, index) => {
    // Clicking a specific day bar → sets custom time range to that day
    const clickedDate = new Date(data.period);
    updateFilter('start', startOfDay(clickedDate).toISOString());
    updateFilter('end', endOfDay(clickedDate).toISOString());
    updateFilter('range', 'custom');
  }}
/>
```

---

## 10. Deployment Strategy

### 10.1 Recommended: Vercel (Mirrors Parent App)

The secondary dashboard is deployed as an independent Vite/React application on Vercel, consistent with the main app's deployment pattern.

```
Directory Structure:
/workspaces/
  mat/              ← Main dashboard (existing)
  mat-monitor/      ← Secondary dashboard (new)
    src/
    public/
    package.json
    vite.config.ts
    vercel.json
```

**`mat-monitor/vercel.json`:**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; connect-src 'self' https://*.supabase.co wss://*.supabase.co; img-src 'self' data: https://*.tile.openstreetmap.org; style-src 'self' 'unsafe-inline'"
        }
      ]
    },
    {
      "source": "/sw.js",
      "headers": [
        { "key": "Cache-Control", "value": "no-cache" },
        { "key": "Service-Worker-Allowed", "value": "/" }
      ]
    }
  ]
}
```

**Deployment commands:**
```bash
cd mat-monitor
vercel --prod   # First deploy → assigns URL: https://mat-monitor.vercel.app
```

### 10.2 Alternative: Docker Microservice

For self-hosted environments (on-premise or private cloud):

**`mat-monitor/Dockerfile`:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**`mat-monitor/nginx.conf`:**
```nginx
server {
  listen 80;
  root /usr/share/nginx/html;
  index index.html;

  # SPA routing
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Cache static assets
  location ~* \.(js|css|png|jpg|ico|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # No cache for service worker
  location /sw.js {
    add_header Cache-Control "no-cache";
  }
}
```

**Docker Compose (with main app):**
```yaml
version: '3.8'
services:
  mat-main:
    build: ./mat
    ports: ['5173:80']
    environment:
      - VITE_SUPABASE_URL=${SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}

  mat-monitor:
    build: ./mat-monitor
    ports: ['5174:80']
    environment:
      - VITE_SUPABASE_URL=${SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY}
      - VITE_VAPID_PUBLIC_KEY=${VAPID_PUBLIC_KEY}
    depends_on: [mat-main]
```

### 10.3 Kubernetes Deployment (Enterprise Scale)

```yaml
# k8s/mat-monitor-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mat-monitor
  namespace: mat
spec:
  replicas: 2
  selector:
    matchLabels:
      app: mat-monitor
  template:
    metadata:
      labels:
        app: mat-monitor
    spec:
      containers:
      - name: mat-monitor
        image: ghcr.io/mat/mat-monitor:latest
        ports:
        - containerPort: 80
        envFrom:
        - secretRef:
            name: mat-monitor-secrets
        resources:
          requests:
            cpu: "50m"
            memory: "64Mi"
          limits:
            cpu: "200m"
            memory: "256Mi"
---
apiVersion: v1
kind: Service
metadata:
  name: mat-monitor-svc
  namespace: mat
spec:
  selector:
    app: mat-monitor
  ports:
  - port: 80
    targetPort: 80
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: mat-monitor-ingress
  namespace: mat
  annotations:
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
spec:
  tls:
  - hosts: [monitor.mat.co.zw]
    secretName: mat-monitor-tls
  rules:
  - host: monitor.mat.co.zw
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: mat-monitor-svc
            port:
              number: 80
```

### 10.4 CI/CD Pipeline

```yaml
# .github/workflows/deploy-mat-monitor.yml
name: Deploy MAT Monitor
on:
  push:
    branches: [main]
    paths: ['mat-monitor/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
        cache-dependency-path: mat-monitor/package-lock.json

    - name: Install dependencies
      run: cd mat-monitor && npm ci

    - name: Type check
      run: cd mat-monitor && npx tsc --noEmit

    - name: Lint
      run: cd mat-monitor && npm run lint

    - name: Build
      run: cd mat-monitor && npm run build
      env:
        VITE_SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
        VITE_VAPID_PUBLIC_KEY: ${{ secrets.VAPID_PUBLIC_KEY }}

    - name: Deploy to Vercel
      run: cd mat-monitor && npx vercel --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### 10.5 Database Migration Strategy

Run new table migrations through the Supabase CLI shared with the main app:

```bash
# From /workspaces/mat (main app project)
supabase migration new add_monitor_tables
# Edit the generated migration file with the SQL from Section 4
supabase db push   # Applies to remote Supabase instance
```

The secondary dashboard does not manage its own migrations — all schema changes go through the primary app's Supabase project.

---

## 11. Implementation Roadmap

### Phase 1 — Foundation (Weeks 1–2)

**Goal:** Runnable skeleton with authentication and basic alert feed.

| Task | Details |
|------|---------|
| Scaffold `mat-monitor` project | `npm create vite@latest mat-monitor -- --template react-ts` |
| Configure Tailwind + shadcn/ui | Match main app's `components.json` configuration |
| Set up Supabase client | Shared project credentials, same client pattern as main app |
| Implement `ProtectedRoute` + login page | Supabase Auth UI React, redirect to main app on logout |
| Run database migrations | Create `alerts`, `alert_configurations`, `analytics_events`, `alert_subscriptions`, `dashboard_kpi_snapshots` tables |
| Build basic `AlertFeed` page | Static layout, no real data yet |
| Connect `AlertFeed` to Supabase | `useAlerts` hook with React Query, basic pagination |
| Deploy to Vercel (staging) | Verify auth works, alerts table populates |

### Phase 2 — Real-Time Alerts (Weeks 3–4)

**Goal:** Live alert stream with filtering and notifications.

| Task | Details |
|------|---------|
| Implement `useAlertStream` hook | Supabase Realtime subscription on `alerts` table |
| Build `AlertCard` component | Severity badges, timestamps, source icons, quick actions |
| Build `AlertFilterBar` | Time range, severity, category, status filters using URL params |
| Implement alert acknowledge/resolve | PATCH via Supabase client with RBAC check |
| Build `AlertDetailPanel` | Slide-over drawer with metadata, mini map, comment thread |
| Implement `alert_comments` | INSERT + realtime subscription for live comments |
| Build `NotificationCenter` | In-app notification history panel |
| Register Service Worker | Basic push notification setup |
| Implement Web Push | `usePushNotifications` hook, `send-push-notification` Edge Function |
| Deploy Supabase Edge Functions | `alert-processor`, `send-push-notification` |

### Phase 3 — Analytics Dashboard (Weeks 5–6)

**Goal:** Full analytics suite with charts, KPIs, and filtering.

| Task | Details |
|------|---------|
| Build `KPIScorecard` component | 4 KPI cards from `dashboard_kpi_snapshots` |
| Build `AlertTrendChart` | Recharts AreaChart, multi-series by severity |
| Build `AlertByCategoryPieChart` | Recharts PieChart with legend |
| Build `FleetUtilizationChart` | Recharts BarChart from analytics events |
| Build `FuelEfficiencyTrendLine` | Recharts LineChart with Brush component |
| Build `DriverBehaviorHeatmap` | Custom heatmap using Recharts or Nivo |
| Implement `kpi-aggregator` Edge Function | Hourly KPI computation, pg_cron scheduling |
| Build analytics filter bar | Time range, metric selection, dimension breakdowns |
| Implement drill-down chart clicks | Chart click → apply filter |
| Add export functionality | CSV for alerts, PDF for analytics charts |

### Phase 4 — Configuration & Security (Week 7)

**Goal:** Alert rule management and hardened security.

| Task | Details |
|------|---------|
| Build `AlertConfigEditor` | Form to create/edit/delete alert rules |
| Implement condition builder | JSON condition editor with visual UI |
| Build `UserNotificationSettings` | Per-user push preferences, cooldown settings |
| Implement saved filter presets | Save/load named filter combinations |
| Implement RBAC in UI | Hide/show actions based on `monitor_access` role |
| Add audit logging | Log all alert acknowledgments and config changes |
| Configure CSP headers | Vercel headers config |
| Add email notifications | `send-alert-email` Edge Function + Resend integration |
| Security penetration review | Test RLS policies, verify no unauthorized data access |

### Phase 5 — Polish & Production (Week 8)

**Goal:** Production-ready with monitoring and observability.

| Task | Details |
|------|---------|
| Add connection status widget | Live/reconnecting/offline indicator in header |
| Implement alert sound system | Severity-based audio cues, user toggle |
| Optimize with `@tanstack/react-virtual` | Virtualized alert list for 10,000+ items |
| Add PWA manifest | `manifest.webmanifest`, icons, offline page |
| Performance testing | Lighthouse audit, bundle analysis, Core Web Vitals |
| Load testing | Simulate 1000+ concurrent realtime connections |
| Setup Vercel Analytics | Monitor real-user performance metrics |
| Write user documentation | Operations manual for alert management |
| Staging → Production deployment | Final Vercel production deploy |
| Verify cross-dashboard SSO | Test session sharing between main and monitor apps |

---

## Summary: Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Shared vs separate backend** | Shared Supabase | Zero duplication; same RLS/auth; no sync needed |
| **Real-time protocol** | Supabase Realtime (WebSocket) | Already in main app; proven for this scale |
| **Push notifications** | Web Push API (browser native) | No FCM/APNs dependency; works cross-platform |
| **Alert storage** | New `alerts` table in shared DB | Enables cross-app queries; main app can also read |
| **Cross-app auth** | Shared Supabase JWT (same anon key) | Seamless SSO in same browser via localStorage |
| **KPI computation** | Pre-aggregated snapshots + Edge Functions | Fast dashboard load; avoids expensive real-time GROUP BY |
| **Filter state** | URL search params | Shareable links; survives refresh; no Redux needed |
| **Deployment** | Vercel (separate project, same org) | Consistent with main app; zero DevOps overhead |
| **Codebase** | Separate directory `mat-monitor/` | Independent deployments; shared design system |
| **Component library** | shadcn/ui (mirrors main app) | Consistent visual identity; shared Tailwind config |

