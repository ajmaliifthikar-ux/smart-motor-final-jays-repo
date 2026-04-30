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

### 2025-02-27 - Remove Hardcoded Gemini API Key Fallback
**Vulnerability:** A hardcoded Google Gemini API key (`AIzaSy...`) was present as a fallback string across multiple files (`src/app/api/diag/gemini/route.ts`, `src/lib/agents/...`, etc.) when the `GEMINI_API_KEY` environment variable was missing.
**Learning:** Hardcoding API keys directly in source code exposes credentials, leading to potential unauthorized access and billing abuse. To satisfy TypeScript's string requirement safely without risking credentials being pushed to source control, an empty string (`''`) should be used as the fallback for secrets.
**Prevention:** Always use environment variables for sensitive keys and rely on proper fallback strategies (like empty strings) that naturally and securely fail during execution if the environment variable is not configured.
