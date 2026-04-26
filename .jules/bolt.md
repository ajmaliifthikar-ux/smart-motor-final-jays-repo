## 2024-06-25 - Avoid repeated Intl object instantiation
**Learning:** Repeatedly instantiating `Intl` objects (like `Intl.NumberFormat` or `Intl.DateTimeFormat`) within functions or React render loops introduces a significant performance bottleneck due to excessive garbage collection and setup costs.
**Action:** Always hoist these formatting instances to the module scope as constants to reuse them. For simple local timezone formatting without arguments, rely on `Date.prototype.toLocaleDateString()` instead of explicitly passing `Intl.DateTimeFormat().resolvedOptions().timeZone`.
