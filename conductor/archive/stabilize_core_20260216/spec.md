# Track Specification: Stabilize Core Systems & Dynamic Data Migration

## Overview
This track focuses on transitioning the Smart Motor Platform from a partially static prototype to a robust, database-driven application. The primary goals are to fix the broken booking flow, implement secure Firebase-backed admin authentication, and ensure all brand and service data is dynamically served from the database.

## Objectives
- **Data Integrity:** Migrate all static data from `data.tsx` and other constants into the Prisma-managed SQLite database.
- **Reliable Booking:** Ensure the multi-step booking form is fully functional, specifically fixing the brand/model selection and data-fetching bottlenecks.
- **Secure Access:** Implement a production-ready authentication flow for the admin panel using Firebase Admin.
- **Enhanced UI/UX:** Refine the brand picker, hero carousel, and "Under One Roof" sections to fetch live data and match the "Gold Standard" aesthetic.
- **Voice-First AI:** Transition the chatbot from a drawer to a floating UI with bi-directional voice capabilities and visualization.

## Success Criteria
- [ ] Admin users can log in using Firebase credentials with a session managed by NextAuth.
- [ ] The booking form successfully completes a submission from first step to final confirmation without UI "stuck" states.
- [ ] The Home page carousel and "Under One Roof" section render data exclusively from the database.
- [ ] Brand-specific pages (`/brand/[slug]`) are dynamic and show correct heritage/service information.
- [ ] The chatbot floats, greets via voice on activation, and displays audio visualization.

## Technical Details
- **Database:** Prisma with SQLite.
- **Auth:** Firebase Admin SDK integrated with NextAuth.js.
- **Data Source:** Primary migration source is `src/lib/data.ts` (or `data.tsx`).
- **Components to Fix:** `BookingForm`, `BrandPicker`, `ServiceCard`, `HeroCarousel`, `Chatbot`.
