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
## 2024-05-24 - Fix Insecure Password Generation
**Vulnerability:** The `generateRandomPassword` function used `Math.random()` to pick characters and `.sort(() => Math.random() - 0.5)` to shuffle passwords. `Math.random()` is not cryptographically secure and the sort-based shuffle is heavily biased.
**Learning:** Common utility functions that look correct often rely on insecure primitives. Array shuffling using sort introduces significant bias in JavaScript, making some permutations far more likely. Additionally, creating single-element arrays for crypto in a loop adds unnecessary overhead compared to instantiating a single buffer and indexing through it.
**Prevention:** Always use `globalThis.crypto.getRandomValues()` for security-sensitive logic and a secure Fisher-Yates algorithm for unbiased shuffling. Pre-allocate buffer sizes efficiently.
