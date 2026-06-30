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
## 2025-02-23 - Hardcoded Gemini API Key
**Vulnerability:** A hardcoded Gemini API key (`AIzaSyD9nwv7J0MXrgk9O5xcBl-ptLBjfIjzxnk`) was discovered being used as a fallback across 7 different files (API routes, diagnostic tools, agents).
**Learning:** Hardcoded fallback keys bypass environment configuration controls and represent a severe security risk if the repository is ever made public or compromised, allowing unauthorized API usage and potential credential leakage. Furthermore, initializing SDK clients with secrets at the module scope can lead to application crashes during build time or deployment if environment variables are missing.
**Prevention:** Always rely strictly on environment variables for sensitive credentials (e.g., `process.env.GEMINI_API_KEY`). Ensure SDK clients (like `GoogleGenerativeAI`) are initialized inside route handlers, constructors, or relevant functions, and implement explicit validation that throws a secure error if the required key is missing, adhering to the "fail securely" principle.
