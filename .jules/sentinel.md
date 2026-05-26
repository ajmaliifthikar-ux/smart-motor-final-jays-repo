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
## 2025-02-27 - Removed hardcoded API secrets for internal service authorization

**Vulnerability:** Several internal endpoints (e.g., cron jobs, admin invitations, system notifications) allowed for authentication/authorization via hardcoded fallback secrets like `sm-notify-secret`, `smartmotor-cron-secret`, and `admin-setup-secret`. Furthermore, UI elements contained fetch requests that transmitted these hardcoded strings as bearer tokens. If production environment variables are mistakenly left unset, these endpoints effectively default to known/guessable hardcoded keys, completely bypassing security.
**Learning:** Fallback constants in environment variable retrieval (`process.env.SECRET || 'default-secret'`) introduce critical security loopholes in production when standard configuration fails or drifts. They compromise Defense in Depth by ensuring the application fails open rather than failing securely (closed).
**Prevention:** Never use hardcoded fallback secrets in authorization or environment configuration logic. Always enforce a fail-closed behavior: check if the environment secret is defined before performing matching logic, and explicitly verify session tokens if a manual UI fallback is required.
