# Implementation Plan: Stabilize Core Systems & Dynamic Data Migration

## Phase 1: Data Migration & Seeding
Goal: Move all static information into the database to serve as the single source of truth.

- [x] Task: Audit `src/lib/data.ts` and `src/lib/v2-data.ts` to identify all brands, services, and car models.
- [x] Task: Update `prisma/seed.ts` to include comprehensive data for Brands, Services, and ServicePackages.
    - [x] Write Tests: Verify seeding logic doesn't create duplicates.
    - [x] Implement Feature: Enhance `seed.ts` with complete dataset.
- [x] Task: Execute database seed and verify records via Prisma Studio or CLI.
- [x] Task: Conductor - User Manual Verification 'Phase 1: Data Migration & Seeding' (Protocol in workflow.md)

## Phase 2: Secure Admin Authentication
Goal: Connect the admin panel to Firebase for robust security.

- [ ] Task: Configure Firebase Admin SDK in `src/lib/firebase-admin.ts`.
- [ ] Task: Implement Admin Login Flow in `src/app/admin/login`.
    - [ ] Write Tests: Mock Firebase Auth to test successful/failed login attempts.
    - [ ] Implement Feature: Create login page and server action for authentication.
- [ ] Task: Integrate Firebase session with NextAuth.
- [ ] Task: Create a first Admin user in Firebase and verify access to `/admin/dashboard`.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Secure Admin Authentication' (Protocol in workflow.md)

## Phase 3: Robust Booking System & Brand Picker
Goal: Fix the "stuck" booking form and ensure dynamic brand selection.

- [x] Task: Refactor `BrandPicker` component to fetch brands from the database API.
    - [x] Write Tests: Verify picker displays "No brands found" only when DB is empty.
    - [x] Implement Feature: Update component with `swr` or `server actions` for data fetching.
- [x] Task: Debug and Fix `BookingForm` multi-step logic.
    - [x] Write Tests: Simulate "Next" clicks and verify state transitions.
    - [x] Implement Feature: Fix state management and data passing between steps.
- [x] Task: Ensure the brand selection step correctly filters models based on the selected brand.
- [x] Task: Conductor - User Manual Verification 'Phase 3: Robust Booking System & Brand Picker' (Protocol in workflow.md)

## Phase 4: Dynamic UI & High-Fidelity Refinements
Goal: Connect all remaining UI components to the database and polish the aesthetic.

- [x] Task: Update Hero Carousel to fetch brand logos and names from the database.
- [x] Task: Refactor "Under One Roof" section to render `ServiceCard` components from the DB.
- [x] Task: Implement dynamic Brand Pages (`/brand/[slug]`) using data-driven layouts.
- [x] Task: Limit Review Carousel to one row with 3 cards and infinite auto-sliding.
- [x] Task: Conductor - User Manual Verification 'Phase 4: Dynamic UI & High-Fidelity Refinements' (Protocol in workflow.md)

## Phase 5: Voice-First Floating Chatbot
Goal: Transform the chatbot into a premium floating voice agent.

- [x] Task: Refactor Chatbot UI from a Drawer to a Floating Component.
- [x] Task: Implement "Conversational Mode" activation via headphone icon.
- [x] Task: Integrate Voice synthesis (greeting) and bidirectional audio visualization.
    - [x] Write Tests: Verify audio visualization components respond to mock audio data.
    - [x] Implement Feature: Connect Gemini Live or specialized voice API.
- [x] Task: Remove technical jargon and "memory activated" messages from the UI.
- [x] Task: Conductor - User Manual Verification 'Phase 5: Voice-First Floating Chatbot' (Protocol in workflow.md)
