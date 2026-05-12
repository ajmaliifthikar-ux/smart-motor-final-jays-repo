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

## 2025-02-20 - CMS Driven XSS Vulnerability in UI Components
**Vulnerability:** CMS driven titles in UI components (`why-smart-motor.tsx`, `about-snippet.tsx`) were using `dangerouslySetInnerHTML` directly without sanitization, leading to an XSS risk if the CMS input contained malicious scripts or attributes.
**Learning:** Even internal CMS fields rendered via `dangerouslySetInnerHTML` are potential attack vectors if the content editors' inputs aren't sanitized.
**Prevention:** Always use a safe HTML builder or custom sanitization function (like the newly implemented `safeTitle`) when rendering rich text containing user or CMS inputs in React, specifically limiting elements and attributes to expected strict whitelists.
