## 2025-02-23 - Intl object instantiation in render loops
**Learning:** Repeatedly instantiating `Intl` objects (`Intl.NumberFormat`, `Intl.DateTimeFormat`) within functions or React render loops introduces a significant performance bottleneck (nearly 80x slower execution).
**Action:** Always hoist these formatting instances to the module scope as constants to reuse them, preventing excessive garbage collection and redundant initializations.
