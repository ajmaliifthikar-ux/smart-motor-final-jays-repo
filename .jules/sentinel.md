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

### 2026-05-03: Hardcoded API Key Fallbacks
- **Vulnerability:** Hardcoded Gemini API keys were used as fallback values in `process.env.GEMINI_API_KEY || 'AIzaSy...'` throughout the codebase. If the API key is missing from the environment variables, the application would silently use the hardcoded key, exposing it to potential leakage and unauthorized use.
- **Learning:** Developers often add hardcoded keys for temporary testing and forget to remove them, leaving them as fallbacks for environment variables. Even if the application logic relies on the environment variable, the hardcoded fallback is still compiled into the source code and accessible.
- **Prevention:** Never use real API keys as fallback strings in code. If an environment variable is required, the application should securely handle its absence (e.g., throwing a runtime error, defaulting to an empty string `''`, or gracefully disabling the feature) rather than falling back to a hardcoded secret.
