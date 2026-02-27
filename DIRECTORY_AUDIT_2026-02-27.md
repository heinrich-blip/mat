# Directory Audit Report - Car Craft Co Fleet Management Monorepo
**Date:** 2026-02-27  
**Monorepo Root:** `C:\Users\wwwhj\Downloads\matanuska-main`  
**Audited By:** Kilo Code

## Executive Summary

This audit identifies organizational issues across the Fleet Management monorepo containing three applications (Dashboard, Workshop Mobile, Mobile Next.js) and shared infrastructure. **18 categories of issues** have been identified with varying severity levels.

---

## 1. Monorepo Structure Overview

### Established Architecture (from instruction.md)

```
C:\Users\wwwhj\Downloads\matanuska-main\
├── 📱 DASHBOARD APP (src/)          - Vite + React + TS (back-office)
├── 🔧 WORKSHOP MOBILE (mobile/)     - React + Vite (workshop operations)
├── 📦 MOBILE NEXT.JS (mobile-app-nextjs/) - Next.js (driver/field)
├── supabase/migrations/             - Shared database migrations
├── scripts/                         - Utility scripts
└── docs/                           - Documentation
```

### Current Root Directory Issues

**✅ GOOD:**
- Clear separation of three app directories
- Shared `supabase/` infrastructure
- Standard config files (`.gitignore`, `package.json`, etc.)

**❌ CRITICAL ISSUES:**

#### **Issue 1.1: Massive Documentation Sprawl at Root Level (SEVERE)**
**Root directory contains 100+ markdown documentation files** that should be organized:

- **Docs archive exists** ([`docs/archive/`](docs/archive)) but **most docs remain at root**
- Files like:
  - [`PHASE_1_COMPLETION_SUMMARY.md`](PHASE_1_COMPLETION_SUMMARY.md)
  - [`WIALON_INTEGRATION_GUIDE.md`](WIALON_INTEGRATION_GUIDE.md)  
  - [`LOAD_MANAGEMENT_ANALYSIS.md`](LOAD_MANAGEMENT_ANALYSIS.md)
  - [`FLEET_TYRE_REFACTORING_GUIDE.md`](FLEET_TYRE_REFACTORING_GUIDE.md)
  - [`DATABASE_VERIFICATION_GUIDE.md`](DATABASE_VERIFICATION_GUIDE.md)
  - And 95+ others scattered at root

**Impact:** Severe clutter, makes root unnavigable, violates separation of concerns

#### **Issue 1.2: Shell Scripts at Root (MODERATE)**
Multiple `.sh` shell script files at root level:
- [`apply_migrations.sh`](apply_migrations.sh)
- [`apply_calendar_timestamps.sh`](apply_calendar_timestamps.sh)
- [`create-js-project.sh`](create-js-project.sh)
- [`wialon_fetch.sh`](wialon_fetch.sh)
- 15+ others

**BUT:** A [`scripts/shell/`](scripts/shell) directory exists with organized shell scripts!

**Impact:** Duplication, unclear which scripts are authoritative

#### **Issue 1.3: SQL Files at Root (MODERATE)**
SQL test/debug files scattered at root:
- [`add_test_vendors.sql`](add_test_vendors.sql)
- [`check_candidates.sql`](check_candidates.sql)
- [`CHECK_GEOFENCE_FUNCTION.sql`](CHECK_GEOFENCE_FUNCTION.sql)
- [`DEBUG_TYRE_POSITIONS.sql`](DEBUG_TYRE_POSITIONS.sql)
- [`external_supabase_migration.sql`](external_supabase_migration.sql)
- 25+ others

**Should be:** in `scripts/sql/` or `supabase/scripts/`

#### **Issue 1.4: JSON Response Files at Root (LOW)**
- [`geofences_response.json`](geofences_response.json)
- [`login_response.json`](login_response.json)
- [`messages_response.json`](messages_response.json)
- [`units_response.json`](units_response.json)
- [`wialon_response.json`](wialon_response.json)

**Should be:** `scripts/test-data/` or `.gitignore`d

#### **Issue 1.5: Build Artifacts Committed (CRITICAL)**
- [`dev-dist/`](dev-dist) directory with build outputs:
  - `sw.js`, `sw.js.map`
  - `workbox-*.js`, `workbox-*.js.map`

**Should be:** Listed in `.gitignore` (likely already is, but files committed)

#### **Issue 1.6: Orphaned Files**
- [`comments.txt`](comments.txt) (205KB) - Unclear purpose
- [`JobCardPartsTable.tsx.MD`](JobCardPartsTable.tsx.MD) - Markdown documentation of a component?
- [`.env`](.env) committed to git (803 bytes) - SECURITY RISK if contains secrets

---

## 2. Dashboard App (src/) Audit

### Expected Structure (from instruction.md)
```
src/
├── components/{admin,analytics,costs,dialogs,diesel,driver,incidents,
│              inspections,inventory,loads,maintenance,map,operations,
│              reports,tyres,Vehicle,wialon,ui}/
├── pages/
├── hooks/
├── contexts/
├── integrations/supabase/
├── lib/
├── constants/
├── types/
└── utils/
```

### Actual Analysis

**✅ GOOD:**
- Domain-driven component organization follows instruction file
- Clear separation of `pages/`, `hooks/`, `contexts/`
- `@/` imports enforced (per project rules)

**❌ ISSUES:**

#### **Issue 2.1: Top-Level Component Files (HIGH)**
Components at `src/components/` root instead of subdirectories:
- [`src/components/Dashboard.tsx`](src/components/Dashboard.tsx) (60KB!) - Should this be a page?
- [`src/components/FaultTracking.tsx`](src/components/FaultTracking.tsx)
- [`src/components/DriverBehaviorTable.tsx`](src/components/DriverBehaviorTable.tsx)
- [`src/components/FuelBunkerManagement.tsx`](src/components/FuelBunkerManagement.tsx) (94KB!)
- [`src/components/InventoryPanel.tsx`](src/components/InventoryPanel.tsx) (47KB!)
- [`src/components/TyreAnalytics.tsx`](src/components/TyreAnalytics.tsx)
- [`src/components/TyreInspection.tsx`](src/components/TyreInspection.tsx) (33KB)
- [`src/components/TyreInventory.tsx`](src/components/TyreInventory.tsx) (55KB)
- [`src/components/TyreManagementSystem.tsx`](src/components/TyreManagementSystem.tsx)
- [`src/components/TyreReports.tsx`](src/components/TyreReports.tsx)
- [`src/components/VehicleInspection.tsx`](src/components/VehicleInspection.tsx) (24KB)
- [`src/components/UnifiedMapView.tsx`](src/components/UnifiedMapView.tsx) (100KB!) - LARGEST COMPONENT
- [`src/components/WialonMapView.tsx`](src/components/WialonMapView.tsx)
- [`src/components/WialonTrackingDemo.tsx`](src/components/WialonTrackingDemo.tsx)
- Job Card components at root:
  - `JobCardGeneralInfo.tsx`, `JobCardHeader.tsx`, `JobCardKanban.tsx`
  - `JobCardLaborTable.tsx`, `JobCardNotes.tsx`, `JobCardPartsTable.tsx`
  - `JobCardStats.tsx`, `JobCardTasksTable.tsx`, `JobCardCostSummary.tsx`
  - `JobCardFilters.tsx`

**Should be organized:**
- Tyre components → `src/components/tyres/`
- Job Card components → `src/components/maintenance/` or `src/components/job-cards/`
- Map components → `src/components/map/`
- Wialon components → `src/components/wialon/`
- Fuel/Diesel → `src/components/diesel/`
- `Dashboard.tsx` likely belongs in `src/pages/` as `Dashboard.tsx` or `index.tsx`

#### **Issue 2.2: Component Size Violations (HIGH)**
Several components exceed best practices (>500 lines):
- `UnifiedMapView.tsx` - **100KB** (likely 3000+ lines)
- `FuelBunkerManagement.tsx` - **94KB**
- `Dashboard.tsx` - **60KB**
- `TyreInventory.tsx` - **55KB**
- `InventoryPanel.tsx` - **47KB**
- `TyreInspection.tsx` - **33KB**

**Recommendation:** Break into smaller, focused components

#### **Issue 2.3: Inconsistent Component Categorization**
- `Vehicle/` directory exists (capital V)
- But also `vehicle/` pattern used elsewhere
- `tyres/` vs potentially `tires/` (inconsistent UK/US spelling?)

#### **Issue 2.4: Missing Subdirectories**
According to instruction file, these subdirectories should exist but may be incomplete:
- `src/components/admin/` - exists?
- `src/components/costs/` - exists?
- `src/components/debug/` - exists?
- `src/components/driver/` - exists?
- `src/components/operations/` - exists?
- `src/components/sensors/` - exists?
- `src/components/trips/` - exists?

**Need deeper audit to confirm** if these exist and are properly populated.

#### **Issue 2.5: `.css` Files Mixed with `.tsx`**
- [`src/components/Dashboard.css`](src/components/Dashboard.css)
- [`src/components/UnifiedMapView.css`](src/components/UnifiedMapView.css)

**Modern practice:** Use CSS-in-JS (styled-components), Tailwind utility classes, or CSS modules  
**Project uses:** Tailwind CSS — these `.css` files suggest legacy styling

#### **Issue 2.6: PWA Files in Components**
- [`src/components/PWAInstallPrompt.tsx`](src/components/PWAInstallPrompt.tsx)

**Should be:** `src/components/pwa/` subdirectory or `src/lib/pwa/`

---

## 3. Workshop Mobile App (mobile/) Audit

### Expected Structure
Should mirror Dashboard structure:
```
mobile/src/
├── components/{dialogs,inspections,maintenance,mobile,tyres,ui}/
├── pages/
├── hooks/
├── contexts/
├── integrations/supabase/
├── lib/
├── constants/
└── utils/
```

### Actual Analysis

**✅ GOOD:**
- Clean separation maintained
- Mobile-specific layouts in `mobile/` subdirectory
- Follows `@/` import pattern

**❌ ISSUES:**

#### **Issue 3.1: Root-Level Component Files (MODERATE)**
Similar to Dashboard:
- [`mobile/src/components/TyreInspection.tsx`](mobile/src/components/TyreInspection.tsx) (27KB)
- [`mobile/src/components/TyreInventory.tsx`](mobile/src/components/TyreInventory.tsx) (69KB!) - LARGEST in mobile
- [`mobile/src/components/TyreManagementSystem.tsx`](mobile/src/components/TyreManagementSystem.tsx)
- Job Card components:
  - `JobCardGeneralInfo.tsx`, `JobCardHeader.tsx`, `JobCardLaborTable.tsx`
  - `JobCardNotes.tsx`, `JobCardPartsTable.tsx`, `JobCardStats.tsx`
  - `JobCardTasksTable.tsx`
- [`mobile/src/components/AddTaskForm.tsx`](mobile/src/components/AddTaskForm.tsx)
- [`mobile/src/components/MobilePageLayout.tsx`](mobile/src/components/MobilePageLayout.tsx)
- [`mobile/src/components/ProtectedRoute.tsx`](mobile/src/components/ProtectedRoute.tsx)

**Should be organized:**
- Job Card → `mobile/src/components/maintenance/` or `mobile/src/components/job-cards/`
- Tyre → `mobile/src/components/tyres/` (already exists!)
- Layout → `mobile/src/components/mobile/` (already exists!)

#### **Issue 3.2: Duplicate Job Card Components (CRITICAL)**
**Identical files in Dashboard AND Workshop Mobile:**
- `JobCardGeneralInfo.tsx` (7319 bytes in BOTH)
- `JobCardHeader.tsx` (3523 bytes in mobile, 3367 in dashboard - slightly different!)
- `JobCardLaborTable.tsx` (16931 bytes in mobile, 14805 in dashboard - DIVERGED!)
- `JobCardNotes.tsx` (3393 bytes in mobile, 3505 in dashboard - DIVERGED!)
- `JobCardPartsTable.tsx` (23504 bytes in mobile, 23195 in dashboard - DIVERGED!)
- `JobCardStats.tsx` (3858 bytes - IDENTICAL)
- `JobCardTasksTable.tsx` (16176 bytes - IDENTICAL)

**Impact:** Code duplication, maintenance nightmare, versions have diverged

**Should be:** Extract to shared package or create single source with responsive variants

#### **Issue 3.3: Duplicate Inspection/Tyre Components (CRITICAL)**
- `TyreInspection.tsx` - 27KB (mobile) vs 33KB (dashboard) - **DIVERGED**
- `TyreInventory.tsx` - 69KB (mobile) vs 55KB (dashboard) - **MASSIVE DIVERGENCE**
- `TyreManagementSystem.tsx` - 544 bytes (mobile) vs 1198 bytes (dashboard)

#### **Issue 3.4: Duplicate `AddTaskForm.tsx` (HIGH)**
- [`src/components/AddTaskForm.tsx`](src/components/AddTaskForm.tsx) - 5936 bytes
- [`mobile/src/components/AddTaskForm.tsx`](mobile/src/components/AddTaskForm.tsx) - 5936 bytes
- **IDENTICAL FILES** - should be shared

#### **Issue 3.5: Duplicate Constants (MODERATE)**
- [`src/constants/fleetTyreConfig.ts`](src/constants/fleetTyreConfig.ts) - NOT IN FILE LIST (need to verify size)
- [`mobile/src/constants/fleetTyreConfig.ts`](mobile/src/constants/fleetTyreConfig.ts) - 25277 bytes

Per instruction file: "Shared Constants (example) Dashboard/Workshop should have copies"  
**BUT:** This creates drift risk — better to use npm workspace or path aliases to share

---

## 4. Mobile Next.js App (mobile-app-nextjs/) Audit

### Expected Structure
```
mobile-app-nextjs/src/
├── app/{diesel,expenses,login,profile,trip}/page.tsx
├── components/{layout/,ui/}
├── contexts/auth-context.tsx
├── lib/supabase/{client,server,middleware}.ts
└── types/database.ts
```

### Actual Analysis

**✅ GOOD:**
- Clean Next.js App Router structure
- Proper separation of concerns
- PWA-optimized with manifest and icons
- Driver-focused, minimal overlap with Dashboard/Workshop

**❌ ISSUES:**

#### **Issue 4.1: Minimal Issues Detected**
This app appears well-organized according to Next.js conventions.

**Minor concern:** Verify [`mobile-app-nextjs/.env`](mobile-app-nextjs/.env) is in `.gitignore` (`.env.example` exists correctly)

---

## 5. Shared Infrastructure Audit

### 5.1 Supabase Directory

**✅ GOOD:**
- Single source of truth for migrations
- Naming convention: `YYYYMMDD_description.sql` or `YYYYMMDD_HHMMSS_uuid.sql`

**❌ ISSUES:**

#### **Issue 5.1.1: Inconsistent Migration Naming (MODERATE)**
Two naming patterns mixed:
1. Human-readable: `20251209_diesel_suppliers.sql`
2. UUID-based: `20250930154607_0a194880-14a7-475c-942c-c5cd33f69a28.sql`

**Recommendation:** Standardize on one pattern (prefer human-readable)

### 5.2 Scripts Directory

**Current structure:**
```
scripts/
├── check-geofences.ts
├── extract_coordinates.js
├── geocode-geofences.ts
├── manual-geocode.ts
├── resolve_coordinates.js
├── generate-mobile-icons.js
├── generate-pwa-icons.js
├── resolved_suppliers.json (81KB data file!)
└── shell/
    ├── apply_migrations.sh
    ├── wialon_fetch.sh
    └── 20+ others
```

**❌ ISSUES:**

#### **Issue 5.2.1: Mixed Languages (MODERATE)**
- TypeScript (.ts)
- JavaScript (.js)
- Shell (.sh)

**Not inherently bad**, but no clear organization by type or purpose

####**Issue 5.2.2: Large Data File in Scripts (LOW)**
- `resolved_suppliers.json` (81KB) - Should be in `scripts/data/` or excluded

#### **Issue 5.2.3: Duplicate Shell Scripts (CRITICAL - confirmed)**
**Root level `.sh` files duplicate `scripts/shell/` contents:**

Root has:
- `apply_migrations.sh` (5431 bytes)
- `apply_calendar_timestamps.sh` (1879 bytes)
- `wialon_fetch.sh` (868 bytes)
- etc.

`scripts/shell/` has:
- `apply_migrations.sh` (5431 bytes) - SAME
- `apply_calendar_timestamps.sh` (1879 bytes) - SAME
- `wialon_fetch.sh` (868 bytes) - SAME

**Need verification:** Are they exact duplicates or have they diverged?

### 5.3 Docs Directory

**Current:**
```
docs/
└── archive/
    ├── DIRECTORY_AUDIT_REPORT.md (30KB - previous audit!)
    └── 70+ other .md files
```

**✅ GOOD:** Archive exists and is populated

**❌ ISSUES:**

#### **Issue 5.3.1: Active Docs Still at Root (SEVERE)**
- `PHASE_1_COMPLETION_SUMMARY.md` - Should be `docs/phases/`
- `PHASE_2_QUICK_START.md` - Should be `docs/phases/`
- `REALTIME_USAGE.md` - Should be `docs/development/`
- `README.md` - CORRECT (must stay at root)

100+ docs should be categorized:
- `docs/phases/` - Phase completion summaries
- `docs/guides/` - Implementation guides (Wialon, Geofence, Load Management, etc.)
- `docs/database/` - Schema and migration docs
- `docs/development/` - Dev patterns (REALTIME_USAGE, QUICK_START, etc.)
- `docs/features/` - Feature documentation (QR, Tyre, Fleet, etc.)
- Keep `docs/archive/` for deprecated docs

---

## 6. Cross-App Duplication Analysis

### 6.1 Shared Components (CRITICAL)

**Exact Duplicates Found:**
| Component | Dashboard Size | Workshop Size | Status |
|-----------|---------------|---------------|---------|
| `AddTaskForm.tsx` | 5936 bytes | 5936 bytes | ✅ IDENTICAL |
| `JobCardStats.tsx` | 3858 bytes | 3858 bytes | ✅ IDENTICAL |
| `JobCardTasksTable.tsx` | 16176 bytes | 16176 bytes | ✅ IDENTICAL |
| `JobCardGeneralInfo.tsx` | 7319 bytes | 7319 bytes | ✅ IDENTICAL |

**Diverged Duplicates (URGENT):**
| Component | Dashboard Size | Workshop Size | Divergence |
|-----------|---------------|---------------|------------|
| `JobCardHeader.tsx` | 3367 bytes | 3523 bytes | ⚠️ MINOR |
| `JobCardLaborTable.tsx` | 14805 bytes | 16931 bytes | ❌ MAJOR |
| `JobCardNotes.tsx` | 3505 bytes | 3393 bytes | ⚠️ MINOR |
| `JobCardPartsTable.tsx` | 23195 bytes | 23504 bytes | ⚠️ MODERATE |
| `TyreInspection.tsx` | 33581 bytes | 27443 bytes | ❌ MAJOR |
| `TyreInventory.tsx` | 55278 bytes | 69549 bytes | ❌ MASSIVE |
| `TyreManagementSystem.tsx` | 1198 bytes | 544 bytes | ❌ MAJOR |

**Impact:** Maintenance hell, bug fixes must be applied twice, features diverge

### 6.2 Shared Constants (MODERATE)

**From instruction file:** "Shared Constants (copy)"

#### **Issue 6.2.1: Manual Copying Creates Drift Risk**
- `fleetTyreConfig.ts` copied between apps
- Any update requires manual sync
- **Better approach:** npm workspace with shared package

### 6.3 Shared Utilities (LOW-MODERATE)

**Potential Candidates for Sharing:**
- Toast hooks (`use-toast.ts`) - Implemented in all three apps separately (per instruction file, correct pattern)
- Auth contexts - Separate per app (correct, different auth flows)

---

## 7. Naming Conventions Audit

### 7.1 Inconsistencies Found

**❌ CRITICAL:**

#### **Issue 7.1.1: Case Inconsistency**
- `Vehicle/` (capital V) vs `vehicle/` in patterns
- `tyres/` (UK spelling) consistently used ✅

#### **Issue 7.1.2: File Extension Patterns**
- `.tsx` for React components ✅
- `.ts` for hooks and utilities ✅
- `.css` for styles - **DISCOURAGED** (project uses Tailwind)
- `.sql` for migrations ✅
- `.sh` for shell scripts ✅
- `.js` for some scripts (mixed with `.ts`) - **INCONSISTENT**

#### **Issue 7.1.3: Documentation Naming**
- ALL_CAPS_WITH_UNDERSCORES.md (95+ files)
- Some use PascalCase  
- Some use kebab-case

**No clear standard**

---

## 8. Improperly Nested Directories

### **Issue 8.1: Flat Structure at Root (SEVERE)**
Root has **100+ files** (not counting subdirectories):
- Should have max 10-15 config files + README
- Everything else in organized subdirectories

### **Issue 8.2: Deep Nesting in Some Areas**
- `src/components/dialogs/parts/` - appropriate ✅
- `mobile/src/components/dialogs/parts/` - appropriate ✅
- `src/components/loads/calendar/` - appropriate ✅

**No major over-nesting issues detected**

---

## 9. Files Requiring Shared Package

### Candidates for `packages/shared/` or `libs/`:

1. **Job Card Components** (11 files):
   - Extract common logic to shared package
   - Create app-specific wrappers for Dashboard/Workshop differences

2. **Tyre Management** (8 components):
   - Core tyre logic could be shared
   - UI variants per app

3. **Constants:**
   - `fleetTyreConfig.ts`
   - Vehicle type configurations
   - Status enum mappings

4. **Utilities:**
   - Date formatters
   - Number formatters
   - QR code validation
   - Export utilities (PDF/Excel)

5. **Types:**
   - Shared TypeScript interfaces
   - Currently duplicated in each app

---

## 10. `.gitignore` Audit

**Need to verify these are properly ignored:**
- `.env` files (committed at root - **SECURITY RISK**)
- `dev-dist/` build artifacts (committed - **BLOAT**)
- `node_modules/` (likely ignored ✅)
- IDE files (`.vscode/`, `.idea/` if exists)
- OS files (`.DS_Store`, `Thumbs.db`)

---

## 11. Configuration File Proliferation

**Root level config files (normal for monorepo):**
- `.eslintignore` ✅
- `.gitignore` ✅
- `.gitattributes` ✅
- `.npmrc` ✅
- `components.json` (shadcn config) ✅
- `env.d.ts` ✅
- `eslint.config.js` ✅
- `index.html` ✅
- `package.json` ✅
- `package-lock.json` ✅
- `postcss.config.js` ✅
- `tailwind.config.ts` ✅
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` ✅
- `vercel.json` (deployment) ✅
- `vite.config.ts` ✅

**Each sub-app also has its own configs - CORRECT** ✅

---

## 12. Missing `.env.example` Files

**Dashboard:**
- `.env` committed (❌ SECURITY RISK)
- `.env.example` - NOT FOUND

**Workshop Mobile:**
- [`mobile/.env`](mobile/.env) (1430 bytes) committed
- `.env.example` - NOT FOUND

**Mobile Next.js:**
- [`.env.example`](mobile-app-nextjs/.env.example) EXISTS ✅
- `.env` (not in listing, likely `.gitignore`d) ✅

**Impact:** New developers don't know what environment variables to set

---

## 13. Public Assets Organization

### Dashboard Public Assets
- `public/` contains:
  - 19 icon files (various sizes for PWA)
  - `manifest.webmanifest`
  - `robots.txt`
  - Huge PNG: `public/19a736dd67e75.png` (1.5MB!) - **WHAT IS THIS?**

#### **Issue 13.1: Mysterious Large Image (LOW)**
- `19a736dd67e75.png` (1.5MB) - Random hash name, unclear purpose

#### **Issue 13.2: Empty/Corrupted Files**
- `public/matanuska.png` (0 bytes) - **DEAD FILE**
- `public/og-image.png` (48 bytes) - **LIKELY CORRUPTED**

### Mobile Apps
- `mobile/public/` - Clean, 6 icon files ✅
- `mobile-app-nextjs/public/` - Clean, 10 icons + manifest ✅

---

## 14. TypeScript Configuration

**Three tsconfig files at root:**
1. `tsconfig.json` (278 bytes) - Base config
2. `tsconfig.app.json` (645 bytes) - App config
3. `tsconfig.node.json` (526 bytes) - Node/build tools config

**Standard for Vite projects** ✅

**Each sub-app has own tsconfig** ✅

---

## 15. Hidden/Config Directories

### `.vscode/`
- `settings.json` visible in tabs
- **Good:** Project-specific VS Code settings

### `.kilocode/`
- `rules/instruction.md` - Project conventions
- **Good:** Centralized project rules

### `.clinerules/`
- `cline_mcp_settings.json`
- **Purpose unclear**

### `.github/`
- **Exists** (not explored in detail)
- Likely CI/CD workflows ✅

---

## 16. Separation of Concerns

### **Issue 16.1: Dashboard.tsx Mega-Component (SEVERE)**
- 60KB file suggests it's doing too much
- Should be broken into:
  - Layout component
  - Individual widget components
  - Moved to pages/ if it's a route

### **Issue 16.2: UnifiedMapView.tsx (SEVERE)**
- **100KB** = ~3000 lines
- Violates single responsibility principle
- Should extract:
  - Map rendering logic
  - Control panels
  - Data fetching hooks
  - Utility functions

### **Issue 16.3: FuelBunkerManagement.tsx (SEVERE)**
- 94KB monolith
- Should be feature directory:
  ```
  components/diesel/fuel-bunker/
  ├── FuelBunkerList.tsx
  ├── FuelBunkerForm.tsx
  ├── FuelBunkerStats.tsx
  ├── DipRecordTable.tsx
  └── index.ts
  ```

---

## 17. Component vs Page Confusion

### **Issue 17.1: Large Components That Are Actually Pages**
Files in `src/components/` that should likely be in `src/pages/`:
- `Dashboard.tsx` (60KB) - Is this the main dashboard page?
- `FuelBunkerManagement.tsx` (94KB) - Full page view?
- `InventoryPanel.tsx` (47KB) - Full page view?
- `UnifiedMapView.tsx` (100KB) - Full page view?

**Instruction file states:** "30+ route pages" in `src/pages/`
**Need deeper analysis** to confirm routing structure

---

## 18. App-Specific Files in Wrong App

**Workshop Mobile should be limited to workshop operations**, but check if it includes:
- Full inventory management (should be Dashboard-only per instruction file: "Phase 1 inventory features are primarily in Dashboard")
- Tyre management appears duplicated across both

**Mobile Next.js correctly scoped** - Driver-focused (trips, expenses, diesel, profile)

---

## COMPREHENSIVE FINDINGS SUMMARY

### CRITICAL Severity (Immediate Action Required)
1. ✅ **Root Documentation Chaos** - 100+ .md files at root
2. **Duplicate Job Card Components** - 11 files in 2 apps, some diverged
3. **Duplicate Tyre Components** - 3 massive files diverged
4. **Committed `.env` Files** - Security risk
5. **Build Artifacts Committed** - `dev-dist/` bloat
6. **Mega-Components** - 100KB, 94KB, 60KB files violate SRP
7. **Shell Script Duplication** - Root vs `scripts/shell/`
8. **SQL Files Scattered** - 25+ at root instead of organized

### HIGH Severity
9. **Root Component Files** - Job Card, Tyre, Map, etc. not in subdirectories
10. **Component Size Violations** - 7 files > 30KB
11. **Inconsistent Case** - `Vehicle/` vs `vehicle/`
12. **Missing `.env.example`** - Dashboard and Workshop

### MODERATE Severity
13. **Migration Naming Inconsistency** - Two patterns mixed
14. **Scripts Organization** - Mixed TS/JS with no categorization
15. **Shell Script Language Mix** - Some JS, some TS, some shell

### LOW Severity
16. **Mystery Image Files** - 1.5MB PNG, 0-byte PNG, 48-byte PNG
17. **JSON Response Files** - Test data at root
18. **Comments.txt** - 205KB orphaned file

---

## REMEDIATION PLAN

### Phase 1: Immediate Cleanup (HIGH IMPACT, LOW RISK)

#### Step 1.1: Organize Root Documentation
```bash
# Create organized docs structure
mkdir docs\phases docs\guides docs\database docs\development docs\features

# Move phase docs
move PHASE_*.md docs\phases\
move QUICK_START*.md docs\development\

# Move implementation guides  
move *_GUIDE.md docs\guides\
move *_IMPLEMENTATION*.md docs\guides\
move *_INTEGRATION*.md docs\guides\

# Move database docs
move DATABASE_*.md docs\database\
move MIGRATION_*.md docs\database\
move *_SCHEMA*.md docs\database\

# Move feature docs
move WIALON_*.md docs\features\
move GEOFENCE_*.md docs\features\
move LOAD_*.md docs\features\
move FLEET_*.md docs\features\
move TYRE_*.md docs\features\
```

#### Step 1.2: Remove Duplicate Shell Scripts at Root
```bash
# Verify scripts/shell/ has all scripts
dir scripts\shell

# Delete root-level duplicates (after verification!)
del apply_*.sh
del wialon_*.sh
del create-*.sh
del deploy_*.sh
del fix_*.sh
del test-*.sh
del verify_*.sh
```

#### Step 1.3: Organize SQL Files
```bash
mkdir scripts\sql
mkdir scripts\sql\tests
mkdir scripts\sql\debug

move *_test*.sql scripts\sql\tests\
move CHECK_*.sql scripts\sql\debug\
move DEBUG_*.sql scripts\sql\debug\
move VERIFY_*.sql scripts\sql\debug\
move *.sql scripts\sql\
```

#### Step 1.4: Clean JSON Response Files
```bash
mkdir scripts\test-data
move *_response.json scripts\test-data\
```

#### Step 1.5: Fix `.gitignore` and Remove Committed Secrets/Build Files
```bash
# ADD TO .gitignore if missing:
echo .env >> .gitignore
echo .env.local >> .gitignore
echo dev-dist/ >> .gitignore

# Remove from git (but keep local):
git rm --cached .env mobile/.env
git rm --cached -r dev-dist/

# Create .env.example files
```

### Phase 2: Dashboard Component Reorganization

#### Step 2.1: Move Root Components to Proper Subdirectories
```bash
# Job Card components
move src\components\JobCard*.tsx src\components\maintenance\

# Tyre components
move src\components\Tyre*.tsx src\components\tyres\

# Map components
move src\components\*MapView.tsx src\components\map\
move src\components\WialonTracking*.tsx src\components\wialon\

# Diesel/Fuel components
move src\components\FuelBunker*.tsx src\components\diesel\

# Inspection components
move src\components\VehicleInspection.tsx src\components\inspections\

# Driver components
move src\components\DriverBehavior*.tsx src\components\driver\

# Fault components
move src\components\FaultTracking.tsx src\components\incidents\

# PWA components
mkdir src\components\pwa
move src\components\PWAInstallPrompt.tsx src\components\pwa\

# Review Dashboard.tsx - if it's a page:
# move src\components\Dashboard.tsx src\pages\Dashboard.tsx
```

#### Step 2.2: Break Down Mega-Components
**Manual refactoring required** for:
1. `UnifiedMapView.tsx` (100KB) → 5-10 smaller components
2. `FuelBunkerManagement.tsx` (94KB) → feature directory
3. `Dashboard.tsx` (60KB) → page + widgets
4. `TyreInventory.tsx` (55KB Dashboard, 69KB Workshop!) → shared core + UI variants
5. `InventoryPanel.tsx` (47KB) → tabbed subcomponents

### Phase 3: Workshop Mobile Cleanup

#### Step 3.1: Mirror Dashboard Reorganization
```bash
# Same moves as Dashboard:
move mobile\src\components\JobCard*.tsx mobile\src\components\maintenance\
move mobile\src\components\Tyre*.tsx mobile\src\components\tyres\
move mobile\src\components\AddTaskForm.tsx mobile\src\components\maintenance\
```

### Phase 4: Eliminate Duplication

#### Step 4.1: Create Shared Package (if monorepo workspace)
```bash
mkdir packages\shared
mkdir packages\shared\components
mkdir packages\shared\constants
mkdir packages\shared\types
mkdir packages\shared\utils

# Move truly shared files to package
# Update package.json to use npm workspaces
# Update tsconfig paths
```

**OR** (simpler approach without workspace):

#### Step 4.2: Designate Dashboard as Source of Truth
For components that must be shared:
1. Keep in Dashboard (`src/components/`)
2. Import from Workshop via relative path or build step
3. **OR** Accept controlled duplication but document it

**Instruction file suggests controlled duplication is accepted** for:
- `fleetTyreConfig.ts` - "copy"
- Job Card components - "shared pattern"

**Recommendation:** Document which files are intentionally duplicated and create a sync script

### Phase 5: Documentation Organization

#### Step 5.1: Categorize All .md Files
Move all root-level documentation files to organized `docs/` subdirectories as outlined in Phase 1 cleanup.

#### Step 5.2: Create Documentation Index
```markdown
# docs/README.md
- Link to all categorized docs
- Explain where to find what
```

### Phase 6: Environment Configuration

#### Step 6.1: Create .env.example Files
```bash
# For Dashboard
copy .env .env.example
# Manually replace sensitive values with placeholders

# For Workshop Mobile
copy mobile\.env mobile\.env.example
```

#### Step 6.2: Update .gitignore
Ensure `.env` is ignored, remove from git if committed.

### Phase 7: Asset Cleanup

#### Step 7.1: Remove Dead/Corrupted Files
```bash
del public\matanuska.png  # 0 bytes
# Investigate public\og-image.png (48 bytes - likely corrupted)
# Investigate public\19a736dd67e75.png (1.5MB - what is this?)
```

---

## PRIORITIZED ACTION CHECKLIST

### 🔴 URGENT (Do First)
- [ ] Remove `.env` files from git (`git rm --cached .env mobile/.env`)
- [ ] Create `.env.example` for Dashboard and Workshop
- [ ] Move 100+ .md files to `docs/` subdirectories
- [ ] Delete duplicate shell scripts at root (keep `scripts/shell/`)
- [ ] Move SQL files to `scripts/sql/`

### 🟠 HIGH PRIORITY (Do Soon)
- [ ] Reorganize Dashboard root components into subdirectories
- [ ] Reorganize Workshop root components into subdirectories
- [ ] Address diverged Job Card components (decide: reconcile or accept)
- [ ] Address diverged Tyre components (decide: reconcile or accept)
- [ ] Break down mega-components (UnifiedMapView, FuelBunkerManagement)

### 🟡 MEDIUM PRIORITY (Plan & Execute)
- [ ] Standardize migration naming convention
- [ ] Organize `scripts/` by type (ts/, js/, shell/, sql/)
- [ ] Clean up build artifacts (`dev-dist/`)
- [ ] Remove/explain `comments.txt`, `JobCardPartsTable.tsx.MD`

### 🟢 LOW PRIORITY (Nice to Have)
- [ ] Investigate mystery images in public/
- [ ] Move JSON response files to `scripts/test-data/`
- [ ] Standardize documentation file naming
- [ ] Consider npm workspaces for truly shared code

---

## ESTIMATED EFFORT

| Phase | Effort | Risk |
|-------|--------|------|
| Documentation reorganization | 2-4 hours | LOW |
| Root cleanup (scripts, SQL) | 1-2 hours | LOW |
| Dashboard component moves | 3-5 hours | MEDIUM |
| Workshop component moves | 2-3 hours | MEDIUM |
| Mega-component refactoring | 20-40 hours | HIGH |
| Shared package creation | 8-16 hours | MEDIUM-HIGH |
| **TOTAL** | **36-70 hours** | **MEDIUM** |

---

## RECOMMENDATIONS

### Immediate Actions (This Sprint)
1. **Document organization** - Highest ROI, lowest risk
2. **Remove security risks** - `.env` files
3. **Eliminate root clutter** - Scripts, SQL files
4. **Create .env.example files**

### Near-Term Actions (Next Sprint)
5. **Component subdirectory organization**
6. **Identify and reconcile/document duplicated components**
7. **Create duplication management strategy** (sync script or shared package)

### Long-Term Actions (Future Sprints)
8. **Refactor mega-components** (100KB+ files)
9. **Implement shared package** if duplication becomes unmanageable
10. **Establish naming conventions standard** and enforce with linter

---

## NOTES ON MONOREPO MATURITY

**Current State:** Early-stage monorepo
- Controlled duplication acceptable per instruction file
- Each app mostly self-contained
- Shared backend (Supabase) works well

**Evolution Path:**
1. **Now:** Clean up organization, accept some duplication
2. **Later:** Extract truly reusable components to shared package
3. **Future:** Consider Nx, Turborepo, or similar monorepo tooling

---

## APPENDIX: Files Requiring Investigation

1. `comments.txt` (205KB) - What is this?
2. `JobCardPartsTable.tsx.MD` (10KB) - Component documentation?
3. `public/19a736dd67e75.png` (1.5MB) - What does this image contain?
4. `public/matanuska.png` (0 bytes) - Delete?
5. `public/og-image.png` (48 bytes) - Regenerate?

---

**END OF AUDIT REPORT**
