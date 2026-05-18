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
## 2024-05-15 - Hardcoded Environment Variable Fallbacks
**Vulnerability:** Several sensitive endpoints (e.g., cron jobs, setup invitations, internal notifications) used hardcoded strings (e.g., `'smartmotor-cron-secret'`, `'admin-setup-secret'`, `'sm-notify-secret'`) as fallback values using the `||` operator when the corresponding environment variable was missing.
**Learning:** This approach effectively exposes standard authorization tokens directly within the source code, nullifying the security value of having environment variables in the first place, allowing unauthenticated attackers to bypass security checks by providing the known hardcoded string.
**Prevention:** Never use hardcoded secrets as fallback mechanisms for sensitive environment variables in `process.env`. Ensure explicit configuration and implement "fail-closed" logic that denies access if the required secret environment variables are not correctly set.
