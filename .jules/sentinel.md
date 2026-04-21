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

### 2026-04-21: Predictable Tokens via Insecure Math.random() Usage
- **Vulnerability:** Several security-sensitive token generators (`generateBackupCodes`, `generateDeviceId`, `generateShortCode`, `generateRandomPassword`) used `Math.random()`, which is cryptographically insecure and predictable, making tokens guessable. Array shuffling for passwords also relied on `.sort(() => Math.random() - 0.5)` which is engine-dependent and heavily biased.
- **Learning:** Developers often reach for `Math.random()` by default without considering its cryptographic insecurity for things like backup codes, temporary passwords, and secure tokens.
- **Prevention:** Always use `globalThis.crypto.getRandomValues()` for security-sensitive entropy. When mapping bytes to alphabets, always implement rejection sampling to eliminate modulo bias. Use a cryptographically secure Fisher-Yates algorithm for shuffling arrays.
