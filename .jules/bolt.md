## Bolt's Journal
## 2025-02-12 - Cached Intl.NumberFormat / Intl.DateTimeFormat objects
**Learning:** Repeatedly instantiating `Intl` objects (`Intl.NumberFormat`, `Intl.DateTimeFormat`) inside formatting functions (e.g., `formatAED`, `formatDate`, `formatPrice`) creates a significant performance bottleneck due to garbage collection and parsing overhead (~15x slower).
**Action:** Always extract and hoist `Intl` object instantiations to the module scope so they are cached and reused across multiple function calls.
