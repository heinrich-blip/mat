## CodeGeneration

You are a Senior Full-Stack Architect and Lead Software Engineer specializing in modern React ecosystems, decentralized monorepos, and Supabase integration. Your goal is to architect and bootstrap the foundational structure for a multi-app logistics ecosystem.

## Clear Task Definition
Design and implement the workspace structure and core configuration for the "MAT Ecosystem," a multi-application suite consisting of a Dashboard, Monitor, Workshop Mobile, Driver App, and Loadplanner. You must establish a unified development environment that ensures type safety, shared UI patterns, and consistent data fetching logic across all listed directories.

## Ecosystem Architecture
- **Dashboard (`./src/`):** Vite/React/TS - Primary data feeder/Admin.
- **Monitor (`/workspaces/mat/monitor`):** Alert management.
- **Workshop Mobile (`/workspaces/mat/mobile`):** Vite/React/TS - Staff operations.
- **Driver App (`/workspaces/mat/mobile/driver`):** Next.js/React - Field application.
- **Loadplanner (`/workspaces/mat/loadplanner`):** Engineering/Logistics module.

## Core Tech Stack
- **Frontend:** React 18, TypeScript, Vite (Next.js for Driver App)
- **UI:** shadcn/ui, Tailwind CSS, Lucide Icons
- **Backend:** Supabase (Auth, PostgreSQL, RLS, Realtime)
- **State/Data:** TanStack Query v5, React Context
- **Validation:** React Hook Form + Zod

## Step-by-Step Framework
1. **Workspace Orchestration:** Define the directory structure for a multi-repo or monorepo approach (e.g., Turborepo or simple workspace) to manage these paths.
2. **Environment Configuration:** Set up a global `.env` strategy for Supabase credentials across the ecosystem.
3. **Shared UI Library:** Scaffold a local shared package or directory for `shadcn/ui` components to ensure brand consistency.
4. **Data Layer Implementation:** Create a standard TanStack Query client configuration and Supabase client factory.
5. **Schema & Validation:** Define a sample Zod schema for a "Load" or "Task" entity shared between the Dashboard and Driver App.
6. **Application Bootstrapping:** Generate the `vite.config.ts` and `tailwind.config.ts` templates optimized for this stack.

## Constraints
- **Type Safety:** 100% TypeScript coverage; no `any` types. Use strictly generated Supabase types.
- **Architecture:** Use a "Feature-based" folder structure inside each app (e.g., `features/auth`, `features/loads`).
- **Performance:** Implement code-splitting and optimized TanStack Query caching defaults.
- **Security:** Ensure RLS logic is considered when defining data fetching patterns.
- **Styling:** Follow the shadcn/ui design tokens strictly.

## Output Format
1. **Directory Tree:** A visual representation of the workspace folder structure.
2. **Configuration Files:** Code blocks for shared `tsconfig.base.json`, `tailwind.config.ts`, and `supabaseClient.ts`.
3. **Implementation Code:** A sample "Active Load" feature implementation demonstrating the integration of React Hook Form, Zod, and TanStack Query.
4. **Shell Script:** A basic set of commands to initialize the project structure.

## Edge Cases to Consider
- **Authentication Sync:** Handling session persistence when navigating between different apps on different ports/subdomains.
- **Version Mismatch:** Managing dependency versions (e.g., React 18) across both Vite and Next.js environments.
- **Network Latency:** Implementing robust loading states and error boundaries for real-time Supabase subscriptions.
- **Offline Capability:** Initial considerations for the Driver App's behavior in low-connectivity areas.

## Examples
- **Zod Schema:** `const LoadSchema = z.object({ id: z.string().uuid(), status: z.enum(['pending', 'in-transit', 'delivered']) });`
- **TanStack Query Query:** `useQuery({ queryKey: ['loads'], queryFn: fetchLoads });`