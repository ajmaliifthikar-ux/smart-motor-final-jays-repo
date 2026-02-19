# Implementation Plan: Pure Firebase Migration & Management Studio

## Phase 1: Firestore Catalog Migration [checkpoint: d2ca354]
Goal: Migrate all Brands and Services to Firestore and update consumer-facing components.

- [x] Task: Create a one-time migration script `scripts/migrate-to-firestore.ts`. (Verified via execution)
- [x] Task: Update `BookingForm` and `BrandPage` to fetch data from Firestore. (d2ca354)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Firestore Catalog Migration' (d2ca354)

## Phase 2: Hybrid Asset Management System [checkpoint: fe68b8e]
Goal: Build the underlying storage and library system for icons and brand logos.

- [x] Task: Set up Firebase Storage rules and utility for secure file uploads. (src/lib/firebase-storage.ts)
- [x] Task: Build the "Preset Library" of automotive icons. (src/lib/constants/icons.ts)
- [x] Task: Conductor - User Manual Verification 'Phase 2: Hybrid Asset Management System' (fe68b8e)

## Phase 3: Management Studio UI [checkpoint: 09036ef]
Goal: Implement the Master-Detail interface for Service and Brand CRUD.

- [x] Task: Build the Management Studio Layout (Master-Detail). (src/components/admin/studio/studio-layout.tsx)
- [x] Task: Implement Service CRUD forms with Hybrid Asset integration. (src/components/admin/studio/service-editor.tsx)
- [x] Task: Implement Brand CRUD forms. (src/components/admin/studio/brand-editor.tsx)
- [x] Task: Conductor - User Manual Verification 'Phase 3: Management Studio UI' (09036ef)

## Phase 4: Pure Firebase Booking & Real-time Dashboard [checkpoint: 10e65b7]
Goal: Finalize user-generated data flows and add real-time updates to the dashboard.

- [x] Task: Refactor `createBooking` to use Firestore. (Verified already in firebase-db.ts)
- [x] Task: Implement Real-time "Recent Activity" listener. (src/components/admin/recent-activity-live.tsx)
- [x] Task: Conductor - User Manual Verification 'Phase 4: Pure Firebase Booking & Real-time Dashboard' (10e65b7)
