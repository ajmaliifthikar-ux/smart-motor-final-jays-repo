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

## 2023-10-27 - Hardcoded Gemini API Key
**Vulnerability:** A hardcoded Gemini API key (`AIzaSy...`) was present as a fallback in multiple files (e.g., `src/app/api/diag/gemini/route.ts`, `src/lib/agents/smart-assistant/agent.ts`). This exposed the key if the environment variable `GEMINI_API_KEY` was not set, allowing unauthorized usage.
**Learning:** Hardcoding sensitive keys or secrets, even as fallbacks, introduces a significant security risk. Secrets should always be securely managed through environment variables or a dedicated secrets manager, and code should fail closed if they are missing.
**Prevention:** Never hardcode API keys or secrets in the source code. Enforce the usage of environment variables and validate their existence at runtime.
