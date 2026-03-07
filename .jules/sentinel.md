# Sentinel - Security Learnings and Vulnerability Log

## Security Principles

- **Sensitive Data in URLs**: Never send secret keys in URL query parameters, as they can be logged by proxies and servers. Always use the request body (e.g., `application/x-www-form-urlencoded` or `application/json`) for sensitive data.
- **Logging**: Avoid logging full error objects or raw request/response data in production logs (`console.error`), as they may contain PII or secrets. Log safe, high-level error messages instead.
- **Refactoring - Utility Functions**: Extract repeated sensitive logic (like third-party API verification) into a single utility function to ensure consistency and easier security auditing.
- **Testing - Mocking Fetch**: When testing code that makes external API calls (like `fetch`), use `global.fetch` mocking to inspect the request URL and body without making actual network requests. This allows verifying security properties (e.g., "secret is not in URL").

## Fixed Vulnerabilities

### 2026-02-15: Implicit User Enumeration & IDOR in Booking API
- **Vulnerability:** Unauthenticated users could associate bookings with any existing user account by simply providing their email address in the request body.
- **Fix:** Switched to session-based user identification using `await auth()`. Bookings are now only associated with a `userId` if a valid session exists.
- **File:** `src/app/api/bookings/route.ts`
- **Mitigation:** Always use authenticated session data for linking resources to users instead of untrusted request payloads.

## 2026-03-01 - Remove hardcoded fallback secrets from API routes
**Vulnerability:** Several backend API routes (`/api/admin/invitations/send-bulk`, `/api/cron/daily-report`, `/api/notifications/send`, `/api/bookings`, and server action `firebase-auth.ts`) were using hardcoded default secrets (like `sm-notify-secret`, `smartmotor-cron-secret`, `admin-setup-secret`) as a fallback if the corresponding environment variables were not set.
**Learning:** Hardcoding default secrets in the codebase completely bypasses the security mechanism if the application is deployed without properly configuring the environment variables. An attacker aware of these fallback strings could use them to bypass authentication.
**Prevention:** Never use the `|| 'default-secret'` pattern for secrets or API keys. Always fail securely (deny access) if the necessary environment variable is undefined or empty.
