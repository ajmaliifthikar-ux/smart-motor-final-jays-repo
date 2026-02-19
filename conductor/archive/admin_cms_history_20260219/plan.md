# Implementation Plan: Admin Content & History UI (Inline Editing)

## Phase 1: Admin Infrastructure & Toolbar [checkpoint: 5aa9306]
Goal: Establish the global "Edit Mode" state and the secure Admin Toolbar.

- [x] Task: Create a `useAdminMode` hook or context for global state management. (3067b98)
- [x] Task: Build the `AdminToolbar` component with an "Edit Mode" toggle. (d91207d)
- [x] Task: Refactor for Pure Firebase: Remove NextAuth and use Firebase Auth directly. (d91207d)
- [x] Task: Fix the fallback image path in `BookingForm`. (dc4c9b4)
- [x] Task: Conductor - User Manual Verification 'Phase 1: Admin Infrastructure & Toolbar' (5aa9306)

## Phase 2: Contextual Section Editing
Goal: Implement the "Edit" overlays and forms for Hero, About, and Mission sections.

- [x] Task: Create Firestore CMS utility (`src/lib/firebase-cms.ts`) for `ContentBlock` & `ContentHistory`. (Manual verification via implementation)
- [x] Task: Create a reusable `SectionEditor` wrapper component with a contextual menu. (d86c361)
    - [ ] Write Tests: Verify the "Edit" button only appears when `isAdminMode` is true.
    - [ ] Implement Feature: Build the overlay UI with "Edit Content" and "Browse History" options.
- [x] Task: Build the "Edit Content" form (Dialog) for section metadata. (7e4c535)
    - [ ] Write Tests: Verify form validation for text, media URLs, and CTA fields.
    - [ ] Implement Feature: Create a Radix-based Dialog with fields for Headings, Subheadings, Media, and CTAs.
- [x] Task: Integrate `updateContentBlock` with the frontend forms. (edbe790)
    - [ ] Write Tests: Verify that saving the form triggers a successful database update and revalidation.
    - [ ] Implement Feature: Connect the "Save" button to the Firestore CMS utility.
- [x] Task: Conductor - User Manual Verification 'Phase 2: Contextual Section Editing' (a5e2587)

## Phase 3: Version History & Restoration UI
Goal: Build the interface to browse and restore historical content states.

- [x] Task: Build the `HistoryViewer` component to list versions for a specific section. (4138a44)
- [x] Task: Implement the "Restore" functionality with real-time feedback. (4138a44)
- [x] Task: Conductor - User Manual Verification 'Phase 3: Version History & Restoration UI' (4138a44)

## Phase 4: Section Polishing & Visibility Toggles
Goal: Implement layout options and visibility controls for core sections.

- [x] Task: Add "Visibility" and "Layout" toggles to the Section Editor. (98f290b)
- [x] Task: Final Polish & "Gold Standard" Audit. (10e65b7)
- [x] Task: Conductor - User Manual Verification 'Phase 4: Section Polishing & Visibility Toggles' (10e65b7)
