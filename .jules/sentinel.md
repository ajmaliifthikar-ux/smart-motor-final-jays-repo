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

### 2026-02-21: Default Fallback Secrets in Security Controls
- **Vulnerability:** Important security controls (admin setup, cron job triggering, internal notifications) were falling back to hardcoded default string values (e.g., `admin-setup-secret`, `smartmotor-cron-secret`, `sm-notify-secret`) when their respective environment variables were missing. This defeats the purpose of secrets and could allow unauthorized access if an attacker guesses or discovers the codebase's default fallback strings.
- **Learning:** Developers often add fallback string values like `|| 'secret'` to prevent local dev errors or crashes when env variables are missing. However, this creates a significant security risk if those fallbacks make it into production. Security-critical checks should always "fail closed".
- **Prevention:** Never use hardcoded strings as fallbacks for environment secrets. If a secret is required for authentication or authorization and is not present in the environment, the application should log a configuration error and block the action (fail closed).
