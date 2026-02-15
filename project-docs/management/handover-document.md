# Smart Motor Platform - Deployment Handover Document

## 1. Executive Summary
The Smart Motor platform has been migrated to a robust CI/CD pipeline on GitHub. Due to severe firewall restrictions at GreenGeeks (blocking SSH/Rsync from GitHub Actions) and the "too many small files" limitation of traditional FTP for Next.js, we have implemented a **custom Zipped FTP Deployment strategy**. This bypasses all connectivity issues while maintaining speed and reliability.

## 2. CI/CD Architecture (The Pivot)
We transitioned from FTP -> SSH/Rsync -> **Zipped FTP**.

### Components:
1.  **Build Step**: Next.js is configured for `output: 'standalone'` in `next.config.js`.
2.  **Staging Step**: Artifacts (`.next/standalone`, `.next/static`, `public`) are gathered into a `deploy/` directory and compressed into `deploy.zip`.
3.  **Flat Sync**: The `deploy.zip` and a PHP helper `extract.php` are moved to a flat `upload-staging/` folder and synchronized via FTP.
4.  **Remote Extraction**: A GitHub Action step triggers `curl` to call `https://smartmotor.ae/extract.php?key={{secret}}`, which extracts the zip and self-deletes for security.

### Key Files:
- [deploy-production.yml](file:///.github/workflows/deploy-production.yml): Production workflow (main branch).
- [deploy-development.yml](file:///.github/workflows/deploy-development.yml): Development workflow (dev branch).
- [extract.php](file:///scripts/extract.php): The extraction helper (handled via force-add to Git).

## 3. Environment & Modules
- **AI Engine**: Upgraded to **Gemini 3.0 Flash**. Model is dynamically referenced via `GEMINI_MODEL`.
- **Memory (Redis)**: Connected to **Redis Cloud (AWS/UAE)**. Verified via `scripts/test-redis-standalone.ts`.
- **Email**: Configured for `notifications@smartmotor.ae` using SMTP. Verified via `scripts/test-email.ts`.
- **Database**: Prisma/PostgreSQL (configured via `DATABASE_URL` in secrets).

## 4. Operational Status & Monitoring
### Live URLs:
- **Production**: [smartmotor.ae](https://smartmotor.ae)
- **Development**: [smartmotor.ae/dev](https://smartmotor.ae/dev)

### Active Deployment Tracking:
- **Dev Run**: [21971355594](https://github.com/smartmotorae/smart-motor-v2/actions/runs/21971355594) - This is the corrected Zipped FTP run.
- **Production Run**: Triggered after the latest push to `main`.

## 5. Secrets Management
All credentials have been synchronized to **GitHub Secrets**:
- `FTP_SERVER`, `FTP_USERNAME`, `FTP_PASSWORD`
- `SSH_HOST`, `SSH_USER`, `SSH_PORT`, `SSH_PRIVATE_KEY`
- `DATABASE_URL`, `REDIS_HOST`, `REDIS_PORT`, `REDIS_PASSWORD`
- `GEMINI_API_KEY`, `GEMINI_MODEL`
- `DEPLOY_AUTH_KEY` (Used for `extract.php`)

## 6. Handover: Immediate Next Steps
1.  **Monitor Runs**: Ensure Development Run `21971355594` and the latest Production run complete the "Remote Extract" step.
2.  **Verify Content**: Run `npx ts-node scripts/verify-deployment.ts` once runs are green.
3.  **Cleanup**: The `extract.php` script self-deletes upon successful extraction; however, verify that `deploy.zip` and `extract.php` are gone from the server root.
4.  **Scaling**: If the site returns a 500 error, check the `.env` file on the server. The standalone build expects environment variables to be baked in or provided via the environment.

---
**Prepared by**: Antigravity (Google Deepmind)
**Date**: Feb 13, 2026
