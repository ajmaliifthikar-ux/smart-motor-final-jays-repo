## 2025-01-20 - Memoizing Intl objects
**Learning:** Found `Intl.NumberFormat` and `Intl.DateTimeFormat` instances being repeatedly instantiated within render loops and utility functions. This can be slow.
**Action:** Extract `Intl.*` object instantiation to the module scope and reuse them across function calls.
