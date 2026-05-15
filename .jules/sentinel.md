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

### 2026-02-15: Hardcoded Gemini API Key Exposure
- **Vulnerability:** A hardcoded Gemini API key (`AIzaSyD9nwv7J0MXrgk9O5xcBl-ptLBjfIjzxnk`) was discovered across multiple application source files (e.g., `diagnostics.ts`, `route.ts` files, agents) as well as documentation markdown files.
- **Learning:** Hardcoding credentials within application source code creates a severe security risk by embedding sensitive secrets directly in version control. These keys can easily be discovered and misused, potentially leading to unauthorized API usage or data breaches. Top-level instantiation of third-party clients (like `GoogleGenerativeAI`) with fallback credentials can also cause application startup crashes if the required environment variable is not provided in a secure deployment environment.
- **Prevention:** Always provide secrets dynamically using environment variables (`process.env`). Never commit raw keys to version control. When falling back to missing keys, prefer lazy instantiation inside functions or request handlers so that missing keys only fail gracefully during execution rather than bringing down the entire server on startup. Documentation should refer to keys as `[REDACTED]` or securely reference standard environment variables.
