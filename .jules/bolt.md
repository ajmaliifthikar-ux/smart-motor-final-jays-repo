## 2024-03-21 - Intl Object Caching for Render Optimization
**Learning:** Instantiating `Intl` objects (like `Intl.NumberFormat` and `Intl.DateTimeFormat`) inside React render loops or frequently called utility functions is a significant performance bottleneck due to parsing and garbage collection overhead.
**Action:** Always hoist `Intl` object instantiations to the module scope and cache them as constants. When formatting dates to the local timezone, use `Date.prototype.toLocaleDateString()` without arguments instead of explicitly passing `Intl.DateTimeFormat().resolvedOptions().timeZone`.
