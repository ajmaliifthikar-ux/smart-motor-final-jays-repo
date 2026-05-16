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

### 2026-02-15: Hardcoded Fallback Secrets Exposing Endpoints
- **Vulnerability:** Several endpoints and internal APIs (`/api/admin/invitations/send-bulk`, `/api/cron/daily-report`, `/api/notifications/send`) used hardcoded fallback secrets (e.g., `process.env.ADMIN_SETUP_SECRET || 'admin-setup-secret'`). An attacker aware of these defaults could bypass authorization and access sensitive administrative functions or trigger unauthorized internal operations.
- **Learning:** Relying on hardcoded default strings in place of proper environment variables creates systemic vulnerabilities, as defaults are often committed to version control and publicly known. Secrets must be explicitly provided in the environment.
- **Prevention:** Remove fallback values for secrets in the codebase. If an environment variable is missing, the application should fail securely (deny access or throw an error) instead of falling back to an insecure default.

### 2026-02-15: Exposing Backend Secrets via Client Environment Variables
- **Vulnerability:** While refactoring hardcoded secrets, an initial attempt considered exposing a backend API secret (like `CRON_SECRET`) to the client using the `NEXT_PUBLIC_` prefix (e.g., `NEXT_PUBLIC_CRON_SECRET`) so the frontend could use it in a `fetch` header.
- **Learning:** Using `NEXT_PUBLIC_` bundles the environment variable into the public client-side JavaScript. This exposes the secret to any user who inspects the code, completely defeating the purpose of the secret and allowing unauthorized execution of sensitive endpoints.
- **Prevention:** Client-side code must never handle or transmit raw backend secrets. When the frontend needs to trigger a protected backend action, it should rely on secure session management (e.g., HTTP-only cookies and session verification) rather than passing shared secrets.
