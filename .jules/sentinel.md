## 2026-02-15 - Unauthenticated Admin API Route
**Vulnerability:** The `/api/admin/seo/analyze` endpoint was completely public, allowing anyone to trigger SEO analysis and write to the database. The middleware configuration explicitly excluded `/api` routes from authentication checks.
**Learning:** Middleware matchers can be deceptive. Excluding `/api` for performance or flexibility means EVERY API route must implement its own authentication check, which is easy to forget.
**Prevention:** Ensure all API routes, especially those under `/admin`, have explicit `await auth()` checks at the beginning of the handler. Consider using a higher-order function or a base handler to enforce this.
