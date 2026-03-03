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
## 2025-02-28 - [Hardcoded Secret Removal]
**Vulnerability:** A hardcoded Google Generative AI API key fallback ('AIzaSy...') was present in multiple files (gemini-live, agents, memory, diagnostics) at the module top-level.
**Learning:** Initializing SDKs with valid-looking fallback secrets bypasses environment variable checks and exposes credentials to source control. Additionally, initializing SDKs at the module top-level without validating `process.env` causes immediate application crashes if the key is missing in production, rather than failing securely at runtime.
**Prevention:** Always validate `process.env.GEMINI_API_KEY` (or relevant secrets) and explicitly throw an error inside functions or class constructors before initializing the SDK. Never commit hardcoded fallback secrets.
