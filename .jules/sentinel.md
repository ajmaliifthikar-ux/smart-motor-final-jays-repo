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

## 2026-05-30 - Fix Google Places API Key Exposure
**Vulnerability:** The backend API key `GOOGLE_PLACES_API_KEY` was being directly appended to Google Maps photo URLs (`photoUrls` array) and returned to the frontend via the `/api/google/reviews` endpoint. This exposed a critical backend secret directly to client-side code and user browsers.
**Learning:** Third-party APIs that require backend keys for image fetching (like Google Places photos) must be proxied through the server rather than exposing the direct URL and key to the frontend.
**Prevention:** Implement a server-side proxy endpoint (e.g., `/api/google/photo`) that takes necessary parameters (like a photo reference) and securely appends the API key backend-side before making the request and forwarding the response buffer to the client.
