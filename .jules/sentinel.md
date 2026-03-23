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

### 2025-02-23: Insecure Random Number Generation (CWE-338)
- **Vulnerability:** Security-sensitive values (passwords, backup codes, device IDs) were being generated using `Math.random()`, which is not cryptographically secure and can be predictable.
- **Learning:** Standard PRNGs are insufficient for security contexts. The app-specific pattern of using `.sort(() => Math.random() - 0.5)` for shuffling characters or generating backup codes created significant cryptographic weaknesses.
- **Prevention:** Always use cryptographically secure random number generators (CSPRNG). Use `globalThis.crypto.getRandomValues()` along with Fisher-Yates for shuffling, and `nanoid` (or `nanoid`'s `customAlphabet`) for generating string-based identifiers and tokens.
