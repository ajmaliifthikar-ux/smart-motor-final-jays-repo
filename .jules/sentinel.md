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

## 2026-02-20 - XSS Vulnerability in dangerouslySetInnerHTML
**Vulnerability:** CMS-driven UI content was being injected directly into `dangerouslySetInnerHTML` without any sanitization in the `why-smart-motor.tsx` and `about-snippet.tsx` components.
**Learning:** Raw input must never be trusted. Custom regex sanitizers are notoriously fragile, easily bypassed, and prone to breaking intended UI styles (e.g., stripping `class=` when expecting JSX `className=`).
**Prevention:** Always use established, battle-tested security libraries like `isomorphic-dompurify` to sanitize HTML output before rendering it in React. `isomorphic-dompurify` ensures the sanitization is executed securely and identically across both Node.js (SSR) and client browser environments.
