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

## 2024-10-18 - Hardcoded Fallback Secrets in API Routes
**Vulnerability:** Several server API endpoints (`bookings`, `notifications/send`, `cron/daily-report`, `admin/invitations/send-bulk`) used hardcoded fallback values for environment variables when verifying authorization headers or payload secrets (e.g. `process.env.ADMIN_SETUP_SECRET || 'admin-setup-secret'`). If an environment didn't explicitly define these secrets, any attacker guessing the fallback value could bypass authentication.
**Learning:** Hardcoding default fallback secrets undermines the purpose of environment variables. The fallback value is just as visible in source code as any other hardcoded secret and makes the application insecure by default in production.
**Prevention:** Always fail-closed. If an expected environment variable is missing (`!!process.env.SECRET`), the authorization check should immediately reject the request instead of falling back to a static string.
