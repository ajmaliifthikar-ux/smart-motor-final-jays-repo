# Implementation Plan: Admin Content & History UI (Inline Editing)

## Phase 1: Admin Infrastructure & Toolbar
Goal: Establish the global "Edit Mode" state and the secure Admin Toolbar.

- [x] Task: Create a `useAdminMode` hook or context for global state management. (3067b98)
    - [ ] Write Tests: Verify that "Edit Mode" defaults to false and can be toggled.
    - [ ] Implement Feature: Develop the state provider and hook.
- [~] Task: Build the `AdminToolbar` component with an "Edit Mode" toggle.
    - [ ] Write Tests: Verify the toolbar only renders for authenticated Firebase admins.
    - [ ] Implement Feature: Create a floating `AdminToolbar` with a toggle switch.
- [ ] Task: Fix the fallback image path in `BookingForm`.
    - [ ] Write Tests: Verify the image `src` evaluates to `/google-logo.svg`.
    - [ ] Implement Feature: Update `src/components/sections/booking-form.tsx`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Admin Infrastructure & Toolbar' (Protocol in workflow.md)

## Phase 2: Contextual Section Editing
Goal: Implement the "Edit" overlays and forms for Hero, About, and Mission sections.

- [ ] Task: Create a reusable `SectionEditor` wrapper component with a contextual menu.
    - [ ] Write Tests: Verify the "Edit" button only appears when `isAdminMode` is true.
    - [ ] Implement Feature: Build the overlay UI with "Edit Content" and "Browse History" options.
- [ ] Task: Build the "Edit Content" form (Dialog) for section metadata.
    - [ ] Write Tests: Verify form validation for text, media URLs, and CTA fields.
    - [ ] Implement Feature: Create a Radix-based Dialog with fields for Headings, Subheadings, Media, and CTAs.
- [ ] Task: Integrate `updateContentWithAudit` action with the frontend forms.
    - [ ] Write Tests: Verify that saving the form triggers a successful database update and revalidation.
    - [ ] Implement Feature: Connect the "Save" button to the existing CMS server actions.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Contextual Section Editing' (Protocol in workflow.md)

## Phase 3: Version History & Restoration UI
Goal: Build the interface to browse and restore historical content states.

- [ ] Task: Build the `HistoryViewer` component to list versions for a specific section.
    - [ ] Write Tests: Verify the component fetches and displays `ContentHistory` records for a given section ID.
    - [ ] Implement Feature: Create a list view showing timestamp, author (from audit log), and a "Preview/Restore" action.
- [ ] Task: Implement the "Restore" functionality with real-time feedback.
    - [ ] Write Tests: Verify that clicking "Restore" triggers `restoreContentSnapshot` and updates the UI.
    - [ ] Implement Feature: Connect the restore button and add a loading/success state.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: Version History & Restoration UI' (Protocol in workflow.md)

## Phase 4: Section Polishing & Visibility Toggles
Goal: Implement layout options and visibility controls for core sections.

- [ ] Task: Add "Visibility" and "Layout" toggles to the Section Editor.
    - [ ] Write Tests: Verify that toggling visibility hides the section for non-admin users.
    - [ ] Implement Feature: Add "Show/Hide" and "Theme (Light/Dark/Glass)" options to the editing forms.
- [ ] Task: Final Polish & "Gold Standard" Audit.
    - [ ] Write Tests: Ensure 100% of new UI components are keyboard and screen-reader accessible.
    - [ ] Implement Feature: Refine animations (Framer Motion) and responsive styles for all admin tools.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: Section Polishing & Visibility Toggles' (Protocol in workflow.md)
