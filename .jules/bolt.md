## 2024-05-15 - Intl Formatter Initialization Overhead
**Learning:** Instantiating `Intl` objects (like `Intl.NumberFormat` and `Intl.DateTimeFormat`) is computationally expensive and causes measurable overhead when executed inside loops or frequently rendered components (such as the invoice generator and trusted devices list).
**Action:** Always hoist `Intl` formatter instantiations and options resolutions (e.g., `.resolvedOptions().timeZone`) to the module scope to cache and reuse the instances across multiple calls and component lifecycles.
