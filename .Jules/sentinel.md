## 2026-02-20 - Hardcoded Admin Backdoors
**Vulnerability:** Found explicit code granting `ADMIN` role to any email ending in `@smartmotor.ae` and specifically `admin@smartmotor.ae`, bypassing role verification.
**Learning:** Developers might add "convenience" backdoors during early development (like wildcard email whitelisting) that become critical vulnerabilities if left in production.
**Prevention:** Never use email string matching for authorization. Always rely on signed claims (JWT) or database roles. Enforce "Deny by Default".
