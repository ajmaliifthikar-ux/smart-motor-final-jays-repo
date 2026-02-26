## 2025-02-21 - Intl.NumberFormat Instantiation Overhead
**Learning:** Instantiating `Intl.NumberFormat` and `Intl.DateTimeFormat` inside frequently called functions (like `formatPrice` or `formatDate`) is significantly expensive. In a benchmark, hoisting these formatters to module scope reduced execution time by ~60-100x (e.g., 800ms -> 10ms for 10k iterations).
**Action:** Always hoist `Intl` formatters to the module scope or use a memoization pattern if the locale/options are dynamic. Avoid creating them on every render or function call.
