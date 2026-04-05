## 2024-04-05 - Hoisting Intl objects for Performance
**Learning:** Instantiating `Intl` formatters (like `Intl.NumberFormat` or `Intl.DateTimeFormat`) inside functions or render loops introduces performance bottlenecks.
**Action:** Always hoist these formatting instances to the module scope as constants for reuse, rather than repeatedly recreating them.