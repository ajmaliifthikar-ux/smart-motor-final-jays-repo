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

## 2026-02-21 - Hardcoded Gemini API Key
**Vulnerability:** A hardcoded Gemini API key (`AIzaSy...`) was present as a fallback string across multiple files (`route.ts`, `agent.ts`, `diagnostics.ts`, etc.) in the event `process.env.GEMINI_API_KEY` was missing.
**Learning:** Hardcoded fallbacks for API keys in source code are inherently insecure as they are committed to version control and easily exposed. They were likely added for convenience during local development to prevent app crashes when environment variables weren't set. Furthermore, top-level instantiation of clients like `GoogleGenerativeAI` without explicit environment variable validation can lead to silent failures or crashes later in execution.
**Prevention:**
1. Never hardcode secrets in source code, even as fallbacks.
2. Explicitly validate required environment variables before instantiating SDK clients.
3. Throw an explicit error if a required key is missing to ensure the application fails securely and alerts the developer immediately.
4. Move client instantiation inside functions, methods, or constructors rather than top-level module scope to ensure environment variables are loaded before instantiation and to prevent build/startup crashes due to missing variables.
