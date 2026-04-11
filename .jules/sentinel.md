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

### 2026-02-15: Weak Random Number Generation in Passwords
- **Vulnerability:** Used `Math.random()` to generate indices for character sets and applied a biased `sort(() => Math.random() - 0.5)` for array shuffling, making generated passwords predictable and insecure. Additionally, modulo division without rejection sampling introduced modulo bias.
- **Learning:** `Math.random()` is not cryptographically secure and should never be used for security-sensitive operations. To properly fix this while remaining performant, use a single pre-allocated `Uint32Array` mapped via `crypto.getRandomValues()`. Always implement rejection sampling to avoid modulo bias when picking values, and use the Fisher-Yates algorithm for securely shuffling arrays instead of the `sort()` method.
- **Prevention:** Consistently use `globalThis.crypto.getRandomValues()`, rejection sampling, and secure shuffling algorithms (e.g., Fisher-Yates) for any cryptographic or security-related array manipulation and randomization logic.
