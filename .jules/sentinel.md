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

## 2024-06-17 - Hardcoded Gemini API Key Fallback
**Vulnerability:** A hardcoded Gemini API key (`AIzaSyD9nwv7J0MXrgk9O5xcBl-ptLBjfIjzxnk`) was being used as a default fallback value in multiple files (`src/app/api/admin/seo/analyze/route.ts`, `src/app/api/diag/gemini/route.ts`, `src/lib/agents/strategy/research-agent.ts`, `src/lib/agents/smart-assistant/agent.ts`, `src/lib/diagnostics.ts`, `src/lib/ai-memory.ts`, `src/lib/gemini-live.ts`) when the `GEMINI_API_KEY` environment variable was missing.
**Learning:** Hardcoding API keys as fallbacks, even for perceived convenience in development or testing environments, is a critical security vulnerability that leaks secrets directly into the source control and potentially to the client depending on how the code is bundled. It also bypasses proper configuration management.
**Prevention:** Never use hardcoded secrets as fallback values. Always enforce explicit environment variable configuration and implement fail-closed logic (e.g., throwing an error or returning a 500 status) if required secrets are undefined. Additionally, avoid top-level instantiation of clients that require secrets to prevent application startup/build crashes when environment variables are intentionally omitted in certain contexts (like CI/CD).
