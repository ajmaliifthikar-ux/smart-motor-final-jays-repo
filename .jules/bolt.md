## 2024-06-25 - Cache Intl formatters to prevent performance overhead

**Learning:** Repeatedly instantiating `Intl` objects like `Intl.NumberFormat` and `Intl.DateTimeFormat` or computing values via `.resolvedOptions()` within formatting functions or render loops causes significant performance overhead due to garbage collection and parsing.

**Action:** Always hoist and cache `Intl` object instantiations as constants at the module scope so they can be reused across multiple formatting calls.
