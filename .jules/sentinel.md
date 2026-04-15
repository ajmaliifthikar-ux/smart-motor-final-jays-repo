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

### 2026-02-15: Insecure Random Number Generation for Password Generation
- **Vulnerability:** `src/lib/password.ts` used the cryptographically insecure `Math.random()` combined with modulo arithmetic to pick random characters for passwords, and used `Array.prototype.sort(() => Math.random() - 0.5)` for shuffling. These methods introduce significant bias and predictability, making generated passwords vulnerable to brute-force attacks.
- **Learning:** `Math.random()` should never be used for any security-sensitive operations. `Array.prototype.sort()` with a random comparator is not a uniform shuffle and is engine-dependent. Furthermore, simple modulo arithmetic with random numbers introduces modulo bias when the character set size is not a power of 2.
- **Prevention:** Always use `globalThis.crypto.getRandomValues()` for secure random number generation. When mapping random integers to an array index, implement rejection sampling to eliminate modulo bias. Use the Fisher-Yates shuffle algorithm instead of sorting with a random comparator.
