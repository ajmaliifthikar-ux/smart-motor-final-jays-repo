## 2026-04-12 - Hoisting Intl objects for performance
**Learning:** Repeatedly instantiating `Intl` objects (like `Intl.NumberFormat` or `Intl.DateTimeFormat`) inside functions or render loops introduces performance bottlenecks.
**Action:** Always hoist these formatting instances to the module scope as constants for reuse, preventing unnecessary re-instantiations during execution or rendering.