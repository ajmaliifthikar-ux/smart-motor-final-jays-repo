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

### 2025-02-17: Insecure Randomness in Password Generation
- **Vulnerability:** The `generateRandomPassword` function in `src/lib/password.ts` used `Math.random()` for character selection and array shuffling, which is cryptographically insecure and predictable. Furthermore, the `Array.prototype.sort()` method combined with `Math.random()` was used for shuffling, which is engine-dependent and biased.
- **Fix:** Implemented a cryptographically secure random index generator using `globalThis.crypto.getRandomValues()` with a `Uint32Array` buffer and rejection sampling to eliminate modulo bias. Replaced the insecure shuffle with a proper Fisher-Yates algorithm using the secure random index generator.
- **File:** `src/lib/password.ts`
- **Mitigation:** Never use `Math.random()` for security-sensitive values. Always use `globalThis.crypto.getRandomValues()` or a secure library like `nanoid`. When mapping random integers to character set indices, implement rejection sampling. For shuffling arrays securely, implement the Fisher-Yates algorithm.
