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

### 2026-02-23 - [Critical] Admin Authentication Bypass
**Vulnerability:** The `verifySession` function in `src/lib/firebase-admin.ts` contained a wildcard check `(decodedToken.email?.endsWith('@smartmotor.ae') ?? false)` that allowed any user with a `@smartmotor.ae` email address to bypass admin authorization checks and access sensitive API routes.
**Learning:** Hardcoded email domain whitelists for privileged access violate the principle of least privilege and create a single point of failure. Role-based access control (RBAC) should rely strictly on verified claims (e.g., Firebase Custom Claims) or database roles.
**Prevention:** Avoid hardcoding user identifiers or domains for authorization. Implement strict RBAC checks based on verified session claims. Use feature flags or database configuration for temporary access overrides if absolutely necessary, but never hardcode them in production logic.
