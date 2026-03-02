# Car Craft Co Fleet Management Monorepo Structure

## Overall Monorepo Structure
```
matanuska-main/
|-- CLEANUP_ANALYSIS.md
|-- CLEANUP_QUERY.sql
|-- DIRECTORY_AUDIT_2026-02-27.md
|-- JobCardPartsTable.tsx.MD
|-- PHASE_1_COMPLETION_SUMMARY.md
|-- PHASE_2_QUICK_START.md
|-- README.md
|-- REALTIME_USAGE.md
|-- comments.txt
|-- components.json
|-- dev-dist
|   |-- sw.js
|   |-- sw.js.map
|   |-- workbox-137dedbd.js
|   |-- workbox-137dedbd.js.map
|   |-- workbox-a959eb95.js
|   `-- workbox-a959eb95.js.map
|-- dist
|   |-- 19a736dd67e75.png
|   |-- app-icon.svg
|   |-- apple-touch-icon.png
|   |-- assets
|   |   |-- html2canvas.esm-DXEQVQnt.js
|   |   |-- html2canvas.esm-DXEQVQnt.js.map
|   |   |-- index-ByTzmcI_.js
|   |   |-- index-ByTzmcI_.js.map
|   |   |-- index-tXUoqupF.css
|   |   |-- index.es-Bh_xLgjI.js
|   |   |-- index.es-Bh_xLgjI.js.map
|   |   |-- purify.es-Bzr520pe.js
|   |   |-- purify.es-Bzr520pe.js.map
|   |   |-- react-vendor-C0Dkio3Y.js
|   |   |-- react-vendor-C0Dkio3Y.js.map
|   |   |-- supabase-vendor-DTqiiTOY.js
|   |   |-- supabase-vendor-DTqiiTOY.js.map
|   |   |-- workbox-window.prod.es5-BIl4cyR9.js
|   |   `-- workbox-window.prod.es5-BIl4cyR9.js.map
|   |-- favicon-16.png
|   |-- favicon-32.png
|   |-- favicon.svg
|   |-- icon-128.png
|   |-- icon-144.png
|   |-- icon-152.png
|   |-- icon-192-maskable.png
|   |-- icon-192.png
|   |-- icon-256.png
|   |-- icon-384.png
|   |-- icon-48.png
|   |-- icon-512-maskable.png
|   |-- icon-512.png
|   |-- icon-72.png
|   |-- icon-96.png
|   |-- index.html
|   |-- manifest.webmanifest
|   |-- matanuska.png
|   |-- og-image.png
|   |-- robots.txt
|   |-- sw.js
|   |-- sw.js.map
|   |-- workbox-4b126c97.js
|   `-- workbox-4b126c97.js.map
|-- docs
|   `-- archive
|       |-- 1.md
|       |-- ADVANCED_TRACKING_IMPLEMENTATION_SUMMARY.md
|       |-- ADVANCED_TRACKING_INTEGRATION_GUIDE.md
|       |-- APPLY_MIGRATIONS_IN_ORDER.md
|       |-- APPLY_MIGRATION_NOW.md
|       |-- BULK_IMPORT_ENHANCEMENT.md
|       |-- BULK_IMPORT_USER_GUIDE.md
|       |-- CALENDAR_EVENTS_FK_FIX.md
|       |-- CHANGELOG.md
|       |-- CODE_CLEANUP_ANALYSIS_2025-11-12.md
|       |-- COMPREHENSIVE_CODE_FUNCTIONALITY_EXPLANATION.md
|       |-- COST_ALLOCATION_USD_INTEGRATION.md
|       |-- DATABASE_SCHEMA_CORRECTIONS.md
|       |-- DATABASE_VERIFICATION_GUIDE.md
|       |-- DIRECTORY_AUDIT_REPORT.md
|       |-- DROPDOWN_FIXES_COMPLETE.md
|       |-- ENTERPRISE_INTEGRATION_COMPLETE.md
|       |-- ENTERPRISE_LOAD_MANAGEMENT_IMPLEMENTATION.md
|       |-- ERROR_FIX_SUMMARY.md
|       |-- EXPLAIN_CODE_ANALYSIS.md
|       |-- FLEET_INSPECTION_MISSING_TYRES_FIX.md
|       |-- FLEET_NUMBERS_ALIGNMENT.md
|       |-- FLEET_TYRE_REFACTORING_GUIDE.md
|       |-- FLEET_VEHICLE_ID_INTEGRATION.md
|       |-- FOREIGN_KEY_FIX.md
|       |-- Fault Management Table.md
|       |-- Fault ManagementTable.md
|       |-- FillingStations.md
|       |-- GEOFENCE_AUTO_STATUS_CONFIG.md
|       |-- GEOFENCE_GEOCODING_GUIDE.md
|       |-- GEOFENCE_INTEGRATION_GUIDE.md
|       |-- GEOFENCE_STATUS.md
|       |-- GEOFENCE_USAGE_QUICKSTART.md
|       |-- HOOK_VERIFICATION_GUIDE.md
|       |-- IMPLEMENTATION_COMPLETE_2025-11-12.md
|       |-- IMPLEMENTATION_STATUS.md
|       |-- IMPLEMENTATION_SUMMARY.md
|       |-- INCIDENT_STORAGE_SETUP.md
|       |-- INTEGRATION_EXAMPLE.md
|       |-- INTEGRATION_POINTS_DOCUMENTATION.md
|       |-- INVENTORY_SELECTION_IMPLEMENTATION_GUIDE.md
|       |-- JOB_CARD_COST_ALLOCATION_GUIDE.md
|       |-- LEAFLET_ENHANCEMENTS_IMPLEMENTATION_COMPLETE.md
|       |-- LOAD_CALENDAR_TIMESTAMPS_GUIDE.md
|       |-- LOAD_MANAGEMENT_ANALYSIS.md
|       |-- LOAD_MANAGEMENT_COMPLETE_GUIDE.md
|       |-- LOAD_MANAGEMENT_ENHANCEMENTS.md
|       |-- LOAD_MANAGEMENT_FIXES.md
|       |-- LOAD_MANAGEMENT_POTENTIAL_ENHANCEMENTS.md
|       |-- LOAD_PLANNING_INTEGRATION_GUIDE.md
|       |-- LOAD_PLANNING_QUICK_START.md
|       |-- LOAD_STATUS_AND_CALENDAR_SUMMARY.md
|       |-- LOAD_STATUS_ENUM_MAPPING.md
|       |-- LOAD_STATUS_WORKFLOW.md
|       |-- LOAD_TO_TRIP_MIGRATION_PLAN.md
|       |-- LOAD_TRACKING_FIXES.md
|       |-- LOAD_UI_FIXES_NEEDED.md
|       |-- LOVABLE_CLOUD.md
|       |-- MAP_INTEGRATION_GUIDE.md
|       |-- MIGRATION_STEPS_LOAD_WORKFLOW.md
|       |-- MIGRATION_TRIPS_LOADS_FIX.md
|       |-- MISSING_FLEET_VEHICLES_FIX.md
|       |-- PGRST116_ERROR_FIX.md
|       |-- PHASES_SUMMARY.md
|       |-- PHASE_1_DATABASE_SETUP.md
|       |-- PHASE_1_EXECUTION_GUIDE.md
|       |-- PHASE_2_4_IMPLEMENTATION_GUIDE.md
|       |-- PHASE_2_4_QUICK_START.md
|       |-- PHASE_2_COMPONENT_CREATION.md
|       |-- PHASE_2_RECURRING_SCHEDULES_COMPLETE.md
|       |-- PHASE_3_4_IMPLEMENTATION_GUIDE.md
|       |-- PHASE_3_IMPLEMENTATION_PROGRESS.md
|       |-- PHASE_3_INTEGRATION_TESTING.md
|       |-- PHASE_4_APPROVAL_WORKFLOW.md
|       |-- PHASE_5_DEPLOYMENT_DOCUMENTATION.md
|       |-- PRE_CHANGE_CHECKLIST.md
|       |-- PRODUCTION_IMPLEMENTATION_PLAN.md
|       |-- QR_SYSTEM_DOCUMENTATION.md
|       |-- QUICK_FIX_GUIDE.md
|       |-- QUICK_IMPLEMENTATION_REFERENCE.md
|       |-- QUICK_START_CALENDAR.md
|       |-- QUICK_START_INTEGRATION.md
|       |-- REALTIME_LOAD_UPDATES.md
|       |-- ROAD_ALIGNED_ROUTING_GUIDE.md
|       |-- ROUTE_PLANNING_IMPLEMENTATION.md
|       |-- SAVED_ROUTES_INTEGRATION_GUIDE.md
|       |-- SCHEMA_EXTENSION_GUIDE.md
|       |-- SENSOR_ID_CORRECTION_SUMMARY.md
|       |-- SPare Part.md
|       |-- SUPABASE_REALTIME_SETUP.md
|       |-- SYSTEM_FUNCTIONALITY_EXPLANATION.md
|       |-- TESTING_TRIPS_LOADS.md
|       |-- THIRD_PARTY_INTEGRATION_COMPATIBILITY.md
|       |-- TRACK_VISUALIZATION_USER_GUIDE.md
|       |-- TRIPS_DISAPPEARED_EXPLANATION.md
|       |-- TRIPS_VS_LOADS_INTEGRATION.md
|       |-- TRIP_DROPDOWN_FIX_GUIDE.md
|       |-- TYRE_INSTALLATION_ERROR_FIX.md
|       |-- Trip.md
|       |-- UI_INTEGRATION_COMPLETE.md
|       |-- UNIFIED_MAP_IMPLEMENTATION.md
|       |-- VEHICLE_TYPE_SELECTION_FIX.md
|       |-- WIALON_ADVANCED_FEATURES.md
|       |-- WIALON_GPS_TRACKING_GUIDE.md
|       |-- WIALON_LOAD_SCHEDULING_INTEGRATION.md
|       |-- WIALON_LOAD_TRACKING_INTEGRATION.md
|       |-- WIALON_REPORTS_GUIDE.md
|       |-- WIALON_SENSOR_CONFIGURATION.md
|       |-- WIALON_UNIT_ID_REFERENCE.md
|       `-- fleet Tyre possitions.md
|-- env.d.ts
|-- eslint.config.js
|-- generate_structure.py
|-- geofences_response.json
|-- index.html
|-- mobile
|   |-- env.d.ts
|   |-- index.html
|   |-- package-lock.json
|   |-- package.json
|   |-- postcss.config.js
|   |-- public
|   |   |-- apple-touch-icon-180x180.png
|   |   |-- favicon-16x16.png
|   |   |-- favicon-32x32.png
|   |   |-- logo.svg
|   |   |-- pwa-192x192.png
|   |   `-- pwa-512x512.png
|   |-- src
|   |   |-- App.tsx
|   |   |-- components
|   |   |-- constants
|   |   |-- contexts
|   |   |-- hooks
|   |   |-- index.css
|   |   |-- integrations
|   |   |-- lib
|   |   |-- main.tsx
|   |   |-- pages
|   |   |-- types
|   |   `-- utils
|   |-- tailwind.config.ts
|   |-- tsconfig.json
|   |-- vercel.json
|   `-- vite.config.ts
|-- mobile-app-nextjs
|   |-- README.md
|   |-- next-env.d.ts
|   |-- next.config.js
|   |-- package-lock.json
|   |-- package.json
|   |-- postcss.config.js
|   |-- public
|   |   |-- icons
|   |   |-- manifest.json
|   |   `-- offline.html
|   |-- src
|   |   |-- app
|   |   |-- components
|   |   |-- constants
|   |   |-- contexts
|   |   |-- hooks
|   |   |-- lib
|   |   |-- proxy.ts
|   |   `-- types
|   |-- tailwind.config.ts
|   |-- tsconfig.json
|   `-- vercel.json
|-- package-lock.json
|-- package.json
|-- postcss.config.js
|-- public
|   |-- 19a736dd67e75.png
|   |-- app-icon.svg
|   |-- apple-touch-icon.png
|   |-- favicon-16.png
|   |-- favicon-32.png
|   |-- favicon.svg
|   |-- icon-128.png
|   |-- icon-144.png
|   |-- icon-152.png
|   |-- icon-192-maskable.png
|   |-- icon-192.png
|   |-- icon-256.png
|   |-- icon-384.png
|   |-- icon-48.png
|   |-- icon-512-maskable.png
|   |-- icon-512.png
|   |-- icon-72.png
|   |-- icon-96.png
|   |-- manifest.webmanifest
|   |-- matanuska.png
|   |-- og-image.png
|   `-- robots.txt
|-- rsults.md
|-- scripts
|   |-- check-geofences.ts
|   |-- extract_coordinates.js
|   |-- generate-mobile-icons.js
|   |-- generate-pwa-icons.js
|   |-- geocode-geofences.ts
|   |-- manual-geocode.ts
|   |-- resolve_coordinates.js
|   |-- resolved_suppliers.json
|   `-- shell
|       |-- apply_calendar_timestamps.sh
|       |-- apply_fix.sh
|       |-- apply_migrations.sh
|       |-- apply_new_migrations.sh
|       |-- apply_phase1_migrations.sh
|       |-- apply_registration_fix.sh
|       |-- apply_schema_extension.sh
|       |-- apply_vehicle_types_migration.sh
|       |-- apply_wialon_vehicles_migration.sh
|       |-- apply_workflow_migrations.sh
|       |-- code_analysis_summary.sh
|       |-- create-js-project.sh
|       |-- deploy_calendar_changes.sh
|       |-- find_unused_files.sh
|       |-- fix_wialon_integration.sh
|       |-- search_analysis.sh
|       |-- test-wialon-token.sh
|       |-- verify_schema.sh
|       |-- wialon_api_commands.sh
|       |-- wialon_dump_all.sh
|       |-- wialon_dump_all_unified.sh
|       |-- wialon_fetch.sh
|       `-- wialon_fetch_all.sh
|-- src
|   |-- App.css
|   |-- App.tsx
|   |-- components
|   |   |-- AddTaskForm.tsx
|   |   |-- Dashboard.css
|   |   |-- Dashboard.tsx
|   |   |-- DriverBehaviorTable.tsx
|   |   |-- ErrorBoundary.tsx
|   |   |-- FaultTracking.tsx
|   |   |-- FuelBunkerManagement.tsx
|   |   |-- InventoryPanel.tsx
|   |   |-- JobCardCostSummary.tsx
|   |   |-- JobCardFilters.tsx
|   |   |-- JobCardGeneralInfo.tsx
|   |   |-- JobCardHeader.tsx
|   |   |-- JobCardKanban.tsx
|   |   |-- JobCardLaborTable.tsx
|   |   |-- JobCardNotes.tsx
|   |   |-- JobCardPartsTable.tsx
|   |   |-- JobCardStats.tsx
|   |   |-- JobCardTasksTable.tsx
|   |   |-- Layout.tsx
|   |   |-- PWAInstallPrompt.tsx
|   |   |-- ProtectedRoute.tsx
|   |   |-- TaskCard.tsx
|   |   |-- TyreAnalytics.tsx
|   |   |-- TyreInspection.tsx
|   |   |-- TyreInventory.tsx
|   |   |-- TyreManagementSystem.tsx
|   |   |-- TyreReports.tsx
|   |   |-- UnifiedMapView.css
|   |   |-- UnifiedMapView.tsx
|   |   |-- Vehicle
|   |   |-- VehicleInspection.tsx
|   |   |-- VehicleMap.tsx
|   |   |-- WialonMapView.tsx
|   |   |-- WialonTrackingDemo.tsx
|   |   |-- admin
|   |   |-- analytics
|   |   |-- costs
|   |   |-- debug
|   |   |-- dialogs
|   |   |-- diesel
|   |   |-- driver
|   |   |-- forms
|   |   |-- incidents
|   |   |-- inspections
|   |   |-- invoicing
|   |   |-- loads
|   |   |-- maintenance
|   |   |-- map
|   |   |-- operations
|   |   |-- reports
|   |   |-- sensors
|   |   |-- trips
|   |   |-- tyres
|   |   |-- ui
|   |   `-- wialon
|   |-- constants
|   |   |-- actionItems.ts
|   |   |-- breakpoints.ts
|   |   |-- costCategories.ts
|   |   |-- customerRetention.ts
|   |   |-- fleet.ts
|   |   |-- fleetTyreConfig.ts
|   |   |-- incidentChecklist.ts
|   |   |-- loadStatusWorkflow.ts
|   |   |-- loadTypes.ts
|   |   |-- routePredefinedExpenses.ts
|   |   `-- routeTollCosts.ts
|   |-- contexts
|   |   |-- AuthContext.tsx
|   |   |-- LoadRealtimeContext.tsx
|   |   `-- OperationsContext.tsx
|   |-- hooks
|   |   |-- use-form-field.ts
|   |   |-- use-mobile.tsx
|   |   |-- use-toast.ts
|   |   |-- useAddPartForm.ts
|   |   |-- useAnalyticsExport.ts
|   |   |-- useCRAReports.ts
|   |   |-- useDriverAuth.ts
|   |   |-- useDriverBehaviorEvents.ts
|   |   |-- useDriverCoaching.ts
|   |   |-- useDrivers.ts
|   |   |-- useFleetNumbers.ts
|   |   |-- useFleetTyrePositions.ts
|   |   |-- useFuelBunkers.ts
|   |   |-- useFuelStations.ts
|   |   |-- useGeofenceNotifications.ts
|   |   |-- useGeofenceTracking.ts
|   |   |-- useGeofences.ts
|   |   |-- useGoogleSheetsSync.ts
|   |   |-- useIncidentChecklist.ts
|   |   |-- useIncidentDocuments.ts
|   |   |-- useIncidents.ts
|   |   |-- useLoadRealtime.ts
|   |   |-- useLoadRealtimeContext.ts
|   |   |-- useLoads.ts
|   |   |-- useOptimisticMutation.ts
|   |   |-- usePWAInstall.ts
|   |   |-- usePagination.ts
|   |   |-- useProcurement.ts
|   |   |-- usePromoteToVehicleFault.ts
|   |   |-- useRealtimeDriverBehaviorEvents.ts
|   |   |-- useRealtimeIncidents.ts
|   |   |-- useRealtimeTyres.ts
|   |   |-- useRealtimeVehicleFaults.ts
|   |   |-- useRealtimeVehicles.ts
|   |   |-- useRecruitment.ts
|   |   |-- useReeferDiesel.ts
|   |   |-- useRouteExpenses.ts
|   |   |-- useRouteOptimization.ts
|   |   |-- useRoutePredefinedExpenses.ts
|   |   |-- useRouteTollCosts.ts
|   |   |-- useSavedRoutes.ts
|   |   |-- useUnifiedVehicles.ts
|   |   |-- useUserAccess.ts
|   |   |-- useVehicleFaults.ts
|   |   |-- useVehicles.ts
|   |   |-- useWialonLoadIntegration.ts
|   |   |-- useWialonReports.ts
|   |   |-- useWialonSensors.ts
|   |   `-- useWialonVehicles.ts
|   |-- index.css
|   |-- integrations
|   |   |-- supabase
|   |   `-- wialon
|   |-- lib
|   |   |-- button-variants.ts
|   |   |-- customerAnalytics.ts
|   |   |-- dieselDebriefExport.ts
|   |   |-- dieselFleetExport.ts
|   |   |-- dipRecordExport.ts
|   |   |-- driverBehaviorExport.ts
|   |   |-- exportUtils.ts
|   |   |-- faultExport.ts
|   |   |-- formatters.ts
|   |   |-- inspectionPdfExport.ts
|   |   |-- jobCardExport.ts
|   |   |-- leafletSetup.ts
|   |   |-- loadPlanningUtils.ts
|   |   |-- maintenanceExport.ts
|   |   |-- maintenanceKmTracking.ts
|   |   |-- recruitmentExport.ts
|   |   |-- recurringSchedules.ts
|   |   |-- reeferDieselExport.ts
|   |   |-- reportUtils.ts
|   |   |-- supabaseAdmin.ts
|   |   |-- typeMappers.ts
|   |   |-- types.ts
|   |   `-- utils.ts
|   |-- main.tsx
|   |-- pages
|   |   |-- ActionLog.tsx
|   |   |-- Admin.tsx
|   |   |-- Analytics.tsx
|   |   |-- Auth.tsx
|   |   |-- CostManagement.tsx
|   |   |-- DieselManagement.tsx
|   |   |-- DriverManagement.tsx
|   |   |-- Faults.tsx
|   |   |-- FuelBunkers.tsx
|   |   |-- Incidents.tsx
|   |   |-- Index.tsx
|   |   |-- InspectionDetails.tsx
|   |   |-- Inspections.tsx
|   |   |-- InspectorProfiles.tsx
|   |   |-- Inventory.tsx
|   |   |-- Invoicing.tsx
|   |   |-- JobCardDetails.tsx
|   |   |-- JobCards.tsx
|   |   |-- LoadManagement.tsx
|   |   |-- MaintenanceScheduling.tsx
|   |   |-- MobileInspections.tsx
|   |   |-- NotFound.tsx
|   |   |-- PerformanceAnalytics.tsx
|   |   |-- Procurement.tsx
|   |   |-- TripManagement.tsx
|   |   |-- TyreInspections.tsx
|   |   |-- TyreManagement.tsx
|   |   |-- UnifiedMapPage.tsx
|   |   |-- Vehicles.tsx
|   |   `-- Vendors.tsx
|   |-- services
|   |   `-- advancedRouteTracking.ts
|   |-- types
|   |   |-- fleet.ts
|   |   |-- forms.ts
|   |   |-- loadPlanning.ts
|   |   |-- maintenance.ts
|   |   |-- operations.ts
|   |   |-- recruitment.ts
|   |   |-- recurringSchedules.ts
|   |   |-- supabase.ts
|   |   |-- tyre.ts
|   |   |-- vendor.ts
|   |   `-- wialon-global.d.ts
|   |-- utils
|   |   |-- advancedGeofencing.ts
|   |   |-- driverBehaviorAnalysis.ts
|   |   |-- fleetCategories.ts
|   |   |-- fleetUtils.ts
|   |   |-- generateIncidentPDF.ts
|   |   |-- geocoding.ts
|   |   |-- loadStatusValidation.ts
|   |   |-- logger.ts
|   |   |-- notifications.ts
|   |   |-- qrValidation.ts
|   |   |-- recoverIncidentImages.ts
|   |   |-- routeGeometry.ts
|   |   `-- tyreExport.ts
|   `-- vite-env.d.ts
|-- structure.md
|-- supabase
|   |-- config.toml
|   |-- functions
|   |   |-- assign-load
|   |   |-- deno.json
|   |   |-- get-wialon-token
|   |   |-- import-driver-behavior-webhook
|   |   |-- import-trips-from-webhook
|   |   |-- import_map.json
|   |   |-- maintenance-scheduler
|   |   |-- quick-task
|   |   |-- send-maintenance-notification
|   |   |-- sync-google-sheets
|   |   |-- trip-reports-api
|   |   |-- wialon-alerts
|   |   `-- wialon-proxy
|   |-- migrations
|   |   |-- 20250101000001_add_odometer_to_job_cards.sql
|   |   |-- 20250114000000_add_reefer_interlink_vehicle_types.sql
|   |   |-- 20250131000001_create_saved_routes_table.sql
|   |   |-- 20250612100000_add_dot_code_to_tyres.sql
|   |   |-- 20250612100001_remove_serial_number_unique.sql
|   |   |-- 20250930154607_0a194880-14a7-475c-942c-c5cd33f69a28.sql
|   |   |-- 20250930172852_2b6cba39-64a9-40af-b364-1967492dc804.sql
|   |   |-- 20250930182559_4ba54cd7-adff-45f7-885e-f03facf40fd3.sql
|   |   |-- 20251001045737_45816809-4f29-4279-b124-f5c386fefb59.sql
|   |   |-- 20251001053651_6eacf546-3b99-464a-9827-a4ca1f6711b1.sql
|   |   |-- 20251001073030_b07af2a0-8c27-4eb1-8118-b2b8d21c882e.sql
|   |   |-- 20251001073100_66344c7b-88a4-454d-a017-829c5f96f7e0.sql
|   |   |-- 20251001075233_d6c4ce7e-669d-4623-aea2-6b6a35b0a7d3.sql
|   |   |-- 20251001085946_30840618-463d-4fcb-a625-08db5f0b593b.sql
|   |   |-- 20251001093142_a214a1d7-43e6-4739-8147-a83724bed6d5.sql
|   |   |-- 20251001094518_74617115-9701-4ba3-82a0-82b537881dcf.sql
|   |   |-- 20251001095541_ebf5bd44-fc1c-4017-b76a-184d53696398.sql
|   |   |-- 20251002082947_f261d734-75fe-4536-9144-55467397d9ae.sql
|   |   |-- 20251003061601_7404b40c-e9f4-4af8-aadb-77c7200d98ab.sql
|   |   |-- 20251004090225_9c888fb5-2f36-44e1-85d3-7b454868ab2f.sql
|   |   |-- 20251005123418_1e77d9c9-e017-41ab-b28b-5951a1f12930.sql
|   |   |-- 20251006043546_455a5dee-f672-4cb1-a7a3-464ffdf7ff7c.sql
|   |   |-- 20251008051805_99966b28-c37b-44fd-85e6-e8e8d1d67b75.sql
|   |   |-- 20251010072227_be9d0df5-690e-44cc-b58e-34f395cf8645.sql
|   |   |-- 20251011060556_c6496c26-bdfd-47aa-a3e5-3c2c8197570c.sql
|   |   |-- 20251013040236_067c4abc-4d0b-488c-b827-0f71bc7144b3.sql
|   |   |-- 20251015064339_53bbe7c3-9066-4cbf-ae6a-99b5f25feb28.sql
|   |   |-- 20251020045810_331e9e33-09bc-4746-b565-fe9716280801.sql
|   |   |-- 20251021093611_146024dd-a2df-4134-a7ff-8b469b7a0156.sql
|   |   |-- 20251021093656_359ccf1a-de94-4a07-8b07-faf220890bce.sql
|   |   |-- 20251023074342_b0c4b0d2-7d34-428e-a9fa-e821881b990d.sql
|   |   |-- 20251028042042_a5e8f2e6-68ed-4197-ba28-00be934eb699.sql
|   |   |-- 20251029051937_db9a9318-0ea9-4945-a05a-3d6b881b4618.sql
|   |   |-- 20251029054146_01678d48-d54c-4773-b4db-c9322110696d.sql
|   |   |-- 20251029060511_d64f524e-0488-4d71-bcb9-bd6cc8c0e41e.sql
|   |   |-- 20251029062137_54f72c6c-6329-4ecf-aa7c-01cd1bac9f12.sql
|   |   |-- 20251029100626_1241f5e2-1e58-4a83-9c1e-1df2699bb80d.sql
|   |   |-- 20251031000000_add_missing_schema_fields.sql
|   |   |-- 20251031000001_extend_parts_requests_for_inventory.sql
|   |   |-- 20251031000002_create_inventory_transactions_table.sql
|   |   |-- 20251031000003_create_inventory_management_functions.sql
|   |   |-- 20251102000001_create_vendors_table.sql
|   |   |-- 20251102000002_update_vendors_table.sql
|   |   |-- 20251103000000_add_root_cause_analysis_to_inspections.sql
|   |   |-- 20251103000001_add_template_id_to_vehicle_inspections.sql
|   |   |-- 20251103000002_populate_inspection_template_items.sql
|   |   |-- 20251104000000_route_planning_loads.sql
|   |   |-- 20251104000001_enable_loads_realtime.sql
|   |   |-- 20251104000002_predefined_locations.sql
|   |   |-- 20251104000003_import_predefined_locations.sql
|   |   |-- 20251104000004_fix_load_assignment_history_rls.sql
|   |   |-- 20251104000005_phase2_live_tracking.sql
|   |   |-- 20251104000006_phase4_analytics.sql
|   |   |-- 20251104000007_apply_phase2_4_complete.sql
|   |   |-- 20251104120000_create_wialon_vehicles.sql
|   |   |-- 20251105000000_fix_missed_loads_nullable_fields.sql
|   |   |-- 20251105000001_add_invoice_fields_to_trips.sql
|   |   |-- 20251105000001_fix_maintenance_schedule_history_rls.sql
|   |   |-- 20251106000001_add_gps_analytics_functions.sql
|   |   |-- 20251106093520_create_geofences_table.sql
|   |   |-- 20251106093521_import_geofences_data.sql
|   |   |-- 20251106094000_import_geofences_to_locations.sql
|   |   |-- 20251106094001_import_geofences_alternative.sql
|   |   |-- 20251111000001_fix_missing_payment_status.sql
|   |   |-- 20251111000003_recurring_schedules.sql
|   |   |-- 20251111000004_phase3_4_planning_analytics.sql
|   |   |-- 20251111000005_calendar_load_sync.sql
|   |   |-- 20251111000006_geofence_load_automation.sql
|   |   |-- 20251111_001_add_enum_values.sql
|   |   |-- 20251111_002_add_workflow_columns.sql
|   |   |-- 20251111_load_workflow_timestamps.sql
|   |   |-- 20251111_migrate_trips_to_loads.sql
|   |   |-- 20251112000001_add_expected_timestamps_and_calendar_sync.sql
|   |   |-- 20251112000001_add_job_card_cost_documents.sql
|   |   |-- 20251112000002_add_wialon_id.sql
|   |   |-- 20251112000003_create_inventory_adjustment_functions.sql
|   |   |-- 20251117000000_advanced_tracking_extensions.sql
|   |   |-- 20251117000001_fix_calendar_events_vehicle_fk.sql
|   |   |-- 20251201000001_create_incidents_table.sql
|   |   |-- 20251208000001_add_incident_documents_and_timeline.sql
|   |   |-- 20251208000002_create_incident_storage_buckets.sql
|   |   |-- 20251208000003_create_incident_checklists.sql
|   |   |-- 20251209_diesel_suppliers.sql
|   |   |-- 20251209_fuel_bunkers.sql
|   |   |-- 20251209_fuel_routes.sql
|   |   |-- 20251209_import_suppliers.sql
|   |   |-- 20251209_manual_coordinates.sql
|   |   |-- 20251209_resolved_coordinates.sql
|   |   |-- 20251209_update_supplier_coordinates.sql
|   |   |-- 20251210_create_daily_dip_records.sql
|   |   |-- 20251215000001_create_driver_vehicle_assignments.sql
|   |   |-- 20260112000001_add_trip_kilometer_tracking.sql
|   |   |-- 20260112000002_add_reefer_diesel_records.sql
|   |   |-- 20260112200000_add_missing_fleet_vehicles.sql
|   |   |-- 20260113000000_add_procurement_workflow_tracking.sql
|   |   |-- 20260113000001_add_dip_record_edit_history.sql
|   |   |-- 20260115_insert_drivers.sql
|   |   |-- 20260116000000_fix_registration_no_length.sql
|   |   |-- 20260116000001_repair_orphaned_tyre_installations.sql
|   |   |-- 20260116000002_combined_fix_and_repair.sql
|   |   |-- 20260116000003_fixed_combined_migration.sql
|   |   |-- 20260116100000_analyze_fleet_usage.sql
|   |   |-- 20260116100001_create_unified_fleet_table.sql
|   |   |-- 20260116100002_drop_old_fleet_tables.sql
|   |   |-- 20260120000001_create_driver_recruitment_tables.sql
|   |   |-- 20260127000001_create_fuel_stations_table.sql
|   |   |-- 20260128000001_add_driver_auth_linking.sql
|   |   |-- 20260128000002_driver_vehicle_assignments_rls.sql
|   |   |-- 20260128100000_add_inventory_warranty_fields.sql
|   |   |-- 20260128100001_create_warranty_items_table.sql
|   |   |-- 20260128100002_add_vehicle_to_warranty_items.sql
|   |   |-- 20260202000001_add_procurement_fields.sql
|   |   |-- 20260203100000_enhance_tyre_bay_management.sql
|   |   |-- 20260203100001_add_purchase_cost_usd_to_tyres.sql
|   |   |-- 20260203_create_route_predefined_expenses.sql
|   |   |-- 20260203_create_route_toll_costs.sql
|   |   |-- 20260205000001_add_fleet_vehicle_id_to_trips.sql
|   |   |-- 20260205000002_add_fleet_34h.sql
|   |   |-- 20260205100000_import_fleet_tyre_positions.sql
|   |   |-- 20260205110000_add_new_clients.sql
|   |   |-- 20260206000001_add_trip_revenue_type_columns.sql
|   |   |-- 20260223_add_verified_no_costs.sql
|   |   |-- 20260225000001_add_vehicle_odometer.sql
|   |   |-- 20260225000002_procurement_workflow_overhaul.sql
|   |   |-- 20260225120000_cascade_driver_name_update.sql
|   |   |-- 20260226000000_inventory_vendor_link.sql
|   |   |-- 20260226120000_procurement_urgency_level.sql
|   |   `-- TEST_DATA_GENERATOR.sql
|   |-- prisma
|   |   `-- schema.prisma
|   `-- scripts
|       `-- diagnostic
|-- tailwind.config.ts
|-- tsconfig.app.json
|-- tsconfig.json
|-- tsconfig.node.json
|-- units_response.json
|-- vercel.json
|-- vite.config.ts
`-- wialon_response.json
```

## Dashboard App (src/)
```
src/
|-- App.css
|-- App.tsx
|-- components
|   |-- AddTaskForm.tsx
|   |-- Dashboard.css
|   |-- Dashboard.tsx
|   |-- DriverBehaviorTable.tsx
|   |-- ErrorBoundary.tsx
|   |-- FaultTracking.tsx
|   |-- FuelBunkerManagement.tsx
|   |-- InventoryPanel.tsx
|   |-- JobCardCostSummary.tsx
|   |-- JobCardFilters.tsx
|   |-- JobCardGeneralInfo.tsx
|   |-- JobCardHeader.tsx
|   |-- JobCardKanban.tsx
|   |-- JobCardLaborTable.tsx
|   |-- JobCardNotes.tsx
|   |-- JobCardPartsTable.tsx
|   |-- JobCardStats.tsx
|   |-- JobCardTasksTable.tsx
|   |-- Layout.tsx
|   |-- PWAInstallPrompt.tsx
|   |-- ProtectedRoute.tsx
|   |-- TaskCard.tsx
|   |-- TyreAnalytics.tsx
|   |-- TyreInspection.tsx
|   |-- TyreInventory.tsx
|   |-- TyreManagementSystem.tsx
|   |-- TyreReports.tsx
|   |-- UnifiedMapView.css
|   |-- UnifiedMapView.tsx
|   |-- Vehicle
|   |   |-- VehicleDetailsModal.tsx
|   |   |-- VehicleKPITiles.tsx
|   |   |-- VehicleMapView.tsx
|   |   `-- VehicleOverviewReport.tsx
|   |-- VehicleInspection.tsx
|   |-- VehicleMap.tsx
|   |-- WialonMapView.tsx
|   |-- WialonTrackingDemo.tsx
|   |-- admin
|   |   `-- InspectorManagement.tsx
|   |-- analytics
|   |   |-- CustomerRetentionDashboard.tsx
|   |   |-- DeliveryAnalyticsDashboard.tsx
|   |   `-- GPSAnalyticsDashboard.tsx
|   |-- costs
|   |   |-- AdditionalCostsForm.tsx
|   |   |-- CostForm.tsx
|   |   |-- CostList.tsx
|   |   |-- RouteExpensesSuggestor.tsx
|   |   |-- SystemCostGenerator.tsx
|   |   `-- SystemCostGeneratorV2.tsx
|   |-- debug
|   |   `-- TripsDebugger.tsx
|   |-- dialogs
|   |   |-- AddBayTyreDialog.tsx
|   |   |-- AddFaultDialog.tsx
|   |   |-- AddIncidentDialog.tsx
|   |   |-- AddInventoryItemDialog.tsx
|   |   |-- AddJobCardDialog.tsx
|   |   |-- AddPartWithCostDialog.tsx
|   |   |-- AddTaskDialog.tsx
|   |   |-- AddTyreDialog.tsx
|   |   |-- AddVehicleDialog.tsx
|   |   |-- AddVendorDialog.tsx
|   |   |-- AddWarrantyItemDialog.tsx
|   |   |-- BulkTyreInstallImportModal.tsx
|   |   |-- CorrectiveActionDialog.tsx
|   |   |-- CreateCARFromIncidentDialog.tsx
|   |   |-- CreateJobCardFromInspectionDialog.tsx
|   |   |-- CreateJobCardFromScheduleDialog.tsx
|   |   |-- CreateWorkOrderFromInspectionDialog.tsx
|   |   |-- DeleteIncidentDialog.tsx
|   |   |-- DeleteVehicleDialog.tsx
|   |   |-- EditBayTyreDialog.tsx
|   |   |-- EditCashManagerItemDialog.tsx
|   |   |-- EditFaultDialog.tsx
|   |   |-- EditIncidentDialog.tsx
|   |   |-- EditInstalledTyreDialog.tsx
|   |   |-- EditTyreDialog.tsx
|   |   |-- EditVehicleDialog.tsx
|   |   |-- EnhancedRequestPartsDialog.tsx
|   |   |-- FaultDetailsDialog.tsx
|   |   |-- IncidentChecklistDialog.tsx
|   |   |-- IncidentClosureDialog.tsx
|   |   |-- IncidentDetailsDialog.tsx
|   |   |-- InspectionFaultDialog.tsx
|   |   |-- InspectionPhotoDialog.tsx
|   |   |-- InstallTyreDialog.tsx
|   |   |-- InventoryDetailDialog.tsx
|   |   |-- InventoryImportModal.tsx
|   |   |-- InventorySearchDialog.tsx
|   |   |-- JobCardDetailsDialog.tsx
|   |   |-- ProcurementFromInventoryDialog.tsx
|   |   |-- RemoveTyreDialog.tsx
|   |   |-- RepeatedActionAlertDialog.tsx
|   |   |-- RequestPartsDialog.tsx
|   |   |-- RootCauseAnalysisDialog.tsx
|   |   |-- StartInspectionDialog.tsx
|   |   |-- StartProcurementDialog.tsx
|   |   |-- TaskCompletionDialog.tsx
|   |   |-- TemplateManagerDialog.tsx
|   |   |-- TyreInventoryImportModal.tsx
|   |   |-- UpdateStockDialog.tsx
|   |   |-- ViewTyreDialog.tsx
|   |   |-- WarrantyDialog.tsx
|   |   `-- parts
|   |       |-- ExternalPartForm.tsx
|   |       |-- InventoryPartForm.tsx
|   |       |-- ServicePartForm.tsx
|   |       |-- SourceTypeSelector.tsx
|   |       `-- VendorSelect.tsx
|   |-- diesel
|   |   |-- DieselDebriefModal.tsx
|   |   |-- DieselImportModal.tsx
|   |   |-- DieselNormsModal.tsx
|   |   |-- DieselTransactionViewModal.tsx
|   |   |-- ManualDieselEntryModal.tsx
|   |   |-- ProbeVerificationModal.tsx
|   |   |-- ReeferDieselEntryModal.tsx
|   |   |-- ReeferDieselTab.tsx
|   |   |-- ReeferLinkageModal.tsx
|   |   `-- TripLinkageModal.tsx
|   |-- driver
|   |   |-- CRAReportForm.tsx
|   |   |-- CarDetailModal.tsx
|   |   |-- CarReportsGrid.tsx
|   |   |-- CreateDriverAuthDialog.tsx
|   |   |-- DriverBehaviorCard.tsx
|   |   |-- DriverBehaviorDetailsDialog.tsx
|   |   |-- DriverBehaviorEditModal.tsx
|   |   |-- DriverBehaviorGrid.tsx
|   |   |-- DriverCoachingModal.tsx
|   |   |-- DriverManagementSection.tsx
|   |   |-- DriverPerformanceSummary.tsx
|   |   `-- DriverRecruitmentSection.tsx
|   |-- forms
|   |   `-- TyreConfigForm.tsx
|   |-- incidents
|   |   |-- AccidentResponseGuide.tsx
|   |   `-- IncidentManagement.tsx
|   |-- inspections
|   |   |-- InspectionActionsMenu.tsx
|   |   |-- InspectionForm.tsx
|   |   |-- InspectionHistory.tsx
|   |   |-- InspectionTypeSelector.tsx
|   |   |-- InspectorProfileSelector.tsx
|   |   |-- MaintenanceInspectionLink.tsx
|   |   |-- MobileInspectionStart.tsx
|   |   `-- MobileTyreInspectionForm.tsx
|   |-- invoicing
|   |   |-- PaymentUpdateModal.tsx
|   |   `-- PaymentUpdateModel.tsx
|   |-- loads
|   |   |-- BulkLoadImport.tsx
|   |   |-- CreateLoadDialog.tsx
|   |   |-- CustomerRetentionDashboard.tsx
|   |   |-- EditLoadDialog.tsx
|   |   |-- EnhancedProgressDashboard.tsx
|   |   |-- EnhancedTrackVisualization.tsx
|   |   |-- GeofenceRoutePlanner.tsx
|   |   |-- LiveDeliveryTracking.tsx
|   |   |-- LoadAssignmentDialog.tsx
|   |   |-- LoadRealtimeIndicator.tsx
|   |   |-- LoadStatusWorkflow.tsx
|   |   |-- LoadUpdateTimeline.tsx
|   |   |-- LoadsTable.tsx
|   |   |-- LocationSelector.tsx
|   |   |-- RealTimeKPIMonitor.tsx
|   |   |-- RecurringScheduleManager.tsx
|   |   |-- RoutePlanner.tsx
|   |   |-- SaveRouteDialog.tsx
|   |   |-- VehicleSelector.tsx
|   |   `-- calendar
|   |       |-- CalendarFilters.tsx
|   |       |-- CalendarHeader.tsx
|   |       |-- DayView.tsx
|   |       |-- EventDialog.tsx
|   |       |-- LoadPlanningCalendar.tsx
|   |       |-- MonthView.tsx
|   |       |-- VehicleAllocationView.tsx
|   |       |-- WeekView.tsx
|   |       `-- index.ts
|   |-- maintenance
|   |   |-- AddScheduleDialog.tsx
|   |   |-- CalendarDayCell.tsx
|   |   |-- CalendarEventPill.tsx
|   |   |-- CompleteMaintenanceDialog.tsx
|   |   |-- EditScheduleDialog.tsx
|   |   |-- JobCardWeeklyCostReport.tsx
|   |   |-- MaintenanceAnalytics.tsx
|   |   |-- MaintenanceCalendar.tsx
|   |   |-- MaintenanceGridCalendar.tsx
|   |   |-- MaintenanceHistory.tsx
|   |   |-- MaintenanceNotifications.tsx
|   |   |-- MobileQuickComplete.tsx
|   |   |-- NotificationSettings.tsx
|   |   |-- OverdueAlerts.tsx
|   |   |-- ScheduleDetailsDialog.tsx
|   |   |-- ScheduleList.tsx
|   |   `-- TemplateManager.tsx
|   |-- map
|   |   |-- LiveVehicleDataPanel.tsx
|   |   |-- MapReportPanel.tsx
|   |   |-- MeasurementControl.tsx
|   |   `-- ReportResultsPanel.tsx
|   |-- operations
|   |   |-- ActionItemDetails.tsx
|   |   `-- MissedLoadsTracker.tsx
|   |-- reports
|   |   |-- TripReport.tsx
|   |   |-- TripSelector.tsx
|   |   |-- WialonReportDebug.tsx
|   |   |-- WialonReportExecutor.tsx
|   |   |-- WialonReportViewer.tsx
|   |   `-- YearToDateKPIs.tsx
|   |-- sensors
|   |   |-- SensorValueDisplay.tsx
|   |   |-- WialonSensorMonitor.tsx
|   |   |-- WialonSensorSelector.tsx
|   |   `-- WialonSensorWidget.tsx
|   |-- trips
|   |   |-- ActiveTrips.tsx
|   |   |-- AddTripDialog.tsx
|   |   |-- CompletedTripEditModal.tsx
|   |   |-- CompletedTrips.tsx
|   |   |-- EditTripDialog.tsx
|   |   |-- FlagResolutionModal.tsx
|   |   |-- InvoiceManager.tsx
|   |   |-- InvoicingDashboard.tsx
|   |   |-- LoadImportModal.tsx
|   |   |-- TripCostManager.tsx
|   |   |-- TripCostSection.tsx
|   |   |-- TripCycleTrackerView.tsx
|   |   |-- TripDetailsModal.tsx
|   |   |-- TripExpensesSection.tsx
|   |   |-- TripExportDialog.tsx
|   |   |-- TripReportsSection.tsx
|   |   `-- TruckReportsTab.tsx
|   |-- tyres
|   |   |-- FleetTyreLayoutDiagram.tsx
|   |   |-- FleetTyreReports.tsx
|   |   |-- PositionQRScanner.tsx
|   |   |-- PressureIndicator.tsx
|   |   |-- TreadDepthGauge.tsx
|   |   |-- TyreAdvancedSearch.tsx
|   |   |-- TyreInspectionDialog.tsx
|   |   |-- TyreLifecycleDialog.tsx
|   |   |-- TyreManagementDialog.tsx
|   |   |-- TyrePredictiveInsights.tsx
|   |   |-- TyreQRCodeSystem.tsx
|   |   `-- TyreRecommendationEngine.tsx
|   |-- ui
|   |   |-- accordion.tsx
|   |   |-- alert-dialog.tsx
|   |   |-- alert.tsx
|   |   |-- aspect-ratio.tsx
|   |   |-- avatar.tsx
|   |   |-- badge-variants.ts
|   |   |-- badge.tsx
|   |   |-- breadcrumb.tsx
|   |   |-- button-variants.tsx
|   |   |-- button.tsx
|   |   |-- calendar.tsx
|   |   |-- card.tsx
|   |   |-- carousel.tsx
|   |   |-- chart.tsx
|   |   |-- checkbox.tsx
|   |   |-- client-select.tsx
|   |   |-- collapsible.tsx
|   |   |-- command.tsx
|   |   |-- context-menu.tsx
|   |   |-- date-picker.tsx
|   |   |-- dialog.tsx
|   |   |-- drawer.tsx
|   |   |-- driver-select.tsx
|   |   |-- dropdown-menu.tsx
|   |   |-- file-upload.tsx
|   |   |-- form-elements.tsx
|   |   |-- form.tsx
|   |   |-- fuel-station-select.tsx
|   |   |-- geofence-select.tsx
|   |   |-- hover-card.tsx
|   |   |-- input-otp.tsx
|   |   |-- input.tsx
|   |   |-- label.tsx
|   |   |-- loading-spinner.tsx
|   |   |-- menubar.tsx
|   |   |-- modal.tsx
|   |   |-- navigation-menu-styles.ts
|   |   |-- navigation-menu.tsx
|   |   |-- paginated-table.tsx
|   |   |-- pagination.tsx
|   |   |-- popover.tsx
|   |   |-- progress.tsx
|   |   |-- radio-group.tsx
|   |   |-- resizable.tsx
|   |   |-- responsive.tsx
|   |   |-- route-select.tsx
|   |   |-- scroll-area.tsx
|   |   |-- select.tsx
|   |   |-- separator.tsx
|   |   |-- sheet.tsx
|   |   |-- sidebar.tsx
|   |   |-- skeleton.tsx
|   |   |-- skeletons.tsx
|   |   |-- slider.tsx
|   |   |-- sonner.tsx
|   |   |-- switch.tsx
|   |   |-- sync-indicator.tsx
|   |   |-- table.tsx
|   |   |-- tabs.tsx
|   |   |-- textarea.tsx
|   |   |-- toast.tsx
|   |   |-- toaster.tsx
|   |   |-- toggle-group.tsx
|   |   |-- toggle.tsx
|   |   |-- tooltip.tsx
|   |   |-- use-toast.ts
|   |   `-- user-select.tsx
|   `-- wialon
|       |-- GeofenceDisplay.tsx
|       |-- GeofenceManagement.tsx
|       |-- TrackVisualization.tsx
|       |-- WialonNotificationComponent.tsx
|       `-- index.ts
|-- constants
|   |-- actionItems.ts
|   |-- breakpoints.ts
|   |-- costCategories.ts
|   |-- customerRetention.ts
|   |-- fleet.ts
|   |-- fleetTyreConfig.ts
|   |-- incidentChecklist.ts
|   |-- loadStatusWorkflow.ts
|   |-- loadTypes.ts
|   |-- routePredefinedExpenses.ts
|   `-- routeTollCosts.ts
|-- contexts
|   |-- AuthContext.tsx
|   |-- LoadRealtimeContext.tsx
|   `-- OperationsContext.tsx
|-- hooks
|   |-- use-form-field.ts
|   |-- use-mobile.tsx
|   |-- use-toast.ts
|   |-- useAddPartForm.ts
|   |-- useAnalyticsExport.ts
|   |-- useCRAReports.ts
|   |-- useDriverAuth.ts
|   |-- useDriverBehaviorEvents.ts
|   |-- useDriverCoaching.ts
|   |-- useDrivers.ts
|   |-- useFleetNumbers.ts
|   |-- useFleetTyrePositions.ts
|   |-- useFuelBunkers.ts
|   |-- useFuelStations.ts
|   |-- useGeofenceNotifications.ts
|   |-- useGeofenceTracking.ts
|   |-- useGeofences.ts
|   |-- useGoogleSheetsSync.ts
|   |-- useIncidentChecklist.ts
|   |-- useIncidentDocuments.ts
|   |-- useIncidents.ts
|   |-- useLoadRealtime.ts
|   |-- useLoadRealtimeContext.ts
|   |-- useLoads.ts
|   |-- useOptimisticMutation.ts
|   |-- usePWAInstall.ts
|   |-- usePagination.ts
|   |-- useProcurement.ts
|   |-- usePromoteToVehicleFault.ts
|   |-- useRealtimeDriverBehaviorEvents.ts
|   |-- useRealtimeIncidents.ts
|   |-- useRealtimeTyres.ts
|   |-- useRealtimeVehicleFaults.ts
|   |-- useRealtimeVehicles.ts
|   |-- useRecruitment.ts
|   |-- useReeferDiesel.ts
|   |-- useRouteExpenses.ts
|   |-- useRouteOptimization.ts
|   |-- useRoutePredefinedExpenses.ts
|   |-- useRouteTollCosts.ts
|   |-- useSavedRoutes.ts
|   |-- useUnifiedVehicles.ts
|   |-- useUserAccess.ts
|   |-- useVehicleFaults.ts
|   |-- useVehicles.ts
|   |-- useWialonLoadIntegration.ts
|   |-- useWialonReports.ts
|   |-- useWialonSensors.ts
|   `-- useWialonVehicles.ts
|-- index.css
|-- integrations
|   |-- supabase
|   |   |-- client.ts
|   |   `-- types.ts
|   `-- wialon
|       |-- WialonContext.ts
|       |-- WialonProvider.tsx
|       |-- index.ts
|       |-- service.ts
|       |-- types.ts
|       |-- useWialon.ts
|       |-- useWialonContext.ts
|       `-- wialonAdvanced.ts
|-- lib
|   |-- button-variants.ts
|   |-- customerAnalytics.ts
|   |-- dieselDebriefExport.ts
|   |-- dieselFleetExport.ts
|   |-- dipRecordExport.ts
|   |-- driverBehaviorExport.ts
|   |-- exportUtils.ts
|   |-- faultExport.ts
|   |-- formatters.ts
|   |-- inspectionPdfExport.ts
|   |-- jobCardExport.ts
|   |-- leafletSetup.ts
|   |-- loadPlanningUtils.ts
|   |-- maintenanceExport.ts
|   |-- maintenanceKmTracking.ts
|   |-- recruitmentExport.ts
|   |-- recurringSchedules.ts
|   |-- reeferDieselExport.ts
|   |-- reportUtils.ts
|   |-- supabaseAdmin.ts
|   |-- typeMappers.ts
|   |-- types.ts
|   `-- utils.ts
|-- main.tsx
|-- pages
|   |-- ActionLog.tsx
|   |-- Admin.tsx
|   |-- Analytics.tsx
|   |-- Auth.tsx
|   |-- CostManagement.tsx
|   |-- DieselManagement.tsx
|   |-- DriverManagement.tsx
|   |-- Faults.tsx
|   |-- FuelBunkers.tsx
|   |-- Incidents.tsx
|   |-- Index.tsx
|   |-- InspectionDetails.tsx
|   |-- Inspections.tsx
|   |-- InspectorProfiles.tsx
|   |-- Inventory.tsx
|   |-- Invoicing.tsx
|   |-- JobCardDetails.tsx
|   |-- JobCards.tsx
|   |-- LoadManagement.tsx
|   |-- MaintenanceScheduling.tsx
|   |-- MobileInspections.tsx
|   |-- NotFound.tsx
|   |-- PerformanceAnalytics.tsx
|   |-- Procurement.tsx
|   |-- TripManagement.tsx
|   |-- TyreInspections.tsx
|   |-- TyreManagement.tsx
|   |-- UnifiedMapPage.tsx
|   |-- Vehicles.tsx
|   `-- Vendors.tsx
|-- services
|   `-- advancedRouteTracking.ts
|-- types
|   |-- fleet.ts
|   |-- forms.ts
|   |-- loadPlanning.ts
|   |-- maintenance.ts
|   |-- operations.ts
|   |-- recruitment.ts
|   |-- recurringSchedules.ts
|   |-- supabase.ts
|   |-- tyre.ts
|   |-- vendor.ts
|   `-- wialon-global.d.ts
|-- utils
|   |-- advancedGeofencing.ts
|   |-- driverBehaviorAnalysis.ts
|   |-- fleetCategories.ts
|   |-- fleetUtils.ts
|   |-- generateIncidentPDF.ts
|   |-- geocoding.ts
|   |-- loadStatusValidation.ts
|   |-- logger.ts
|   |-- notifications.ts
|   |-- qrValidation.ts
|   |-- recoverIncidentImages.ts
|   |-- routeGeometry.ts
|   `-- tyreExport.ts
`-- vite-env.d.ts
```

## Workshop Mobile App (mobile/src/)
```
mobile/src/
|-- App.tsx
|-- components
|   |-- AddTaskForm.tsx
|   |-- JobCardGeneralInfo.tsx
|   |-- JobCardHeader.tsx
|   |-- JobCardLaborTable.tsx
|   |-- JobCardNotes.tsx
|   |-- JobCardPartsTable.tsx
|   |-- JobCardStats.tsx
|   |-- JobCardTasksTable.tsx
|   |-- MobilePageLayout.tsx
|   |-- ProtectedRoute.tsx
|   |-- TyreInspection.tsx
|   |-- TyreInventory.tsx
|   |-- TyreManagementSystem.tsx
|   |-- dialogs
|   |   |-- AddBayTyreDialog.tsx
|   |   |-- AddJobCardDialog.tsx
|   |   |-- AddPartWithCostDialog.tsx
|   |   |-- AddTyreDialog.tsx
|   |   |-- BulkTyreInstallImportModal.tsx
|   |   |-- CorrectiveActionDialog.tsx
|   |   |-- CreateWorkOrderFromInspectionDialog.tsx
|   |   |-- EditBayTyreDialog.tsx
|   |   |-- EditInstalledTyreDialog.tsx
|   |   |-- EditTyreDialog.tsx
|   |   |-- InspectionFaultDialog.tsx
|   |   |-- InstallTyreDialog.tsx
|   |   |-- InventoryDetailDialog.tsx
|   |   |-- InventorySearchDialog.tsx
|   |   |-- JobCardDetailsDialog.tsx
|   |   |-- RemoveTyreDialog.tsx
|   |   |-- RepeatedActionAlertDialog.tsx
|   |   |-- RootCauseAnalysisDialog.tsx
|   |   |-- StartInspectionDialog.tsx
|   |   |-- TaskCompletionDialog.tsx
|   |   |-- TemplateManagerDialog.tsx
|   |   |-- TyreInventoryImportModal.tsx
|   |   |-- ViewTyreDialog.tsx
|   |   `-- parts
|   |       |-- ExternalPartForm.tsx
|   |       |-- InventoryPartForm.tsx
|   |       |-- ServicePartForm.tsx
|   |       |-- SourceTypeSelector.tsx
|   |       `-- VendorSelect.tsx
|   |-- inspections
|   |   |-- InspectionActionsMenu.tsx
|   |   |-- InspectionForm.tsx
|   |   |-- InspectionHistory.tsx
|   |   |-- InspectionTypeSelector.tsx
|   |   |-- InspectorProfileSelector.tsx
|   |   |-- MaintenanceInspectionLink.tsx
|   |   |-- MobileInspectionStart.tsx
|   |   `-- MobileTyreInspectionForm.tsx
|   |-- maintenance
|   |   |-- AddScheduleDialog.tsx
|   |   `-- MobileQuickComplete.tsx
|   |-- mobile
|   |   |-- MobileInspectionsTab.tsx
|   |   |-- MobileJobCards.tsx
|   |   |-- MobileMaintenance.tsx
|   |   |-- MobileTyresTab.tsx
|   |   |-- WorkshopMobileLayout.tsx
|   |   `-- WorkshopMobileShell.tsx
|   |-- tyres
|   |   |-- FleetTyreLayoutDiagram.tsx
|   |   |-- FleetTyreReports.tsx
|   |   |-- PositionQRScanner.tsx
|   |   |-- PressureIndicator.tsx
|   |   |-- TreadDepthGauge.tsx
|   |   |-- TyreAdvancedSearch.tsx
|   |   |-- TyreInspectionDialog.tsx
|   |   |-- TyreLifecycleDialog.tsx
|   |   |-- TyreManagementDialog.tsx
|   |   |-- TyrePredictiveInsights.tsx
|   |   |-- TyreQRCodeSystem.tsx
|   |   `-- TyreRecommendationEngine.tsx
|   `-- ui
|       |-- alert-dialog.tsx
|       |-- alert.tsx
|       |-- badge-variants.ts
|       |-- badge.tsx
|       |-- button.tsx
|       |-- calendar.tsx
|       |-- card.tsx
|       |-- checkbox.tsx
|       |-- collapsible.tsx
|       |-- date-picker.tsx
|       |-- dialog.tsx
|       |-- dropdown-menu.tsx
|       |-- input.tsx
|       |-- label.tsx
|       |-- loading-spinner.tsx
|       |-- modal.tsx
|       |-- popover.tsx
|       |-- progress.tsx
|       |-- radio-group.tsx
|       |-- scroll-area.tsx
|       |-- select.tsx
|       |-- separator.tsx
|       |-- sheet.tsx
|       |-- sonner.tsx
|       |-- switch.tsx
|       |-- table.tsx
|       |-- tabs.tsx
|       |-- textarea.tsx
|       |-- toast.tsx
|       |-- toaster.tsx
|       |-- tooltip.tsx
|       |-- use-toast.ts
|       `-- user-select.tsx
|-- constants
|   |-- breakpoints.ts
|   `-- fleetTyreConfig.ts
|-- contexts
|   `-- AuthContext.tsx
|-- hooks
|   |-- use-mobile.tsx
|   |-- use-toast.ts
|   |-- useAddPartForm.ts
|   |-- useFleetNumbers.ts
|   |-- useFleetTyrePositions.ts
|   |-- useGeofenceNotifications.ts
|   |-- usePromoteToVehicleFault.ts
|   |-- useRealtimeTyres.ts
|   `-- useVehicles.ts
|-- index.css
|-- integrations
|   `-- supabase
|       |-- client.ts
|       `-- types.ts
|-- lib
|   |-- button-variants.ts
|   |-- formatters.ts
|   |-- inspectionPdfExport.ts
|   |-- jobCardExport.ts
|   `-- utils.ts
|-- main.tsx
|-- pages
|   |-- Auth.tsx
|   |-- InspectionDetails.tsx
|   |-- MobileInspections.tsx
|   |-- TyreInspections.tsx
|   `-- TyreManagement.tsx
|-- types
|   |-- maintenance.ts
|   `-- tyre.ts
`-- utils
    |-- qrValidation.ts
    `-- tyreExport.ts
```

## Driver App (mobile-app-nextjs/src/)
```
mobile-app-nextjs/src/
|-- app
|   |-- diesel
|   |   `-- page.tsx
|   |-- expenses
|   |   `-- page.tsx
|   |-- globals.css
|   |-- layout.tsx
|   |-- login
|   |   `-- page.tsx
|   |-- metadata.ts
|   |-- not-found.tsx
|   |-- page.tsx
|   |-- profile
|   |   `-- page.tsx
|   `-- trip
|       `-- page.tsx
|-- components
|   |-- cycle-tracker-form.tsx
|   |-- layout
|   |   |-- bottom-nav.tsx
|   |   |-- index.ts
|   |   `-- mobile-shell.tsx
|   |-- providers.tsx
|   |-- pwa-install-prompt.tsx
|   |-- trip-detail-sheet.tsx
|   |-- trip-link-form.tsx
|   `-- ui
|       |-- avatar.tsx
|       |-- badge.tsx
|       |-- button-variants.ts
|       |-- button.tsx
|       |-- card.tsx
|       |-- dialog.tsx
|       |-- form.tsx
|       |-- input.tsx
|       |-- label.tsx
|       |-- pull-to-refresh.tsx
|       |-- select.tsx
|       |-- textarea.tsx
|       |-- toast.tsx
|       |-- toaster.tsx
|       |-- vehicle-select.tsx
|       `-- visually-hidden.tsx
|-- constants
|   `-- cost-categories.ts
|-- contexts
|   `-- auth-context.tsx
|-- hooks
|   |-- use-realtime.ts
|   `-- use-toast.ts
|-- lib
|   |-- supabase
|   |   |-- client.ts
|   |   |-- middleware.ts
|   |   `-- server.ts
|   `-- utils.ts
|-- proxy.ts
`-- types
    `-- database.ts
```
