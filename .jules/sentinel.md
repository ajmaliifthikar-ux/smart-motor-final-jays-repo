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

### 2026-04-20: Hardcoded API Key Fallbacks in Route Handlers
- **Vulnerability:** Several route handlers (`src/app/api/...`) and agents (`src/lib/agents/...`) included a hardcoded fallback string for the `GEMINI_API_KEY` environment variable. While this might have been added to prevent build or initialization errors when the `.env` file is missing, it leaks a sensitive secret directly in the repository code.
- **Fix:** Removed the hardcoded 'AIza...' strings and replaced them with empty string fallbacks (`|| ''`). This ensures the code builds and types correctly (as `GoogleGenerativeAI` expects a string), but relies on the actual runtime `.env` variables to function, preventing any secret leakage.
- **Mitigation:** Never hardcode secret strings like API keys as fallbacks in code, even for debugging or to bypass TypeScript strictness. Always use an empty string (`''`) or throw an explicit error if a required environment variable is missing.
