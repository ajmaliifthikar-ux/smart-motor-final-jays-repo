
## 2026-06-09 - Intl Object Instantiation Overhead
**Learning:** `Intl` objects (like `Intl.NumberFormat` and `Intl.DateTimeFormat`) or computing values via `.resolvedOptions()` introduce significant parsing and garbage collection overhead if repeatedly instantiated inside frequently called functions (e.g. utility formatters) or render loops (e.g. React list rendering).
**Action:** Always hoist `Intl` objects and expensive `.resolvedOptions()` calls to module-scope constants when possible, allowing them to be cached and reused across function executions without recreating the parsing tree.
