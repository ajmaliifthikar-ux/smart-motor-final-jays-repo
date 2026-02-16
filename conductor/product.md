# Initial Concept
Smart Motor Platform: The "Gold Standard" in luxury automotive care. A high-end digital ecosystem built with Next.js, Prisma, and Agentic AI, featuring Firebase-integrated admin security and a robust, data-driven booking experience.

# Product Vision
To provide an uncompromising luxury service experience. This involves transitioning from static data to a fully dynamic, database-backed platform where every interaction—from brand exploration to AI-powered voice conversations—feels premium, seamless, and technically superior.

# Target Audience
- **Luxury & Performance Owners:** Demanding perfection and ease of use.
- **Corporate Fleet Managers:** Requiring reliability and data-driven maintenance.
- **Classic Car Collectors:** Needing specialized care and heritage documentation.

# Core Features
- **Robust Multi-Step Booking:** A fully functional, reliable booking flow that successfully handles vehicle selection (Brand/Model) and service details, fetching all data dynamically from the database.
- **Firebase Admin Authentication:** A secure admin panel fully integrated with Firebase Auth for robust identity management and access control.
- **Dynamic Brand & Service Catalog:** A seeded database (migrated from `data.tsx`) powering brand-specific pages, the "Under One Roof" service section, and the brand-logo hero carousel.
- **Agentic Floating Chatbot:** A beautiful, non-intrusive floating chatbot (not a drawer) with a dedicated "Conversational Mode" (headphone icon).
- **Voice-First AI Experience:** Bi-directional voice interaction with audio visualization for both user and AI, removing technical jargon (like "memory activated") for a cleaner interface.
- **Premium UI Components:** Infinite auto-sliding carousels (e.g., for reviews, limited to 3 cards per row) and high-fidelity brand pickers with refined theming.

# Technical Goals
- **Data Migration:** Seed the database with all services, car models, and brand data currently stored in static files.
- **Component Refactoring:** Ensure all components (Booking Form, Brand Picker, Service Cards) fetch live data from the database rather than hardcoded constants.
- **UX Refinement:** Fix "damaged" UI elements and ensure smooth transitions between booking sections.
