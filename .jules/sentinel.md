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

## 2026-03-28 - Secure Random Number Generation Pattern
**Vulnerability:** Weak random number generation using `Math.random()` was observed in security-sensitive contexts like password generation and Fisher-Yates array shuffling (`generateRandomPassword` in `src/lib/password.ts`). `Math.random()` is not cryptographically secure, and the `.sort(() => Math.random() - 0.5)` pattern is highly biased.
**Learning:** For high-performance and secure random number generation (e.g., when generating random passwords in loops), avoid repeatedly calling `new Uint32Array(1)` inside the loop. Instead, pre-allocate a single appropriately sized `Uint32Array` buffer and iterate through its values using an index pointer. This avoids continuous memory allocations while providing cryptographically secure randomness via `globalThis.crypto.getRandomValues()`.
**Prevention:** Enforce the use of pre-allocated `Uint32Array` with `globalThis.crypto.getRandomValues()` for both character selection and secure Fisher-Yates array shuffling in any security-critical functions. Use `nanoid` for non-shuffling token generation where appropriate.
