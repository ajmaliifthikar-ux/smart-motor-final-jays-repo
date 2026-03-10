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
## 2025-02-28 - Insecure Random Number Generation

**Vulnerability:** Found `Math.random()` being used to generate passwords, device IDs, short codes, and backup codes across `src/lib/password.ts`, `src/lib/totp.ts`, and `src/lib/tokens.ts`. Additionally, array shuffling in `password.ts` used `.sort(() => Math.random() - 0.5)` which is cryptographically biased.
**Learning:** `Math.random()` is not a CSPRNG (Cryptographically Secure Pseudo-Random Number Generator) and its state can be predicted, compromising generated secret tokens and passwords. The array sort method bias can drastically reduce the entropy of a password.
**Prevention:** Always use Node.js's built-in `crypto.randomInt` (or equivalent CSPRNG) for generating security-sensitive materials. Ensure unbiased shuffling using standard algorithms like Fisher-Yates powered by `crypto`.
