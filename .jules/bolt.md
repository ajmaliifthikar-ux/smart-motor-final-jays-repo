## 2025-01-28 - Intl Object Instantiation Performance Bottleneck
**Learning:** Repeatedly instantiating `Intl` objects (like `Intl.NumberFormat` or `Intl.DateTimeFormat`) inside functions or render loops introduces performance bottlenecks. This is especially problematic in list components or utilities that are called frequently.
**Action:** Hoist these formatting instances to the module scope as constants for reuse.
