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

### 2025-02-28: Authorization Bypass via Hardcoded Admin Setup Secret
- **Vulnerability:** The API endpoint for sending bulk admin invitations (`/api/admin/invitations/send-bulk`) used a hardcoded fallback value (`'admin-setup-secret'`) if the `ADMIN_SETUP_SECRET` environment variable was not set. This created a backdoor allowing anyone knowing the fallback secret to bypass the super-admin authorization check simply by sending `Bearer admin-setup-secret` if the env var was missing in any deployed environment.
- **Learning:** Hardcoded secrets, even as fallbacks for missing environment variables, pose a severe risk of creating undocumented backdoors. If an environment is misconfigured, it should fail securely rather than degrade to a known, insecure default.
- **Prevention:** Remove fallback values for sensitive secrets (`process.env.SECRET || 'fallback'`). Instead, explicitly check if the environment variable is truthy (`process.env.SECRET && authHeader === \`Bearer \${process.env.SECRET}\``) or throw an error on startup if required secrets are missing.
