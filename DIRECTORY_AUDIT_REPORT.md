# Monorepo Directory Audit Report

**Date:** 2026-02-27  
**Monorepo Root:** `C:\Users\wwwhj\Downloads\matanuska-main`  
**Reference:** [`.kilocode/rules/instruction.md`](.kilocode/rules/instruction.md)

---

## Executive Summary

This audit compares the actual directory layout of the Car Craft Co Fleet Management monorepo against the intended architecture defined in the instruction file. **18 categories of issues** were identified across all three applications and the shared infrastructure, ranging from critical root-level pollution (~130+ non-essential files) to cross-app code duplication and naming inconsistencies.

---

## ISSUE 1: Root-Level File Pollution (CRITICAL)

**Severity:** 🔴 Critical  
**Impact:** Developer confusion, slow git operations, unprofessional repository appearance

The instruction file specifies only **3 markdown files** at root level: `PHASE_1_COMPLETION_SUMMARY.md`, `PHASE_2_QUICK_START.md`, and `REALTIME_USAGE.md`. The actual root contains **~130+ non-essential files**.

### Files to Relocate or Delete

#### A. SQL Scripts (~22 files) → Move to `docs/sql/` or `scripts/sql/`
| File | Size | Action |
|------|------|--------|
| `add_test_vendors.sql` | 1KB | Move to `scripts/sql/` |
| `check_candidates.sql` | 272B | Move to `scripts/sql/` |
| `CHECK_GEOFENCE_FUNCTION.sql` | 134B | Move to `scripts/sql/` |
| `check_geofences.sql` | 3KB | Move to `scripts/sql/` |
| `CHECK_LOADS_COORDINATES.sql` | 5KB | Move to `scripts/sql/` |
| `check_tables.sql` | 210B | Move to `scripts/sql/` |
| `CHECK_VEHICLE_MAPPING.sql` | 2KB | Move to `scripts/sql/` |
| `CORRECTED_TYRE_POSITION_DEBUG.sql` | 3KB | Move to `scripts/sql/` |
| `CREATE_MISSING_VEHICLES.sql` | 2KB | Move to `scripts/sql/` |
| `DATABASE_VERIFICATION_TYRE_POSITIONS.sql` | 6KB | Move to `scripts/sql/` |
| `debug_dropdowns.sql` | 19KB | Move to `scripts/sql/` |
| `DEBUG_TYRE_POSITIONS.sql` | 6KB | Move to `scripts/sql/` |
| `external_supabase_migration.sql` | 10KB | Move to `supabase/migrations/` or `scripts/sql/` |
| `FIX_FK_CONSTRAINT.sql` | 3KB | Move to `scripts/sql/` |
| `FIX_GEOFENCE_FUNCTION.sql` | 3KB | Move to `scripts/sql/` |
| `fix_loads_fk_constraint.sql` | 2KB | Move to `scripts/sql/` |
| `fleet_14l_tyres_rows.sql` | 0B | **DELETE** (empty file) |
| `GENERATE_ALL_VEHICLES_TRACKING.sql` | 4KB | Move to `scripts/sql/` |
| `GENERATE_SAMPLE_TRACKING_DATA.sql` | 3KB | Move to `scripts/sql/` |
| `GENERATE_TRACKING_DIRECT.sql` | 4KB | Move to `scripts/sql/` |
| `GENERATE_TRACKING_SIMPLE.sql` | 4KB | Move to `scripts/sql/` |
| `GENERATE_TRACKING_WITH_MAPPING.sql` | 5KB | Move to `scripts/sql/` |
| `PHASE_1_COMPLETE_MIGRATION.sql` | 12KB | Move to `supabase/migrations/` |
| `QUICK_FIX_CALENDAR_FK.sql` | 6KB | Move to `scripts/sql/` |
| `QUICK_GENERATE_TRACKING_DATA.sql` | 2KB | Move to `scripts/sql/` |
| `REGISTRATION_MISMATCH_DIAGNOSTIC.sql` | 3KB | Move to `scripts/sql/` |
| `SYNC_VEHICLE_MAPPING.sql` | 2KB | Move to `scripts/sql/` |
| `TEMPORARY_WORKAROUND.sql` | 604B | Move to `scripts/sql/` |
| `test_workflow_status_updates.sql` | 6KB | Move to `scripts/sql/` |

#### B. Shell Scripts (~15 files) → Move to `scripts/`
| File | Size | Action |
|------|------|--------|
| `apply_calendar_timestamps.sh` | 2KB | Move to `scripts/` |
| `apply_fix.sh` | 703B | Move to `scripts/` |
| `apply_migrations.sh` | 5KB | Move to `scripts/` |
| `apply_new_migrations.sh` | 3KB | Move to `scripts/` |
| `apply_phase1_migrations.sh` | 3KB | Move to `scripts/` |
| `apply_registration_fix.sh` | 2KB | Move to `scripts/` |
| `apply_schema_extension.sh` | 3KB | Move to `scripts/` |
| `apply_vehicle_types_migration.sh` | 2KB | Move to `scripts/` |
| `apply_wialon_vehicles_migration.sh` | 1KB | Move to `scripts/` |
| `apply_workflow_migrations.sh` | 2KB | Move to `scripts/` |
| `code_analysis_summary.sh` | 3KB | Move to `scripts/` |
| `create-js-project.sh` | 1KB | Move to `scripts/` |
| `deploy_calendar_changes.sh` | 1KB | Move to `scripts/` |
| `find_unused_files.sh` | 7KB | Move to `scripts/` |
| `fix_wialon_integration.sh` | 4KB | Move to `scripts/` |
| `search_analysis.sh` | 3KB | Move to `scripts/` |
| `test-wialon-token.sh` | 5KB | Move to `scripts/` |
| `verify_schema.sh` | 4KB | Move to `scripts/` |
| `wialon_api_commands.sh` | 3KB | Move to `scripts/` |
| `wialon_dump_all_unified.sh` | 5KB | Move to `scripts/` |
| `wialon_dump_all.sh` | 4KB | Move to `scripts/` |
| `wialon_fetch_all.sh` | 4KB | Move to `scripts/` |
| `wialon_fetch.sh` | 868B | Move to `scripts/` |

#### C. Documentation Files (~80+ files) → Move to `docs/`
All `.md` files EXCEPT the 3 documented ones + `README.md` + `CHANGELOG.md` should move to `docs/`:

**Keep at root:**
- `README.md`
- `CHANGELOG.md`
- `PHASE_1_COMPLETION_SUMMARY.md`
- `PHASE_2_QUICK_START.md`
- `REALTIME_USAGE.md`

**Move to `docs/`:** All other `.md` files (~75 files), organized into subdirectories:
- `docs/implementation/` — IMPLEMENTATION_*.md, PHASE_*.md, PRODUCTION_*.md
- `docs/guides/` — *_GUIDE.md, *_QUICK_START.md, QUICK_*.md
- `docs/fixes/` — *_FIX.md, *_FIX_GUIDE.md, ERROR_*.md
- `docs/integration/` — *_INTEGRATION*.md, WIALON_*.md
- `docs/features/` — Feature-specific docs (loads, trips, tyres, etc.)
- `docs/analysis/` — CODE_CLEANUP_ANALYSIS*.md, EXPLAIN_*.md, COMPREHENSIVE_*.md
- `docs/archived/` — `MIGRATION_INSTRUCTIONS.md.archived`

#### D. JSON Response Dumps (~5 files) → Move to `scripts/data/` or DELETE
| File | Size | Action |
|------|------|--------|
| `geofences_response.json` | 36B | **DELETE** (near-empty) |
| `login_response.json` | 11KB | Move to `scripts/data/` or **DELETE** (sensitive) |
| `messages_response.json` | 36B | **DELETE** (near-empty) |
| `units_response.json` | 1KB | Move to `scripts/data/` |
| `wialon_response.json` | 13KB | Move to `scripts/data/` |

#### E. Miscellaneous Root Files → Various Actions
| File | Size | Action |
|------|------|--------|
| `comments.txt` | 205KB | **DELETE** or move to `docs/` (massive, likely temp) |
| `1.md` | 10KB | **DELETE** (temp/scratch file) |
| `JobCardPartsTable.tsx.MD` | 11KB | Move to `docs/` (code reference doc) |
| `fleet Tyre possitions.md` | 9KB | Move to `docs/features/` (has spaces in filename!) |
| `Fault Management Table.md` | 5KB | Move to `docs/features/` (has spaces!) |
| `Fault ManagementTable.md` | 30KB | Move to `docs/features/` (has spaces, may be duplicate) |
| `SPare Part.md` | 18KB | Move to `docs/features/` (has spaces, inconsistent case) |
| `FillingStations.md` | 40KB | Move to `docs/features/` |
| `Trip.md` | 143KB | Move to `docs/features/` (massive!) |

---

## ISSUE 2: Undocumented `src/services/` Directory

**Severity:** 🟡 Medium  
**Location:** `src/services/`

Contains a single file: [`advancedRouteTracking.ts`](src/services/advancedRouteTracking.ts). The instruction file does NOT include a `services/` directory in the Dashboard architecture.

### Remediation
**Move** `src/services/advancedRouteTracking.ts` → `src/lib/advancedRouteTracking.ts`  
**Delete** empty `src/services/` directory

---

## ISSUE 3: Undocumented `src/components/forms/` Directory

**Severity:** 🟡 Medium  
**Location:** `src/components/forms/`

Contains a single file: [`TyreConfigForm.tsx`](src/components/forms/TyreConfigForm.tsx). Not documented in the architecture.

### Remediation
**Move** `src/components/forms/TyreConfigForm.tsx` → `src/components/tyres/TyreConfigForm.tsx`  
**Delete** empty `src/components/forms/` directory

---

## ISSUE 4: 32+ Loose Files in `src/components/` Root (CRITICAL)

**Severity:** 🔴 Critical  
**Impact:** Violates feature-based subdirectory organization defined in instruction file

The instruction file defines `src/components/` with feature subdirectories (`admin/`, `analytics/`, `diesel/`, `maintenance/`, `tyres/`, etc.). However, 32+ files sit directly at the root level.

### Remediation — File-by-File Moves

| Current Location | Move To | Rationale |
|-----------------|---------|-----------|
| `src/components/Dashboard.tsx` (60KB) | `src/components/dashboard/Dashboard.tsx` | Create new `dashboard/` feature dir |
| `src/components/Dashboard.css` | `src/components/dashboard/Dashboard.css` | Co-locate with Dashboard.tsx |
| `src/components/JobCardCostSummary.tsx` | `src/components/maintenance/JobCardCostSummary.tsx` | Job card = maintenance |
| `src/components/JobCardFilters.tsx` | `src/components/maintenance/JobCardFilters.tsx` | Job card = maintenance |
| `src/components/JobCardGeneralInfo.tsx` | `src/components/maintenance/JobCardGeneralInfo.tsx` | Job card = maintenance |
| `src/components/JobCardHeader.tsx` | `src/components/maintenance/JobCardHeader.tsx` | Job card = maintenance |
| `src/components/JobCardKanban.tsx` | `src/components/maintenance/JobCardKanban.tsx` | Job card = maintenance |
| `src/components/JobCardLaborTable.tsx` | `src/components/maintenance/JobCardLaborTable.tsx` | Job card = maintenance |
| `src/components/JobCardNotes.tsx` | `src/components/maintenance/JobCardNotes.tsx` | Job card = maintenance |
| `src/components/JobCardPartsTable.tsx` | `src/components/maintenance/JobCardPartsTable.tsx` | Job card = maintenance |
| `src/components/JobCardStats.tsx` | `src/components/maintenance/JobCardStats.tsx` | Job card = maintenance |
| `src/components/JobCardTasksTable.tsx` | `src/components/maintenance/JobCardTasksTable.tsx` | Job card = maintenance |
| `src/components/TyreAnalytics.tsx` | `src/components/tyres/TyreAnalytics.tsx` | Tyre domain |
| `src/components/TyreInspection.tsx` | `src/components/tyres/TyreInspection.tsx` | Tyre domain |
| `src/components/TyreInventory.tsx` | `src/components/tyres/TyreInventory.tsx` | Tyre domain |
| `src/components/TyreManagementSystem.tsx` | `src/components/tyres/TyreManagementSystem.tsx` | Tyre domain |
| `src/components/TyreReports.tsx` | `src/components/tyres/TyreReports.tsx` | Tyre domain |
| `src/components/FuelBunkerManagement.tsx` (95KB) | `src/components/diesel/FuelBunkerManagement.tsx` | Fuel = diesel domain |
| `src/components/FaultTracking.tsx` | `src/components/incidents/FaultTracking.tsx` | Faults = incidents |
| `src/components/DriverBehaviorTable.tsx` | `src/components/driver/DriverBehaviorTable.tsx` | Driver domain |
| `src/components/VehicleInspection.tsx` | `src/components/inspections/VehicleInspection.tsx` | Inspection domain |
| `src/components/VehicleMap.tsx` | `src/components/Vehicle/VehicleMap.tsx` | Vehicle domain |
| `src/components/UnifiedMapView.tsx` (101KB) | `src/components/map/UnifiedMapView.tsx` | Map domain |
| `src/components/UnifiedMapView.css` | `src/components/map/UnifiedMapView.css` | Co-locate with component |
| `src/components/WialonMapView.tsx` | `src/components/wialon/WialonMapView.tsx` | Wialon domain |
| `src/components/WialonTrackingDemo.tsx` | `src/components/wialon/WialonTrackingDemo.tsx` | Wialon domain |
| `src/components/InventoryPanel.tsx` (47KB) | `src/components/inventory/InventoryPanel.tsx` | Inventory domain |
| `src/components/AddTaskForm.tsx` | `src/components/maintenance/AddTaskForm.tsx` | Task management |
| `src/components/TaskCard.tsx` | `src/components/maintenance/TaskCard.tsx` | Task management |
| `src/components/PWAInstallPrompt.tsx` | Keep at root or `src/components/common/` | Cross-cutting concern |
| `src/components/Layout.tsx` | Keep at root or `src/components/layout/` | Layout component |
| `src/components/ProtectedRoute.tsx` | Keep at root or `src/components/auth/` | Auth concern |
| `src/components/ErrorBoundary.tsx` | Keep at root or `src/components/common/` | Cross-cutting concern |

> **Note:** After moving files, ALL imports referencing these components must be updated across the codebase. Use `@/components/maintenance/JobCardHeader` instead of `@/components/JobCardHeader`.

---

## ISSUE 5: 13 Loose Files in `mobile/src/components/` Root

**Severity:** 🔴 Critical  
**Impact:** Same organizational violation as Dashboard

| Current Location | Move To |
|-----------------|---------|
| `mobile/src/components/JobCardGeneralInfo.tsx` | `mobile/src/components/maintenance/JobCardGeneralInfo.tsx` |
| `mobile/src/components/JobCardHeader.tsx` | `mobile/src/components/maintenance/JobCardHeader.tsx` |
| `mobile/src/components/JobCardLaborTable.tsx` | `mobile/src/components/maintenance/JobCardLaborTable.tsx` |
| `mobile/src/components/JobCardNotes.tsx` | `mobile/src/components/maintenance/JobCardNotes.tsx` |
| `mobile/src/components/JobCardPartsTable.tsx` | `mobile/src/components/maintenance/JobCardPartsTable.tsx` |
| `mobile/src/components/JobCardStats.tsx` | `mobile/src/components/maintenance/JobCardStats.tsx` |
| `mobile/src/components/JobCardTasksTable.tsx` | `mobile/src/components/maintenance/JobCardTasksTable.tsx` |
| `mobile/src/components/AddTaskForm.tsx` | `mobile/src/components/maintenance/AddTaskForm.tsx` |
| `mobile/src/components/TyreInspection.tsx` | `mobile/src/components/tyres/TyreInspection.tsx` |
| `mobile/src/components/TyreInventory.tsx` (70KB) | `mobile/src/components/tyres/TyreInventory.tsx` |
| `mobile/src/components/TyreManagementSystem.tsx` | `mobile/src/components/tyres/TyreManagementSystem.tsx` |
| `mobile/src/components/MobilePageLayout.tsx` | `mobile/src/components/mobile/MobilePageLayout.tsx` |
| `mobile/src/components/ProtectedRoute.tsx` | Keep at root or `mobile/src/components/auth/` |

> **Note:** Create `mobile/src/components/maintenance/` directory (currently missing from the documented structure but needed for JobCard components).

---

## ISSUE 6: Naming Convention Inconsistencies in Hooks

**Severity:** 🟡 Medium  
**Impact:** Inconsistent developer experience across apps

### Dashboard (`src/hooks/`) — Mixed conventions
- **kebab-case:** `use-form-field.ts`, `use-mobile.tsx`, `use-toast.ts`
- **camelCase:** `useAddPartForm.ts`, `useDrivers.ts`, `useFleetNumbers.ts`, `useVehicles.ts`, etc.

### Workshop Mobile (`mobile/src/hooks/`) — Mixed conventions
- **kebab-case:** `use-mobile.tsx`, `use-toast.ts`
- **camelCase:** `useAddPartForm.ts`, `useFleetNumbers.ts`, `useVehicles.ts`, etc.

### Mobile Next.js (`mobile-app-nextjs/src/hooks/`) — Consistent kebab-case ✅
- `use-realtime.ts`, `use-toast.ts`

### Remediation
Standardize ALL hook files to **kebab-case** to match the Next.js convention and React ecosystem norms:

**Dashboard renames:**
| Current | Rename To |
|---------|-----------|
| `src/hooks/useAddPartForm.ts` | `src/hooks/use-add-part-form.ts` |
| `src/hooks/useAdvancedTracking.ts` | `src/hooks/use-advanced-tracking.ts` |
| `src/hooks/useCalendarEvents.ts` | `src/hooks/use-calendar-events.ts` |
| `src/hooks/useClients.ts` | `src/hooks/use-clients.ts` |
| `src/hooks/useDieselData.ts` | `src/hooks/use-diesel-data.ts` |
| `src/hooks/useDrivers.ts` | `src/hooks/use-drivers.ts` |
| `src/hooks/useFleetNumbers.ts` | `src/hooks/use-fleet-numbers.ts` |
| `src/hooks/useFleetTyrePositions.ts` | `src/hooks/use-fleet-tyre-positions.ts` |
| `src/hooks/useGeofenceNotifications.ts` | `src/hooks/use-geofence-notifications.ts` |
| `src/hooks/useGeofences.ts` | `src/hooks/use-geofences.ts` |
| `src/hooks/useIncidents.ts` | `src/hooks/use-incidents.ts` |
| `src/hooks/useInventory.ts` | `src/hooks/use-inventory.ts` |
| *(and all remaining camelCase hooks)* | *(converted to kebab-case)* |

**Workshop Mobile renames:** Same pattern for `mobile/src/hooks/` camelCase files.

> **Warning:** This requires updating ALL import statements across the codebase.

---

## ISSUE 7: `Vehicle/` Directory Uses PascalCase

**Severity:** 🟡 Medium  
**Location:** `src/components/Vehicle/`

All other component subdirectories use **lowercase** (`admin/`, `analytics/`, `diesel/`, etc.) but `Vehicle/` uses PascalCase.

### Remediation
**Rename** `src/components/Vehicle/` → `src/components/vehicle/`
Update all imports from `@/components/Vehicle/` → `@/components/vehicle/`

---

## ISSUE 8: Duplicate Supabase Types File

**Severity:** 🟡 Medium  
**Location:** `src/types/supabase.ts` (130KB) vs `src/integrations/supabase/types.ts` (407KB)

The canonical location per the instruction file is `src/integrations/supabase/types.ts`. The `src/types/supabase.ts` file appears to be an **outdated copy** (130KB vs 407KB).

### Remediation
1. Verify no imports reference `@/types/supabase` — search for `from "@/types/supabase"`
2. If no references: **DELETE** `src/types/supabase.ts`
3. If references exist: Update them to point to `@/integrations/supabase/types`

---

## ISSUE 9: Empty File — `src/lib/types.ts`

**Severity:** 🟢 Low  
**Location:** [`src/lib/types.ts`](src/lib/types.ts) — 0 bytes

### Remediation
**DELETE** `src/lib/types.ts`

---

## ISSUE 10: Hook in UI Directory (Workshop Mobile)

**Severity:** 🟡 Medium  
**Location:** [`mobile/src/components/ui/use-toast.ts`](mobile/src/components/ui/use-toast.ts) (82 chars)

A hook file sitting inside the `ui/` directory (which per conventions should ONLY contain shadcn/ui primitives). This is likely a re-export pointing to `mobile/src/hooks/use-toast.ts`.

### Remediation
1. Verify it's a re-export: read file content
2. If it's a re-export: **DELETE** `mobile/src/components/ui/use-toast.ts` and update imports to use `@/hooks/use-toast`
3. If it contains logic: **MOVE** to `mobile/src/hooks/use-toast.ts`

### Also: `mobile/src/components/ui/badge-variants.ts`
This is NOT a shadcn/ui component but a utility. **MOVE** to `mobile/src/lib/badge-variants.ts`.

---

## ISSUE 11: Undocumented `mobile/src/lib/` Directory

**Severity:** 🟡 Medium  
**Location:** `mobile/src/lib/`

The instruction file's Workshop Mobile architecture does NOT include a `lib/` directory. It contains 5 files:
- `button-variants.ts` (1.2KB)
- `formatters.ts` (1.2KB)
- `inspectionPdfExport.ts` (7.4KB)
- `jobCardExport.ts` (16.8KB)
- `utils.ts` (168B)

### Remediation
**Option A (Recommended):** Keep `mobile/src/lib/` but update the instruction file to document it.
**Option B:** Move export utilities to `mobile/src/utils/` since `utils/` IS documented.

---

## ISSUE 12: Massive Cross-App File Duplication (CRITICAL)

**Severity:** 🔴 Critical  
**Impact:** Maintenance nightmare — changes must be made in multiple places

### Identical Files Across Dashboard ↔ Workshop Mobile

| Dashboard File | Workshop File | Size | Match |
|---------------|--------------|------|-------|
| `src/utils/qrValidation.ts` | `mobile/src/utils/qrValidation.ts` | 3.9KB | Exact |
| `src/utils/tyreExport.ts` | `mobile/src/utils/tyreExport.ts` | 24.3KB | Exact |
| `src/lib/formatters.ts` | `mobile/src/lib/formatters.ts` | 1.2KB | Exact |
| `src/lib/button-variants.ts` | `mobile/src/lib/button-variants.ts` | 1.2KB | Exact |
| `src/lib/inspectionPdfExport.ts` | `mobile/src/lib/inspectionPdfExport.ts` | 7.4KB | Exact |
| `src/lib/jobCardExport.ts` | `mobile/src/lib/jobCardExport.ts` | 16.8KB | Exact |
| `src/constants/fleetTyreConfig.ts` | `mobile/src/constants/fleetTyreConfig.ts` | 25.3KB | Exact |
| `src/types/maintenance.ts` | `mobile/src/types/maintenance.ts` | 2.5KB | Exact |
| `src/types/tyre.ts` | `mobile/src/types/tyre.ts` | 4.4KB | Exact |

### Likely Duplicated Components (same names, similar sizes)
| Dashboard | Workshop | Size |
|-----------|----------|------|
| `src/components/AddTaskForm.tsx` | `mobile/src/components/AddTaskForm.tsx` | 5.9KB |
| `src/components/JobCardGeneralInfo.tsx` | `mobile/src/components/JobCardGeneralInfo.tsx` | ~7KB |
| `src/components/JobCardHeader.tsx` | `mobile/src/components/JobCardHeader.tsx` | ~3.5KB |
| `src/components/JobCardLaborTable.tsx` | `mobile/src/components/JobCardLaborTable.tsx` | ~17KB |
| `src/components/JobCardNotes.tsx` | `mobile/src/components/JobCardNotes.tsx` | ~3.4KB |
| `src/components/JobCardPartsTable.tsx` | `mobile/src/components/JobCardPartsTable.tsx` | ~23KB |
| `src/components/JobCardStats.tsx` | `mobile/src/components/JobCardStats.tsx` | ~3.9KB |
| `src/components/JobCardTasksTable.tsx` | `mobile/src/components/JobCardTasksTable.tsx` | ~16KB |
| `src/components/TyreInspection.tsx` | `mobile/src/components/TyreInspection.tsx` | ~27KB |

### Remediation (Long-term)
Create a `shared/` or `packages/shared/` directory at monorepo root:
```
shared/
├── constants/
│   └── fleetTyreConfig.ts
├── types/
│   ├── maintenance.ts
│   └── tyre.ts
├── utils/
│   ├── qrValidation.ts
│   └── tyreExport.ts
└── lib/
    ├── button-variants.ts
    ├── formatters.ts
    ├── inspectionPdfExport.ts
    └── jobCardExport.ts
```

Configure both Dashboard and Workshop to import from `@shared/` via their respective tsconfig/vite alias. This eliminates duplication and ensures single-source-of-truth.

### Remediation (Short-term)
Until a shared package is set up, at minimum:
1. Designate Dashboard as the "source of truth" for shared files
2. Add a script to copy shared files to Workshop on build
3. Document which files are shared in a `SHARED_FILES.md`

---

## ISSUE 13: Supabase Types Size Discrepancy

**Severity:** 🟡 Medium  
**Impact:** Mobile Next.js app may be missing database type definitions

| App | File | Size |
|-----|------|------|
| Dashboard | `src/integrations/supabase/types.ts` | 407KB |
| Workshop | `mobile/src/integrations/supabase/types.ts` | 406KB |
| Mobile Next.js | `mobile-app-nextjs/src/types/database.ts` | **10.7KB** |

The Mobile Next.js types file is **~40x smaller** than the other two, indicating it's severely out of sync.

### Remediation
Regenerate types for ALL apps immediately:
```bash
cd C:\Users\wwwhj\Downloads\matanuska-main
npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp > src/integrations/supabase/types.ts
npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp > mobile/src/integrations/supabase/types.ts
npx supabase gen types typescript --project-id wxvhkljrbcpcgpgdqhsp > mobile-app-nextjs/src/types/database.ts
```

---

## ISSUE 14: Undocumented `supabase/prisma/` Directory

**Severity:** 🟢 Low  
**Location:** `supabase/prisma/schema.prisma` (174 chars)

This project uses Supabase directly, NOT Prisma. This appears to be a leftover artifact.

### Remediation
1. Verify the file is unused (search for `prisma` imports across codebase)
2. **DELETE** `supabase/prisma/` directory

---

## ISSUE 15: `dev-dist/` Build Artifacts in Source Control

**Severity:** 🟡 Medium  
**Location:** `dev-dist/`

Contains service worker build artifacts (`sw.js`, `workbox-*.js` and source maps, ~830KB total). These should be git-ignored, not committed.

### Remediation
1. Add `dev-dist/` to [`.gitignore`](.gitignore)
2. Run `git rm -r --cached dev-dist/` to untrack
3. **DELETE** `dev-dist/` from working directory

---

## ISSUE 16: `lib/` vs `utils/` Unclear Separation of Concerns

**Severity:** 🟡 Medium  
**Location:** `src/lib/` (23 files) and `src/utils/` (12 files)

Both directories contain utility-type files with no clear distinction:
- `src/lib/` has: export utilities, formatters, Supabase admin, Leaflet setup, recurring schedules, report utils, type mappers, customer analytics
- `src/utils/` has: geofencing, driver behavior analysis, fleet utils, PDF generation, geocoding, load status validation, logger, notifications, QR validation, route geometry

### Remediation
Establish a clear convention:
- **`lib/`** = Third-party library wrappers, configuration, and framework-specific utilities (Supabase, Leaflet, etc.)
- **`utils/`** = Pure domain-specific utility functions and helpers

Suggested moves:
| File | Current | Move To | Reason |
|------|---------|---------|--------|
| `src/lib/exportUtils.ts` | `lib/` | `src/utils/` | Domain utility |
| `src/lib/dieselDebriefExport.ts` | `lib/` | `src/utils/` | Domain utility |
| `src/lib/dieselFleetExport.ts` | `lib/` | `src/utils/` | Domain utility |
| `src/lib/dipRecordExport.ts` | `lib/` | `src/utils/` | Domain utility |
| `src/lib/driverBehaviorExport.ts` | `lib/` | `src/utils/` | Domain utility |
| `src/lib/faultExport.ts` | `lib/` | `src/utils/` | Domain utility |
| `src/lib/maintenanceExport.ts` | `lib/` | `src/utils/` | Domain utility |
| `src/lib/recruitmentExport.ts` | `lib/` | `src/utils/` | Domain utility |
| `src/lib/reeferDieselExport.ts` | `lib/` | `src/utils/` | Domain utility |
| `src/lib/reportUtils.ts` | `lib/` | `src/utils/` | Domain utility |
| `src/lib/customerAnalytics.ts` | `lib/` | `src/utils/` | Domain utility |
| `src/lib/loadPlanningUtils.ts` | `lib/` | `src/utils/` | Domain utility |

Keep in `lib/`:
- `utils.ts` (standard shadcn `cn()` utility)
- `supabaseAdmin.ts` (library wrapper)
- `leafletSetup.ts` (library config)
- `button-variants.ts` (UI framework config)
- `formatters.ts` (shared formatting — could go either way)
- `typeMappers.ts` (type transformation — could go either way)
- `maintenanceKmTracking.ts` (domain logic, but keep if tightly coupled to lib)
- `recurringSchedules.ts` (scheduling logic)

---

## ISSUE 17: Undocumented `supabase/functions/` Directory

**Severity:** 🟢 Low (not a code issue, just a documentation gap)  
**Location:** `supabase/functions/` — 11 edge functions

The instruction file only documents `supabase/migrations/` but the directory also contains 11 Supabase Edge Functions:
- `assign-load/`
- `get-wialon-token/`
- `import-driver-behavior-webhook/`
- `import-trips-from-webhook/`
- `maintenance-scheduler/`
- `quick-task/`
- `send-maintenance-notification/`
- `sync-google-sheets/`
- `trip-reports-api/`
- `wialon-alerts/`
- `wialon-proxy/`

### Remediation
Update the instruction file to document `supabase/functions/` in the architecture diagram.

---

## ISSUE 18: CSS Files Mixed with Components

**Severity:** 🟢 Low  
**Location:** `src/components/Dashboard.css`, `src/components/UnifiedMapView.css`, `src/App.css`

The project uses Tailwind CSS per convention but these files contain traditional CSS.

### Remediation
When moving `Dashboard.tsx` and `UnifiedMapView.tsx` to their feature directories (Issue 4), co-locate the CSS files. Long-term, migrate these to Tailwind utility classes.

---

## Step-by-Step Remediation Plan

### Phase 1: Zero-Risk Cleanup (No import changes needed)
1. Delete empty files: `fleet_14l_tyres_rows.sql`, `src/lib/types.ts`
2. Delete temp files: `1.md`, `comments.txt` (verify not needed)
3. Delete near-empty JSON files: `geofences_response.json`, `messages_response.json`
4. Delete `login_response.json` (sensitive data)
5. Add `dev-dist/` to `.gitignore`, remove from tracking
6. Delete `supabase/prisma/` directory

### Phase 2: Root-Level Organization (No import changes needed)
1. Create `docs/` directory structure: `docs/implementation/`, `docs/guides/`, `docs/fixes/`, `docs/integration/`, `docs/features/`, `docs/analysis/`, `docs/archived/`
2. Move all non-essential `.md` files to `docs/` subdirectories
3. Create `scripts/sql/` directory
4. Move all root-level `.sql` files to `scripts/sql/`
5. Move all root-level `.sh` files to `scripts/`
6. Move JSON response files to `scripts/data/`

### Phase 3: Supabase Types Sync
1. Regenerate types for all 3 apps using the documented command
2. Delete `src/types/supabase.ts` after verifying no imports reference it

### Phase 4: Component Reorganization (Requires import updates)
1. Dashboard: Move all 32+ loose `src/components/*.tsx` files to feature subdirectories (see Issue 4 table)
2. Workshop: Move all 13 loose `mobile/src/components/*.tsx` files to feature subdirectories (see Issue 5 table)
3. Delete `src/components/forms/` after moving `TyreConfigForm.tsx` to `tyres/`
4. Delete `src/services/` after moving `advancedRouteTracking.ts` to `lib/`
5. Rename `src/components/Vehicle/` → `src/components/vehicle/`
6. Move `mobile/src/components/ui/use-toast.ts` to `mobile/src/hooks/` or delete if re-export
7. Move `mobile/src/components/ui/badge-variants.ts` to `mobile/src/lib/`
8. Update ALL import paths across both apps

### Phase 5: Naming Standardization
1. Rename all camelCase hook files to kebab-case in Dashboard and Workshop
2. Update all import paths referencing renamed hooks

### Phase 6: Code Deduplication (Long-term)
1. Create `shared/` package directory structure
2. Move identical files (types, constants, utils, lib) to `shared/`
3. Configure tsconfig/vite aliases for `@shared/`
4. Update imports across Dashboard and Workshop
5. Set up a build/copy script as interim solution

### Phase 7: Documentation Update
1. Update instruction file to reflect new structure
2. Document `supabase/functions/` in architecture
3. Document `mobile/src/lib/` in Workshop architecture
4. Create `SHARED_FILES.md` documenting cross-app shared resources

---

## Risk Assessment

| Phase | Risk Level | Estimated Effort | Breaking Change? |
|-------|-----------|-----------------|------------------|
| Phase 1 | 🟢 None | 15 min | No |
| Phase 2 | 🟢 None | 30 min | No |
| Phase 3 | 🟡 Low | 15 min | Possible if types.ts imports differ |
| Phase 4 | 🔴 High | 2-4 hours | Yes — all moved file imports must update |
| Phase 5 | 🔴 High | 1-2 hours | Yes — all renamed hook imports must update |
| Phase 6 | 🔴 High | 4-8 hours | Yes — new shared package setup |
| Phase 7 | 🟢 None | 30 min | No |

**Total estimated effort:** 8-16 hours for complete remediation.

---

## Files Summary

| Category | Count | Action |
|----------|-------|--------|
| Root SQL files to move | ~28 | → `scripts/sql/` |
| Root shell scripts to move | ~23 | → `scripts/` |
| Root docs to move | ~75 | → `docs/` |
| Root files to delete | ~8 | Empty/temp/sensitive |
| Dashboard loose components to move | 32+ | → feature subdirectories |
| Workshop loose components to move | 13 | → feature subdirectories |
| Cross-app duplicate files | 18+ | → future `shared/` package |
| Hook files to rename | ~40 | camelCase → kebab-case |
| Directories to delete | 3 | `src/services/`, `src/components/forms/`, `supabase/prisma/` |
| Directories to rename | 1 | `Vehicle/` → `vehicle/` |
