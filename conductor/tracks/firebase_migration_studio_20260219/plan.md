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

## Phase 3: Management Studio UI [checkpoint: 1e4fc9e]
Goal: Implement the Master-Detail interface for Service and Brand CRUD.

- [x] Task: Build the Management Studio Layout (Master-Detail). (src/components/admin/studio/studio-layout.tsx)
- [~] Task: Implement Service CRUD forms with Hybrid Asset integration.
    - [ ] Write Tests: Verify form validation and real-time Firestore updates.
    - [ ] Implement Feature: Build the "Edit Service" pane with icon picker and upload tools.
- [~] Task: Implement Brand CRUD forms.
    - [ ] Write Tests: Verify model list management and logo updates.
    - [ ] Implement Feature: Build the "Edit Brand" pane with rich text support for heritage.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Management Studio UI' (Protocol in workflow.md)

## Phase 4: Pure Firebase Booking & Real-time Dashboard
Goal: Finalize user-generated data flows and add real-time updates to the dashboard.

- [ ] Task: Refactor `createBooking` to use Firestore.
    - [ ] Write Tests: Verify new bookings are saved to Firestore and linked to users.
    - [ ] Implement Feature: Update server actions and validation logic.
- [ ] Task: Implement Real-time "Recent Activity" listener.
    - [ ] Write Tests: Verify that the dashboard UI updates automatically when a Firestore document changes.
    - [ ] Implement Feature: Use `onSnapshot` in the dashboard widget for live updates.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Pure Firebase Booking & Real-time Dashboard' (Protocol in workflow.md)
