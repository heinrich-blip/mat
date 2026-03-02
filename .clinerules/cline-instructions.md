
---

```markdown
---
description: Global architectural rules, directory structures, and shared conventions for the Car Craft Co Fleet Management Monorepo.
globs: "**/*.{ts,tsx,js,jsx,json}"
---

# Car Craft Co: Fleet Management Monorepo Rules

You are an expert full-stack developer working on the Car Craft Co Fleet Management Monorepo. This project consists of three frontend applications sharing a single Supabase backend.



## 1. Project Structure & Environment

| Application | Technology Stack | Purpose | Root Directory | Development Command |
| :--- | :--- | :--- | :--- | :--- |
| **Dashboard** | Vite + React + TS | Back-office / Admin | `/` (Project Root) | `npm run dev` |
| **Workshop Mobile** | Vite + React + TS | Workshop Staff | `/mobile` | `cd mobile && npm run dev` |
| **Driver App** | Next.js (App Router) | Drivers | `/mobile-app-nextjs` | `cd mobile-app-nextjs && npm run dev` |

### Shared Stack Requirements
- **Styling:** Tailwind CSS + shadcn/ui.
- **State/Data:** TanStack Query v5 + React Context.
- **Form Validation:** `react-hook-form` + `zod`.
- **Backend:** Supabase (PostgreSQL + RLS + Real-time).

---

## 2. Core Development Rules

### I. Imports and Path Aliasing
- **Absolute Imports:** Always use the `@/` alias for internal imports.
- **Prohibited:** Never use relative paths like `../` or `../../`.
- **Structure:** Ensure the `tsconfig.json` in each sub-directory correctly maps `@/` to the respective `src` folder.

### II. Supabase Client Integration
Each app has a dedicated client instance. Do not mix them.

| App Context | Client Import Path |
| :--- | :--- |
| **Dashboard / Workshop** | `import { supabase } from "@/integrations/supabase/client"` |
| **Driver App (Next.js)** | `import { supabase } from "@/lib/supabase/client"` |

### III. Database Type Safety
Type definitions must be regenerated after any schema migration or RPC change using the Project ID: `wxvhkljrbcpcgpgdqhsp`.

```bash
# Dashboard Types
npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp > src/integrations/supabase/types.ts

# Workshop Types
npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp > mobile/src/integrations/supabase/types.ts

# Driver App Types
npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp > mobile-app-nextjs/src/types/database.ts

```

---

## 3. Implementation Standards

### Real-time Subscriptions (Strict Cleanup)

To prevent memory leaks and duplicate listeners, every `supabase.channel` subscription must include a cleanup phase in a `useEffect` return or component unmount.

```typescript
const channel = supabase.channel('table-db-changes').subscribe();
return () => { 
  supabase.removeChannel(channel); 
};

```

### UI and Feedback

* **Dashboard / Workshop:** Use the `useToast` hook from `@/hooks/use-toast`.
* **Driver App:** Use the `toast` function from the `sonner` library.
* **Next.js Directives:** In the `mobile-app-nextjs` directory, any file using hooks (state, effects, context) **must** include the `"use client"` directive at the very top.

### Layout Reference

| App | Layout Component Path |
| --- | --- |
| **Dashboard** | `@/components/Layout` |
| **Workshop** | `@/components/mobile/WorkshopMobileLayout` |
| **Driver** | `@/components/layout/mobile-shell` |

---

## 4. Data Flow: TanStack Query + Supabase

Follow this pattern for all data fetching and mutations:

### Queries

Ensure all filter variables (status, search, ID) are included in the `queryKey` to trigger automatic refetching on change.

```typescript
const { data, isLoading } = useQuery({
  queryKey: ["vehicles", { status, search }], 
  queryFn: async () => {
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .eq('status', status);
    if (error) throw error;
    return data;
  },
});

```

### Mutations

Always invalidate the relevant cache on success to maintain UI consistency.

```typescript
const mutation = useMutation({
  mutationFn: (payload) => supabase.from("vehicles").insert(payload).select().single(),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    toast.success("Vehicle updated successfully");
  },
});

```

---

## 5. Critical Constraints ("Common Gotchas")

1. **RLS (Row Level Security):** RLS is enabled on all tables. If a query returns an empty array `[]` but data exists in the DB, check the RLS policies and the User's Auth Session.
2. **RPC Parameters:** When calling Postgres Functions via `supabase.rpc()`, ensure parameters are prefixed with `p_` (e.g., `p_vehicle_id`) to match Supabase conventions.
3. **shadcn/ui:** Do not manually edit files inside `components/ui/*`. Use `npx shadcn@latest add [component]` to modify or update UI primitives.

```
