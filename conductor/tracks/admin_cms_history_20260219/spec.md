# Specification: Admin Content & History UI (Inline Editing)

## Overview
This track implements a high-fidelity inline editing experience for the Smart Motor platform. It empowers admins to modify core page sections (Hero, About, Mission) directly on the frontend, with integrated version control to browse and restore historical states. It also includes critical UI fixes for asset pathing in the Booking Form.

## User Stories
- As an **Admin**, I want to toggle "Edit Mode" on the live site so I can see changes in context.
- As an **Admin**, I want to click an "Edit" button on any core section to modify its text, media, CTAs, and layout.
- As an **Admin**, I want to view a history of changes for a specific section and restore it to a previous version with one click.
- As a **User**, I want to see a fallback icon (Google logo) if a brand logo fails to load in the booking form.

## Functional Requirements

### 1. Inline Admin Toolbar & Mode
- Implement a persistent `AdminToolbar` component (visible only to authenticated Firebase admins).
- Add a "Live Edit" toggle that enables/disables editing markers on the page.

### 2. Contextual Editing Menu (Hero, About, Mission)
- Each editable section will feature an "Edit" overlay or floating button in Admin Mode.
- **Menu Options:** 
  - **Edit Content:** Opens a localized form (dialog/popover) to modify:
    - Text (Headings, Subheadings, Body).
    - Media (Image URLs, Background styles).
    - CTAs (Button labels, target links).
    - Visibility (Toggle section on/off).
  - **Browse History:** Opens a list of `ContentHistory` records filtered by that section's ID.

### 3. Version History & Restoration
- Integration with existing `ContentHistory` and `ContentAudit` models.
- "Restore" button for historical snapshots that triggers the `restoreContentSnapshot` server action.
- Real-time UI updates (revalidation) after a restoration.

### 4. UI Fixes
- Update `src/components/sections/booking-form.tsx` to use the correct root path (`/google-logo.svg`) for fallback images.

## Technical Constraints
- **Framework:** Next.js 15 (awaiting async params).
- **Security:** All editing actions MUST be protected by Firebase Admin server-side validation.
- **State:** Use Server Actions for data persistence and `useOptimistic` for smooth UI transitions if applicable.
- **Styling:** Adhere to the "Gold Standard" (Tailwind, glassmorphism, rounded-full buttons).

## Acceptance Criteria
- [ ] Admin can toggle Edit Mode and see "Edit" buttons on Hero, About, and Mission sections.
- [ ] Changing a heading and saving it updates the database and reflects immediately on the site.
- [ ] Admin can open "History" for the Hero section, see a list of previous edits, and restore an older version.
- [ ] The Booking Form displays the Google logo fallback if a brand image is missing.

## Out of Scope
- Drag-and-drop layout reordering.
- Rich text (WYSIWYG) editing (plain text fields/textareas only for now).
- Brand-specific page editing (limited to Home page core sections).
