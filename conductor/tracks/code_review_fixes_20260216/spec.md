# Track Specification: Code Review Optimization & Robustness

## Overview
This track addresses several technical and architectural improvements identified during the code review of the CMS and AI Agent swarm. The focus is on Next.js 15 compatibility, reliable content restoration, and enhanced UI/Auth robustness.

## Functional Requirements
- **Next.js 15 Compatibility:** Await `params` in `src/app/brand/[slug]/page.tsx` to prevent runtime errors.
- **Immutable Content Restoration:** 
    - Update `updateService` and `updateBrand` actions to use immutable `id` as the `key` in `ContentHistory`.
    - Modify `restoreContentVersion` to lookup by ID for Services and Brands.
    - Perform a one-time database migration/cleanup to sync existing history keys with IDs.
- **UI/Asset Robustness:** Correct the fallback image path in `BookingForm` by removing the `/public` prefix.
- **Auth Resilience:** Add environment variable validation in `src/auth.ts` to provide clearer feedback on missing Firebase configuration.
- **API Error Handling:** Implement better error boundaries and response validation in `AIChatPanel` for AI interactions.

## Success Criteria
- [ ] `BrandPage` renders correctly without Next.js async param warnings.
- [ ] Content restoration works reliably even if a brand or service slug has changed.
- [ ] All images in the booking form load correctly.
- [ ] AI chat provides specific error messages on network failure.
