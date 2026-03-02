---
paths:
  - "**"
---

# Car Craft Co Fleet Management Monorepo

Three-app monorepo sharing Supabase backend:
- **Dashboard** (`src/`): Back-office (Vite + React + TS)
- **Workshop Mobile** (`mobile/src/`): Workshop staff (Vite + React + TS)  
- **Driver App** (`mobile-app-nextjs/src/`): Drivers (Next.js + React)

**Stack:** shadcn/ui, Tailwind, Supabase, TanStack Query v5, React Context, react-hook-form, zod

## Critical Rules

### 1. Imports & Aliases
- **Always `@/`** — never `../../`
- **Dashboard/Workshop:** `supabase` from `@/integrations/supabase/client`
- **Driver App:** `supabase` from `@/lib/supabase/client`

### 2. Type Regeneration (ALL 3 APPS)
After every migration:
```bash
npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp > src/integrations/supabase/types.ts
npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp > mobile/src/integrations/supabase/types.ts
npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp > mobile-app-nextjs/src/types/database.ts
```

### 3. Never Edit `components/ui/`
Regenerate with shadcn CLI only.

### 4. Real-time Cleanup Required
```typescript
const channel = supabase.channel('x').subscribe();
return () => { supabase.removeChannel(channel); };
```

### 5. Toast by App
- **Dashboard/Workshop:** `useToast` from `@/hooks/use-toast`
- **Driver:** `sonner` (`toast.success/error`)

### 6. Layout Imports
- Dashboard: `@/components/Layout`
- Workshop: `@/components/mobile/WorkshopMobileLayout`
- Driver: `@/components/layout/mobile-shell`

### 7. Driver App = "use client"
Required for interactive components in Next.js App Router.

## Data Fetching Pattern

```typescript
const { data } = useQuery({
  queryKey: ["table", filter], // Include ALL filters
  queryFn: async () => {
    const { data, error } = await supabase.from("table").select("*");
    if (error) throw error;
    return data;
  },
});

const mutation = useMutation({
  mutationFn: async (newData) => {
    const { data, error } = await supabase.from("table").insert([newData]).select().single();
    if (error) throw error;
    return data;
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["table"] });
    toast({ title: "Success" });
  },
});
```

## Key File Locations

| Purpose | Dashboard/Workshop | Driver App |
|---------|-------------------|------------|
| Supabase client | `src/integrations/supabase/client.ts` | `src/lib/supabase/client.ts` |
| Types | `src/integrations/supabase/types.ts` | `src/types/database.ts` |
| Auth context | `src/contexts/AuthContext.tsx` | `src/contexts/auth-context.tsx` |
| Toast hook | `src/hooks/use-toast.ts` | `src/hooks/use-toast.ts` |

## Project Structure

```
Dashboard/Workshop:          Driver App (Next.js):
src/                         src/
├── components/              ├── app/                 # Routes (page.tsx)
│   ├── ui/                  ├── components/
│   ├── dialogs/             │   ├── layout/          # mobile-shell.tsx
│   ├── [feature]/           │   └── ui/
│   └── Layout.tsx           ├── lib/supabase/
├── pages/                   ├── contexts/
├── hooks/                   └── types/
├── contexts/
├── integrations/supabase/
├── constants/
└── lib/
```

## Dev Commands

```bash
npm run dev                        # Dashboard
cd mobile && npm run dev           # Workshop  
cd mobile-app-nextjs && npm run dev # Driver
```

## Common Gotchas

- **RLS enabled** on all tables — empty results = policy mismatch
- **Query keys** must include all filters for proper invalidation
- **Regenerate types** after every migration or face TS errors
- **RPC params** prefix with `p_` (e.g., `p_inventory_id`)
- **QR codes** for tyres/vehicles — see `TyreQRCodeSystem.tsx`
```

