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
## 2024-03-02 - [Remove Hardcoded Gemini API Key]
**Vulnerability:** A hardcoded Gemini API key (`AIzaSy...`) was found directly in the source code in multiple files (`src/lib/gemini-live.ts`, `src/lib/diagnostics.ts`, `src/lib/agents/smart-assistant/agent.ts`, `src/lib/agents/strategy/research-agent.ts`, `src/lib/ai-memory.ts`, `src/app/api/diag/gemini/route.ts`, `src/app/api/admin/seo/analyze/route.ts`).
**Learning:** Hardcoded API keys bypass environment-based configuration and can lead to immediate compromise if the source code is exposed. The fallback string was being used instead of proper error handling for missing configuration. Also, the GoogleGenerativeAI SDK should be initialized inside functions to prevent crashes when the API key is missing.
**Prevention:** Never hardcode secrets in source code. Always use environment variables (`process.env`). If an environment variable is missing, throw a clear error or fail gracefully instead of falling back to a hardcoded string.
