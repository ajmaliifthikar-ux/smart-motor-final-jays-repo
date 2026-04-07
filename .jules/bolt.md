## 2024-04-07 - Intl instantiation bottleneck

**Learning:** Repeatedly instantiating `Intl` objects (like `Intl.NumberFormat` or `Intl.DateTimeFormat`) inside functions or render loops introduces severe performance bottlenecks. A benchmark showed that 100k instantiations take ~7.3s compared to ~97ms when reusing a single instance.
**Action:** Always hoist `Intl` formatting instances to the module scope as constants for reuse rather than creating new instances inside utility functions or components.
