# Implementation Plan: Code Review Optimization & Robustness

## Phase 1: Next.js 15 Compatibility
Goal: Ensure dynamic routes correctly handle asynchronous parameters as required by Next.js 15+.

- [ ] Task: Update `src/app/brand/[slug]/page.tsx` to await `params`.
    - [ ] Write Tests: Verify that the `BrandPage` component handles the async `params` Promise correctly.
    - [ ] Implement Feature: Refactor the component to destructure `slug` from the awaited `params`.
- [ ] Task: Conductor - User Manual Verification 'Phase 1: Next.js 15 Compatibility' (Protocol in workflow.md)

## Phase 2: Immutable Content Restoration
Goal: Fix the content restoration logic to target immutable record IDs instead of mutable slugs.

- [ ] Task: Modify `updateService` and `updateBrand` server actions to use `id` as the `ContentHistory` key.
    - [ ] Write Tests: Verify that new history snapshots store the model's `id`.
    - [ ] Implement Feature: Update `src/actions/cms-actions.ts` to use `id` for historical tracking.
- [ ] Task: Update `restoreContentVersion` to support ID-based lookups for Services and Brands.
    - [ ] Write Tests: Verify that a restoration succeeds even if the current record's slug has changed.
    - [ ] Implement Feature: Refactor the restoration logic in `src/actions/cms-actions.ts`.
- [ ] Task: Create and run a one-time migration script to update legacy `ContentHistory` keys.
    - [ ] Write Tests: Verify the migration script correctly maps existing slugs to their respective IDs.
    - [ ] Implement Feature: Develop `scripts/migrate-history-keys.ts` and execute it.
- [ ] Task: Conductor - User Manual Verification 'Phase 2: Immutable Content Restoration' (Protocol in workflow.md)

## Phase 3: UI & Auth Robustness
Goal: Correct asset paths and enhance authentication error reporting.

- [ ] Task: Fix the fallback image path in `BookingForm`.
    - [ ] Write Tests: Verify the image `src` evaluates to `/google-logo.svg` (correct root path).
    - [ ] Implement Feature: Update `src/components/sections/booking-form.tsx`.
- [ ] Task: Add environment variable validation in `src/auth.ts`.
    - [ ] Write Tests: Verify that a descriptive error is logged when `NEXT_PUBLIC_FIREBASE_API_KEY` is missing.
    - [ ] Implement Feature: Add configuration guard clauses to the `authorize` callback.
- [ ] Task: Conductor - User Manual Verification 'Phase 3: UI & Auth Robustness' (Protocol in workflow.md)

## Phase 4: API Error Handling & Resilience
Goal: Improve the resilience of AI chat interactions with better error boundaries.

- [ ] Task: Enhance error handling in `AIChatPanel`'s `handleSend` function.
    - [ ] Write Tests: Mock non-OK API responses and verify that specific error messages are displayed.
    - [ ] Implement Feature: Update `src/components/ui/ai-chat-panel.tsx` to handle HTTP error status codes.
- [ ] Task: Conductor - User Manual Verification 'Phase 4: API Error Handling & Resilience' (Protocol in workflow.md)
