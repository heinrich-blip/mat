---
paths:
  - "**"
---

# Car Craft Co Fleet Management Monorepo

Three frontend apps sharing one Supabase backend:

| App              | Tech stack                  | Purpose              | Main folder              | Dev command                     |
|------------------|-----------------------------|----------------------|--------------------------|---------------------------------|
| Dashboard        | Vite + React + TS           | Back-office          | `src/`                   | `npm run dev`                   |
| Workshop Mobile  | Vite + React + TS           | Workshop staff       | `mobile/src/`            | `cd mobile && npm run dev`      |
| Driver App       | Next.js App Router + React  | Drivers              | `mobile-app-nextjs/src/` | `cd mobile-app-nextjs && npm run dev` |

**Shared stack:** shadcn/ui, Tailwind, Supabase, TanStack Query v5, React Context, react-hook-form + zod

## Quick Rules – Read These First

1. **Imports**  
   Always use `@/` alias — never `../` or `../../`

2. **Supabase client location**

   | App              | Import path                                    |
   |------------------|------------------------------------------------|
   | Dashboard / Workshop | `import { supabase } from "@/integrations/supabase/client"` |
   | Driver           | `import { supabase } from "@/lib/supabase/client"`          |

3. **Regenerate types after every migration** (same command, different output path)

   ```bash
   npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp \
     > src/integrations/supabase/types.ts
   npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp \
     > mobile/src/integrations/supabase/types.ts
   npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp \
     > mobile-app-nextjs/src/types/database.ts

Real-time subscription cleanup (required)TypeScriptconst channel = supabase.channel('…').subscribe()
return () => { supabase.removeChannel(channel) }
ToastsAppHook / FunctionDashboard / WorkshopuseToast from @/hooks/use-toastDrivertoast from sonner
Layout componentsAppImportDashboard@/components/LayoutWorkshop@/components/mobile/WorkshopMobileLayoutDriver@/components/layout/mobile-shell
Driver App only — every interactive file needs "use client" at the top

Recommended Data Flow (TanStack Query + Supabase)
TypeScript// Query
const { data, isLoading } = useQuery({
  queryKey: ["vehicles", { status, search }],   // ← all filters go here!
  queryFn: async () => {
    const { data, error } = await supabase.from("vehicles").select("*")…;
    if (error) throw error;
    return data;
  },
});

// Mutation
const mutation = useMutation({
  mutationFn: (payload) => supabase.from("vehicles").insert(payload).select().single(),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    toast.success("Vehicle added");
  },
});


Common Gotchas

RLS enabled everywhere → empty data usually = policy / auth mismatch
Query keys must contain every filter used (for correct invalidation)
RPC parameters → prefix with p_ (Supabase convention)
Never manually edit components/ui/* — regenerate with npx shadcn@latest add …
QR code logic → see TyreQRCodeSystem.tsx