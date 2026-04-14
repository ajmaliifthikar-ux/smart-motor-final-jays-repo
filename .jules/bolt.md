## 2025-02-28 - Hoisting Intl formatters
**Learning:** Repeatedly instantiating `Intl` objects (`Intl.NumberFormat`, `Intl.DateTimeFormat`) within functions or React render loops introduces a performance bottleneck due to excessive garbage collection and object initialization overhead.
**Action:** Always hoist these formatting instances to the module scope as constants to reuse them.
