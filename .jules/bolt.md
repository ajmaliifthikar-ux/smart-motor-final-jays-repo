## 2025-02-12 - Caching Intl Formatters
**Learning:** `Intl.NumberFormat` and `Intl.DateTimeFormat` have high parsing and garbage collection overhead. They are frequently used inside render loops or loops formatting data.
**Action:** Always hoist and cache these formatters as module-level constants to avoid repeated instantiation overhead. Also, when running tests or linting requiring dependencies, avoid accidentally staging and committing `pnpm-lock.yaml` if it was only regenerated for verification.
