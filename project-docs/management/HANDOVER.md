# Smart Motor Platform - Handover Documentation

> **Status:** Active Development  
> **Date:** February 14, 2026  
> **Branch:** `dev`

## 1. Project Overview
The Smart Motor Platform is a Next.js (App Router) application built with Tailwind CSS, Prisma, and server-side components. It is currently in **Phase 4: Agentic AI Implementation**.

### Key Infrastructure
-   **Hosting:** GreenGeeks (Shared Hosting / VPS)
-   **Domain:** `smartmotor.ae`
-   **Database:**
    -   **Local:** SQLite (`prisma/dev.db`)
    -   **Production:** MySQL (Hosted on GreenGeeks)

---

## 2. Access & Credentials

### SSH Access (GreenGeeks)
To access the production server, use the SSH keys located in the root `.ssh-keys/` directory.

**Direct Connection Command:**
```bash
chmod 600 .ssh-keys/greengeeks_smartmotor
ssh -i .ssh-keys/greengeeks_smartmotor smartmot@sgp200.greengeeks.net
```

**SSH Config (~/.ssh/config):**
```ssh-config
Host smartmotor-prod
    HostName sgp200.greengeeks.net
    User smartmot
    IdentityFile /path/to/project/.ssh-keys/greengeeks_smartmotor
    IdentitiesOnly yes
```

### Database Access
-   **Production DB Connection:** See `.env.production` for `DATABASE_URL` (MySQL).
-   **Admin User (Web App):**
    -   **URL:** `/admin` or `/auth/signin`
    -   **Email:** `admin@smartmotor.ae`
    -   **Password:** `admin` (Seeded via `prisma/seed.ts`)

### Environment Variables
-   **Local:** `.env` (Configured for SQLite, Gemini API, Redis).
-   **Production:** `.env.production` (Configured for MySQL, Email, Redis Cloud).

---

## 3. Current Status

### Recent Features Implemented
1.  **Email Subscription System** (`src/components/v2/sections/newsletter.tsx`):
    -   Captures emails to `Subscriber` model.
    -   API: `/api/newsletter/subscribe`.
2.  **Booking Coordinator Agent** (`src/lib/agents/booking/coordinator.ts`):
    -   AI agent using Gemini to check availability.
    -   Mock Calendar Tools in `src/lib/tools/calendar-tools.ts`.
3.  **Google Reviews Integration** (`src/components/v2/sections/reviews-carousel.tsx`):
    -   Displays reviews on home page.
    -   Currently using **MOCK DATA** in `src/lib/google-business.ts`. Needs real API key.
4.  **SEO Specialist Agent** (`src/lib/agents/seo/seo-agent.ts`):
    -   Generates blog content and analyzes keywords.
    -   Cron job ready (needs scheduling).

### Active Branch
The core development is on the `dev` branch.
-   **Last Commit:** "feat(dev): System-wide update - Email, SEO, Reviews, Booking Agent"

---

## 4. Next Steps for Next Agent

### immediate Actions
1.  **Deploy to Dev:**
    -   Run `git push origin dev` to trigger the CI/CD pipeline (or manual pull on server).
    -   Verify deployment at `smartmotor.ae/dev` (or configured dev subdomain).
2.  **Verify Database Migration:**
    -   Ensure production database schema is up to date: `npx prisma migrate deploy` (on server).

### Upcoming Features (Roadmap)
1.  **Bi-Directional Voice Chat:**
    -   Objective: Real-time voice interaction for booking.
    -   Status: Not started. See `task.md`.
2.  **Tabby/Tamara Integration:**
    -   Objective: Buy Now, Pay Later payment gateway.
    -   Status: Research phase.
3.  **Real Google Reviews API:**
    -   Objective: Replace mock client with real Google Business Profile API calls.
    -   Status: API Key needed.

## 5. Known Issues / Notes
-   **Google Reviews:** The API client is mocked. You need to provision a real Google Business Profile API key and update `src/lib/google-business.ts`.
-   **SQLite vs MySQL:** Local uses SQLite for speed. Production uses MySQL. Be mindful of raw SQL queries (use Prisma to avoid compatibility issues).
