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

### 2026-02-16 - Hardcoded Authentication Bypass
**Vulnerability:** A development backdoor allowed full administrative access by setting a specific hardcoded session cookie (`mock-token-secret-123`), bypassing all authentication checks in `src/lib/firebase-admin.ts`.
**Learning:** Development convenience features (like "mock login" buttons) can accidentally be left in production-ready code if not strictly guarded by build flags or environment variables. The bypass was also exposed via a UI button in `src/app/auth/page.tsx`.
**Prevention:** Never commit hardcoded bypass tokens. Use dedicated test environments with seeded data instead of inline mock logic. If mock logic is necessary for local dev, ensure it is stripped out by the build process or strictly guarded by `process.env.NODE_ENV === 'development'`.
