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

### 2026-02-21: Weak Random Number Generation in Security Contexts
- **Vulnerability:** Weak PRNG (`Math.random()`) was being used for generating passwords, device IDs, short codes, and backup codes. This predictably generated numbers, which could reduce entropy and lead to brute-forcing of security-sensitive values.
- **Learning:** `Math.random()` in JS engines is not cryptographically secure. Relying on it for cryptographic or security-sensitive generation (e.g. passwords, secrets) is a severe flaw, and even "shuffling" via `.sort(() => Math.random() - 0.5)` introduces significant statistical bias.
- **Prevention:** Always use `globalThis.crypto.getRandomValues()` or a secure library like `nanoid` (where appropriate) for any randomness impacting security. Use the Fisher-Yates algorithm with cryptographically secure random values when unbiased shuffling is needed.
