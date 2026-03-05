# Car Craft Co - Fleet Management

**Root:** `C:\Users\wwwhj\Downloads\matanuska-main`

## Apps
| App | Location | Stack | Purpose |
|-----|----------|-------|---------|
| Dashboard | `./` (src/) | Vite + React + TS | Back-office |
Monitor app which feeds all alerts from main dashboard app 
| Workshop Mobile | `./mobile/` | Vite + React + TS | Workshop staff |
| Driver App | `./mobile-app-nextjs/` | Next.js + React | Drivers/field |

**Shared:** shadcn/ui + Tailwind + Supabase + TanStack Query v5

## Key Patterns

**Imports:** Always `@/` — never `../../`

**Data fetching (Dashboard/Workshop):**
```typescript
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
```

**Data fetching (Driver App):**
```typescript
import { supabase } from "@/lib/supabase/client";
```

**Toast:** `import { useToast } from "@/hooks/use-toast"` in all apps

**Layout components:**
- Dashboard: `@/components/Layout`
- Workshop: `@/components/mobile/WorkshopMobileLayout`
- Driver: `@/components/layout/mobile-shell`

**Routing:** react-router-dom (Dashboard/Workshop) | Next.js App Router (Driver)

## Critical Rules
1. Never edit `components/ui/` — regenerate with shadcn CLI
2. After any DB migration, regenerate types in ALL THREE apps:
```bash
npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp > src/integrations/supabase/types.ts
npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp > mobile/src/integrations/supabase/types.ts
npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp > mobile-app-nextjs/src/types/database.ts
```
3. Real-time subscriptions must return cleanup with `removeChannel`
4. Always include all filter params in `queryKey` arrays

## Dev Commands
```bash
npm run dev                        # Dashboard
cd mobile && npm run dev           # Workshop
cd mobile-app-nextjs && npm run dev  # Driver
```

## src/ Structure (Dashboard — Workshop mirrors this pattern)
```
components/{admin,analytics,costs,dialogs,diesel,driver,
            incidents,inspections,inventory,loads,maintenance,
            map,operations,reports,tyres,Vehicle,wialon,ui}/
pages/  hooks/  contexts/  integrations/supabase/
lib/  constants/  types/  utils/
```

## Driver App (mobile-app-nextjs/src/)
```
app/{diesel,expenses,login,profile,trip}/page.tsx
components/{layout/,ui/}
contexts/auth-context.tsx
lib/supabase/{client,server,middleware}.ts
types/database.ts
```