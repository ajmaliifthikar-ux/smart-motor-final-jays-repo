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

### 2025-02-28: Insecure Random Generation for Security Tokens
- **Vulnerability:** Used `Math.random()` to generate TOTP backup codes and device IDs. `Math.random()` is not cryptographically secure and its outputs can be predicted, potentially allowing attackers to guess backup codes and bypass 2FA.
- **Learning:** `Math.random()` should never be used for security-sensitive operations. Additionally, simply mapping a random value modulo a character set's length introduces modulo bias, making some characters appear more frequently than others.
- **Prevention:** Always use `globalThis.crypto.getRandomValues()` for generating random values intended for security. Implement rejection sampling to map random numbers to a character set without modulo bias. Use a pre-allocated buffer (e.g., `Uint32Array`) and fetch values in bulk for better performance.
