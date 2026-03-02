# Car Craft Co - Fleet Management System Guidelines

**Root:** `C:\Users\wwwhj\Downloads\matanuska-main\matanuska-main`

## Core Stack
- **Frontend**: React 18 + TypeScript + Vite
- **UI**: shadcn/ui + Tailwind + Lucide icons
- **Backend**: Supabase (PostgreSQL + RLS + Realtime)
- **State**: TanStack Query v5 + React Context
- **Forms**: react-hook-form + zod

## Apps

| App | Location | Stack | Purpose |
|-----|----------|-------|---------|
| Dashboard | `./src/` | Vite + React + TS | Back-office |
| Workshop Mobile | `./mobile/src/` | Vite + React + TS | Workshop staff |
| Driver App | `./mobile-app-nextjs/src/` | Next.js | Drivers/field |

---

## CRITICAL RULES

### 1. Imports
- **ALWAYS use `@/`** - never relative paths (`../../`)

### 2. UI Components
- **NEVER edit `components/ui/`** - regenerate with shadcn CLI

### 3. Database Migrations
After ANY migration, regenerate types in **ALL THREE** apps:
```bash
# Dashboard
npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp > src/integrations/supabase/types.ts

# Workshop Mobile
npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp > mobile/src/integrations/supabase/types.ts

# Driver App
npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp > mobile-app-nextjs/src/types/database.ts
```

### 4. Query Keys
- Include ALL filter params in `queryKey` arrays for proper cache invalidation

### 5. Real-time
- Always return cleanup with `removeChannel()` in useEffect

---

## DATA FETCHING PATTERNS

### Standard Query
```typescript
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const { data = [], isLoading } = useQuery({
  queryKey: ["vehicles", filters],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq("active", true);
    if (error) throw error;
    return data;
  },
});
```

### Mutation
```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const mutation = useMutation({
  mutationFn: async (newData) => {
    const { data, error } = await supabase
      .from("table")
      .insert([newData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["table"] });
    toast({ title: "Success" });
  },
  onError: (error) => {
    toast({ title: "Error", description: error.message, variant: "destructive" });
  },
});
```

### Real-time Subscription
```typescript
useEffect(() => {
  const channel = supabase
    .channel("changes")
    .on("postgres_changes", 
      { event: "*", schema: "public", table: "table_name" },
      () => queryClient.invalidateQueries({ queryKey: ["table_name"] })
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}, []);
```

---

## TOAST NOTIFICATIONS

```typescript
// PREFER THIS (shadcn toast)
import { useToast } from "@/hooks/use-toast";
const { toast } = useToast();
toast({ title: "Success", description: "Action completed" });
toast({ title: "Error", description: "...", variant: "destructive" });

// Sonner (legacy in some components)
import { toast } from "sonner";
```

---

## LAYOUT COMPONENTS

| App | Layout Component | Import Path |
|-----|-----------------|-------------|
| Dashboard | `Layout` | `@/components/Layout` |
| Workshop | `WorkshopMobileLayout` | `@/components/mobile/WorkshopMobileLayout` |
| Driver | `MobileShell` | `@/components/layout/mobile-shell` |

---

## STYLING

```typescript
import { cn } from "@/lib/utils";

<div className={cn("base", condition && "conditional")} />
```

---

## KEY FILES

| File | Purpose |
|------|---------|
| `src/contexts/AuthContext.tsx` | Session management |
| `src/integrations/supabase/client.ts` | Supabase client |
| `src/integrations/supabase/types.ts` | DB types (regenerate after migrations) |
| `PHASE_1_COMPLETION_SUMMARY.md` | Inventory implementation |
| `PHASE_2_QUICK_START.md` | Quick start guide |
| `REALTIME_USAGE.md` | Subscription patterns |
| `src/constants/fleetTyreConfig.ts` | Tyre layouts |

---

## DIRECTORY STRUCTURE

### Dashboard (`src/`)
```
src/
├── components/
│   ├── dialogs/          # Modal dialogs
│   ├── ui/               # shadcn primitives - DON'T EDIT
│   ├── [feature]/        # tyres/, inspections/, etc.
│   └── [Feature].tsx     # Top-level components
├── pages/                 # Route pages (wrap in <Layout>)
├── hooks/                 # Custom hooks
├── contexts/              # React Context
├── integrations/supabase/ # Client + types
├── constants/             # Static configs
├── types/                 # TS interfaces
├── utils/                 # Helpers
└── lib/                   # Shared utilities
```

### Workshop Mobile (`mobile/src/`)
```
mobile/src/
├── components/
│   ├── dialogs/
│   ├── mobile/           # WorkshopMobileLayout
│   └── ui/               # shadcn primitives
├── pages/                 # Auth, Inspections, TyreManagement
├── hooks/
├── contexts/
└── integrations/supabase/
```

### Driver App (`mobile-app-nextjs/src/`)
```
mobile-app-nextjs/src/
├── app/                   # Next.js App Router
│   ├── diesel/
│   ├── expenses/
│   ├── login/
│   ├── profile/
│   └── trip/
├── components/
│   ├── layout/           # MobileShell
│   └── ui/               # shadcn primitives
├── lib/supabase/
│   ├── client.ts
│   ├── middleware.ts
│   └── server.ts
└── types/
```

---

## DEVELOPMENT COMMANDS

| Action | Command |
|--------|---------|
| Run Dashboard | `npm run dev` |
| Run Workshop | `cd mobile && npm run dev` |
| Run Driver | `cd mobile-app-nextjs && npm run dev` |
| Build (all) | `npm run build` in each dir |

---

## PHASE 1 INVENTORY (Oct 2025)

**RPC Functions** (prefixed with `p_`):
- `check_inventory_availability`
- `reserve_inventory`
- `deduct_inventory`
- `release_inventory_reservation`

**Workflow**: Request → Reserve → Approve → Deduct

**Components**: `InventorySearchDialog.tsx`, `EnhancedRequestPartsDialog.tsx`

---

## QR CODE SYSTEM

| Type | Encodes | Components |
|------|---------|------------|
| Vehicle | Fleet + registration | `TyreQRCodeSystem.tsx` |
| Tyre | TIN | `PositionQRScanner.tsx` |
| Position | Vehicle + position | `PositionQRScanner.tsx` |

---

## COMMON GOTCHAS

1. **Imports**: Always `@/` - never relative
2. **UI components**: Never edit `components/ui/` directly
3. **Query keys**: Include ALL filter params
4. **RLS**: Queries may fail silently if policies don't match auth
5. **Toast**: Prefer `useToast` from `@/hooks/use-toast`
6. **Real-time**: Always clean up subscriptions
7. **Types**: Regenerate AFTER every migration
8. **RPC params**: Prefix with `p_` (e.g., `p_inventory_id`)

---

## MIGRATION WORKFLOW

1. Create migration in `supabase/migrations/`
2. Apply via Supabase
3. Regenerate types (see command above)
4. Update components
5. Test RLS policies

---

## QUICK START TEMPLATES

### Dashboard
```typescript
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";

export function Feature() {
  const { toast } = useToast();
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Feature</h1>
      </div>
    </Layout>
  );
}
```

### Workshop Mobile
```typescript
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { WorkshopMobileLayout } from "@/components/mobile/WorkshopMobileLayout";

export function Feature() {
  const { toast } = useToast();
  return (
    <WorkshopMobileLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Feature</h1>
      </div>
    </WorkshopMobileLayout>
  );
}
```

### Driver App
```typescript
"use client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase/client";
import { MobileShell } from "@/components/layout/mobile-shell";

export default function Feature() {
  const { toast } = useToast();
  return (
    <MobileShell>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Feature</h1>
      </div>
    </MobileShell>
  );
}
```
