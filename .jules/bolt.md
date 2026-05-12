## 2024-05-12 - Prevent Repeated Intl Instantiation
**Learning:** To avoid garbage collection and parsing overhead in JavaScript, prevent repeated instantiation of `Intl` objects (like `Intl.NumberFormat` and `Intl.DateTimeFormat`) or computing values via `.resolvedOptions()` within formatting functions or render loops.
**Action:** Hoist and cache `Intl` objects as constants at the module scope.
