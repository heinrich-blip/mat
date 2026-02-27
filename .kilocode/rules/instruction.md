# instruction.md

Car Craft Co - Fleet Management System Development Guidelines

## Guidelines

**All project files are located at:** `C:\Users\wwwhj\Downloads\matanuska-main`

This is the **monorepo root** containing:
- **Dashboard App** (Vite + React) - Main back-office application
- **Workshop Mobile App** (React + Vite) - Workshop-focused mobile interface
- **Mobile App Next.js** (Next.js) - Driver/field mobile application

---

# Car Craft Co - Fleet Management System

## Project Architecture Overview

This is a **multi-application fleet management system** built with:
- **Dashboard App**: Vite + React + TypeScript (back-office operations)
- **Workshop Mobile**: React + Vite (workshop-specific mobile interface)
- **Mobile Next.js App**: Next.js + React (driver/field operations)

All apps share:
- **UI**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + RLS + Real-time)
- **State**: @tanstack/react-query (v5) + React Context

### Core Stack
- **Frontend**: React 18 + TypeScript + Vite (dashboard/workshop) / Next.js (mobile)
- **UI**: shadcn/ui (Radix primitives) + Tailwind CSS + Lucide icons
- **Backend**: Supabase (Auth, PostgreSQL, RLS, Real-time subscriptions)
- **State**: @tanstack/react-query (v5) for server state, React Context for auth
- **Routing**: react-router-dom v6 (dashboard/workshop) / Next.js App Router (mobile)
- **Forms**: react-hook-form + zod validation

## Application Structure

```
C:\Users\wwwhj\Downloads\matanuska-main\
├── 📱 DASHBOARD APP (Main Back-Office)
│   ├── src/
│   ├── package.json
│   └── ...
│
├── 🔧 WORKSHOP MOBILE APP (Workshop Operations)
│   ├── mobile/
│   │   ├── src/
│   │   ├── package.json
│   │   └── ...
│   └── ...
│
├── 📦 MOBILE APP NEXT.JS (Driver/Field Operations)
│   ├── mobile-app-nextjs/
│   │   ├── src/
│   │   ├── package.json
│   │   └── ...
│   └── ...
│
├── supabase/
│   └── migrations/          # Shared database migrations
│
├── PHASE_1_COMPLETION_SUMMARY.md
├── PHASE_2_QUICK_START.md
└── REALTIME_USAGE.md
```

## Application-Specific Details

### 1. DASHBOARD APP (Main Application)
**Location:** `C:\Users\wwwhj\Downloads\matanuska-main\`

Comprehensive back-office management system with full feature set:

#### Key Directories:
```
src/
├── components/
│   ├── admin/              # Admin panel components
│   ├── analytics/          # Analytics dashboards
│   ├── costs/              # Cost management
│   ├── debug/              # Debug tools
│   ├── dialogs/            # All modal dialogs
│   │   └── parts/          # Parts request dialogs
│   ├── diesel/             # Diesel management
│   ├── driver/             # Driver management
│   ├── incidents/          # Incident tracking
│   ├── inspections/        # Vehicle inspections
│   ├── inventory/          # Phase 1 inventory
│   ├── invoicing/          # Invoicing system
│   ├── loads/              # Load management
│   │   └── calendar/       # Load calendar views
│   ├── maintenance/        # Job cards & maintenance
│   ├── map/                # Map visualizations
│   ├── operations/         # Operations management
│   ├── reports/            # Reporting system
│   ├── sensors/            # Wialon sensors
│   ├── trips/              # Trip management
│   ├── tyres/              # Tyre management
│   ├── ui/                 # shadcn/ui primitives
│   ├── Vehicle/            # Vehicle management
│   └── wialon/             # Wialon integration
├── pages/                   # 30+ route pages
├── hooks/                   # 50+ custom hooks
├── contexts/                # Auth, LoadRealtime, Operations
├── integrations/            
│   ├── supabase/           # Supabase client & types
│   └── wialon/             # Wialon telematics
├── lib/                     # Utilities & helpers
├── constants/               # fleetTyreConfig.ts, etc.
├── types/                   # TypeScript interfaces
└── utils/                   # Helper functions
```

### 2. WORKSHOP MOBILE APP
**Location:** `C:\Users\wwwhj\Downloads\matanuska-main\mobile\`

Workshop-focused mobile interface for mechanics and workshop staff:

#### Key Directories:
```
mobile/src/
├── components/
│   ├── dialogs/             # Mobile-optimized dialogs
│   │   └── parts/           # Parts request dialogs
│   ├── inspections/         # Mobile inspection forms
│   ├── maintenance/         # Quick maintenance actions
│   ├── mobile/              # Mobile-specific layouts
│   │   ├── MobileInspectionsTab.tsx
│   │   ├── MobileJobCards.tsx
│   │   ├── MobileMaintenance.tsx
│   │   ├── MobileTyresTab.tsx
│   │   ├── WorkshopMobileLayout.tsx
│   │   └── WorkshopMobileShell.tsx
│   ├── tyres/               # Tyre management (shared)
│   └── ui/                  # Mobile-optimized shadcn/ui
├── pages/
│   ├── Auth.tsx
│   ├── InspectionDetails.tsx
│   ├── MobileInspections.tsx
│   ├── TyreInspections.tsx
│   └── TyreManagement.tsx
├── hooks/                    # Mobile-specific hooks
├── contexts/                 # AuthContext (shared pattern)
├── integrations/supabase/    # Supabase client (shared types)
├── constants/                # fleetTyreConfig.ts (shared)
└── utils/                    # Mobile utilities
```

### 3. MOBILE APP NEXT.JS (Driver App)
**Location:** `C:\Users\wwwhj\Downloads\matanuska-main\mobile-app-nextjs\`

Next.js-based mobile app for drivers and field staff:

#### Key Directories:
```
mobile-app-nextjs/src/
├── app/                      # Next.js App Router
│   ├── diesel/               # Diesel tracking
│   │   └── page.tsx
│   ├── expenses/             # Expense tracking
│   │   └── page.tsx
│   ├── login/                # Authentication
│   │   └── page.tsx
│   ├── profile/              # Driver profile
│   │   └── page.tsx
│   ├── trip/                 # Trip management
│   │   └── page.tsx
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   ├── metadata.ts           # App metadata
│   └── not-found.tsx         # 404 page
├── components/
│   ├── layout/
│   │   ├── bottom-nav.tsx    # Mobile bottom navigation
│   │   ├── index.ts
│   │   └── mobile-shell.tsx  # Mobile shell layout
│   ├── ui/                   # shadcn/ui components
│   ├── cycle-tracker-form.tsx
│   ├── providers.tsx
│   ├── pwa-install-prompt.tsx
│   ├── trip-detail-sheet.tsx
│   └── trip-link-form.tsx
├── constants/
│   └── cost-categories.ts    # Expense categories
├── contexts/
│   └── auth-context.tsx      # Next.js auth context
├── hooks/
│   ├── use-realtime.ts       # Real-time subscriptions
│   └── use-toast.ts          # Toast notifications
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser client
│   │   ├── middleware.ts      # Next.js middleware
│   │   └── server.ts          # Server client
│   └── utils.ts
├── proxy.ts                   # API proxy configuration
└── types/
    └── database.ts            # Supabase types (shared)
```

## Critical Patterns & Conventions

### 1. Data Fetching Pattern (ALL APPS)

```typescript
// Dashboard & Workshop Apps (React Query)
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const {
  data: vehicles = [],
  isLoading,
  error,
  refetch,
} = useQuery({
  queryKey: ["vehicles", optionalFilter],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("active", true)
      .order("fleet_number");

    if (error) throw error;
    return data || [];
  },
});

// Mobile Next.js App (React Query - same pattern)
// Import from @tanstack/react-query
```

### 2. Toast Notations - ⚠️ CRITICAL

```typescript
// ✅ ALL APPS: Use useToast from @/hooks/use-toast
import { useToast } from "@/hooks/use-toast";
const { toast } = useToast();

// Dashboard & Workshop Apps ONLY: Sonner legacy support
import { toast as sonnerToast } from "sonner"; // Legacy only
```

### 3. Cross-App Shared Resources

```typescript
// Shared Types - Always regenerate after migrations
// Run from root directory:
cd C:\Users\wwwhj\Downloads\matanuska-main
npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp > src/integrations/supabase/types.ts
npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp > mobile/src/integrations/supabase/types.ts
npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp > mobile-app-nextjs/src/types/database.ts

// Shared Constants (example)
// Dashboard: src/constants/fleetTyreConfig.ts
// Workshop: mobile/src/constants/fleetTyreConfig.ts (copy)
// Mobile Next: mobile-app-nextjs/src/constants/cost-categories.ts
```

### 4. App-Specific Import Rules

```typescript
// DASHBOARD APP - Use @/ alias
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";

// WORKSHOP MOBILE - Use @/ alias (configured in vite)
import { WorkshopMobileLayout } from "@/components/mobile/WorkshopMobileLayout";
import { supabase } from "@/integrations/supabase/client";

// MOBILE NEXT.JS - Use @/ alias (Next.js default)
import { MobileShell } from "@/components/layout/mobile-shell";
import { supabase } from "@/lib/supabase/client";
```

## Development Workflow

```bash
# Navigate to root
cd C:\Users\wwwhj\Downloads\matanuska-main

# Start Dashboard App
npm run dev

# Start Workshop Mobile App (in another terminal)
cd mobile
npm run dev

# Start Mobile Next.js App (in another terminal)
cd mobile-app-nextjs
npm run dev

# Build all apps
# Dashboard
npm run build

# Workshop Mobile
cd mobile && npm run build

# Mobile Next.js
cd mobile-app-nextjs && npm run build
```

## Key Files to Reference

| File | Purpose | Location |
|------|---------|----------|
| **Dashboard Auth** | Session management | `src/contexts/AuthContext.tsx` |
| **Workshop Auth** | Session management | `mobile/src/contexts/AuthContext.tsx` |
| **Mobile Next Auth** | Session management | `mobile-app-nextjs/src/contexts/auth-context.tsx` |
| **Supabase Types** | DB types (regenerate after migrations) | `src/integrations/supabase/types.ts` |
| **Workshop Types** | DB types (copy from dashboard) | `mobile/src/integrations/supabase/types.ts` |
| **Mobile Next Types** | DB types | `mobile-app-nextjs/src/types/database.ts` |
| **Phase 1 Docs** | Inventory implementation | `PHASE_1_COMPLETION_SUMMARY.md` |
| **Phase 2 Docs** | Next features guide | `PHASE_2_QUICK_START.md` |
| **Real-time Patterns** | Subscription examples | `REALTIME_USAGE.md` |
| **Fleet Configs** | Tyre layouts | `src/constants/fleetTyreConfig.ts` |

## Common Gotchas - ⚠️ READ THIS

1. **❌ NEVER use relative imports** (`../../`)
   - ✅ ALWAYS use `@/` imports in all apps

2. **❌ NEVER edit shadcn/ui components** in `components/ui/`
   - Regenerate with `npx shadcn-ui@latest add [component]`

3. **⚠️ TypeScript types MUST be regenerated in ALL APPS** after migrations
   - Run type generation for each app
   - Types must stay in sync across all three apps

4. **⚠️ Toast systems differ by app**
   - Dashboard: Two systems (useToast preferred, sonner legacy)
   - Workshop: Two systems (useToast preferred, sonner legacy)
   - Mobile Next: useToast only

5. **⚠️ Real-time subscriptions MUST clean up** in all apps
   - Always include return function with `removeChannel`

6. **⚠️ Phase 1 inventory features** are primarily in Dashboard
   - Workshop has limited inventory views
   - Mobile Next has no inventory (driver-focused)

7. **⚠️ Navigation patterns differ**
   - Dashboard: react-router-dom + Layout
   - Workshop: react-router-dom + WorkshopMobileLayout
   - Mobile Next: Next.js App Router + bottom-nav

## When Adding Features - By App Type

### Dashboard App Features
- Full CRUD operations
- Complex data tables and filters
- Analytics and reporting
- Admin functions
- Inventory management
- Wialon integration

### Workshop Mobile Features
- Mobile-optimized forms
- Quick actions (inspections, job cards)
- QR code scanning
- Offline-capable where possible
- Limited to workshop operations

### Mobile Next.js Features
- Driver-focused interface
- Trip tracking
- Expense entry
- Diesel logging
- PWA capabilities
- Offline-first approach

## Migration Process (All Apps)

1. Create migration in `supabase/migrations/`
2. Apply via Supabase Dashboard SQL Editor or CLI
3. **IMMEDIATELY** regenerate types for ALL apps:
   ```bash
   cd C:\Users\wwwhj\Downloads\matanuska-main
   npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp > src/integrations/supabase/types.ts
   npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp > mobile/src/integrations/supabase/types.ts
   npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp > mobile-app-nextjs/src/types/database.ts
   ```
4. Update components in each app as needed
5. Test queries and RLS policies

## Quick Start Template by App

### Dashboard App Component
```typescript
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";

export function DashboardFeature() {
  const { toast } = useToast();
  // Component logic
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Feature</h1>
      </div>
    </Layout>
  );
}
```

### Workshop Mobile Component
```typescript
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WorkshopMobileLayout } from "@/components/mobile/WorkshopMobileLayout";

export function WorkshopFeature() {
  const { toast } = useToast();
  return (
    <WorkshopMobileLayout>
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Feature</h1>
      </div>
    </WorkshopMobileLayout>
  );
}
```

### Mobile Next.js Component
```typescript
"use client";

import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";
import { MobileShell } from "@/components/layout/mobile-shell";

export default function MobileFeature() {
  const { toast } = useToast();
  return (
    <MobileShell>
      <div className="p-4 space-y-4">
        <h1 className="text-2xl font-bold">Feature</h1>
      </div>
    </MobileShell>
  );
}
```

---

**Remember**: 
- Root directory: `C:\Users\wwwhj\Downloads\matanuska-main\matanuska-main`
- Three separate apps with shared backend
- Always regenerate types in ALL apps after migrations
- Use app-appropriate layouts and patterns
- Toast system: useToast hook in all new code
- Clean up real-time subscriptions
- Include all filter params in queryKeys