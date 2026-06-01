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

## 2025-02-27 - Remove Hardcoded Gemini API Keys and Ensure Lazy Initialization
**Vulnerability:** A hardcoded Gemini API key (`AIzaSyD9nwv7J0MX...`) was found as a fallback value (`process.env.GEMINI_API_KEY || 'AIzaSyD9nwv7J0MX...'`) in multiple files including API routes, agents, diagnostic tools, and Markdown documentation, creating a significant security risk of leaking the service key. Additionally, some external API clients (`GoogleGenerativeAI`) were being initialized at the module's top level, meaning if the environment variable was missing (after removing the fallback), the application would throw an error and crash on startup.
**Learning:** Hardcoded fallbacks in source code and documentation expose production secrets to anyone with repository access. Furthermore, top-level instantiation of third-party clients without proper error handling or relying on fallbacks leads to brittle applications that crash at boot when environment keys are properly secured but absent.
**Prevention:** Always enforce explicit environment variable configuration (`process.env.GEMINI_API_KEY`) without hardcoded fallback strings. For client libraries requiring secrets, use lazy initialization (e.g., inside request handlers, constructors, or generator functions) so that missing keys result in graceful API failures (like a 500 status code) rather than crashing the entire Node.js/Next.js application on startup. Also, ensure API keys are redacted in all project documentation.
