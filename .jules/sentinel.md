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

### 2026-02-16: Hardcoded API Key & Application Startup Crashes
- **Vulnerability:** The Google Gemini API key was hardcoded as a fallback string (`process.env.GEMINI_API_KEY || 'AIzaSy...'`) and instantiated globally at the module level.
- **Learning:** Hardcoding secrets exposes them to source control. However, when replacing them with strict environment variable checks, if the global instantiation is kept (e.g. `const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)`), the application will instantly crash on startup if the key is missing in any environment (like CI/CD or local dev) because the module is evaluated immediately upon import.
- **Prevention:** Always remove hardcoded secrets. When enforcing environment variable presence, wrap the instantiation in lazy initialization blocks or move it inside the request handlers/class methods. This ensures the application can still boot and only fails securely when the specific protected feature is actively requested.
