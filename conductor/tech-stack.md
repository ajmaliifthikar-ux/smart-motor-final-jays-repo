# Technology Stack

## Frontend
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4 (using `@tailwindcss/postcss`)
- **Animations:** Framer Motion
- **UI Components:** Radix UI primitives
- **Icons:** Lucide React

## Backend & API
- **Runtime:** Node.js 22
- **Logic:** Next.js Server Actions & API Routes
- **Caching:** Redis (Upstash / ioredis)
- **Utilities:** date-fns

## Database
- **Primary:** Firestore (`smartmotordb`)
- **Storage:** Firebase Storage (Assets & Logos)
- **Secondary/Legacy:** Prisma 6 (SQLite/MySQL/PostgreSQL)

## Authentication & Security
- **Providers:** NextAuth.js v5 (Beta), Firebase Authentication
- **Integrations:** Firebase Admin SDK
- **Security:** reCAPTCHA v3

## AI & Services
- **AI Core:** Google Generative AI (Gemini SDK)
- **Email:** Resend, Nodemailer
- **Image Processing:** Sharp, Exiftool-vendored
