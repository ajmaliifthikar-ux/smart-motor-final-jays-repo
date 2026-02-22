## 2024-05-23 - Intl Formatter Instantiation Overhead
**Learning:** `Intl.NumberFormat` and `Intl.DateTimeFormat` are expensive to instantiate. The `src/lib/utils.ts` utility functions (`formatPrice`, `formatDate`) were re-instantiating these on every call, causing significant overhead in list renders (e.g., `UserTable`, `RecentActivity`).
**Action:** Always hoist `Intl` formatters to the module scope if the configuration is static. Use a module-level constant or a memoized factory if locale/options vary dynamically.
