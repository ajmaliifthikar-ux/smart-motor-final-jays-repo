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

## 2026-03-24 - Insecure Random Number Generation for Security Tokens
**Vulnerability:** The application used `Math.random()` to generate security-sensitive tokens, backup codes, device IDs, and passwords in `src/lib/password.ts`, `src/lib/totp.ts`, and `src/lib/tokens.ts`. `Math.random()` is not cryptographically secure, leading to predictable token values.
**Learning:** `Math.random()` generates easily predictable pseudo-random values. Replaced it with the Web Crypto API `globalThis.crypto.getRandomValues()` to securely generate values, and replaced the weak `.sort(() => Math.random() - 0.5)` with a secure Fisher-Yates shuffle algorithm.
**Prevention:** Never use `Math.random()` for generating anything security-related (passwords, tokens, codes, device IDs). Always enforce the use of `globalThis.crypto.getRandomValues` or verified libraries like `nanoid()`.
