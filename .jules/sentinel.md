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

## 2025-10-27 - Remove Hardcoded Gemini API Key and Enforce Strict Validation
**Vulnerability:** A hardcoded Gemini API key (`AIzaSyD9nwv7J0MXrgk9O5xcBl-ptLBjfIjzxnk`) and empty string fallbacks were being used throughout the codebase to initialize the GoogleGenerativeAI client.
**Learning:** These practices pose critical security risks and can cause SSR rendering crashes or silent failures if the key is missing or invalid. Instantiating clients at the top level with empty strings allows the compiler to pass but causes runtime issues.
**Prevention:** Never hardcode secrets. Always validate environment variables explicitly (e.g., `if (!apiKey) throw new Error(...)`) inside route handlers, constructors, or relevant functions, rather than at the top level.
