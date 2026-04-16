## 2026-02-20 - Intl Formatters Performance Bottleneck
**Learning:** Repeatedly instantiating `Intl` objects (`Intl.NumberFormat`, `Intl.DateTimeFormat`) within functions or React render loops introduces a performance bottleneck due to excessive garbage collection.
**Action:** Always hoist these formatting instances to the module scope as constants to reuse them.
