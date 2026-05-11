
## 2024-05-23 - Caching Intl objects
**Learning:** Instantiating `Intl` objects (like `Intl.NumberFormat` and `Intl.DateTimeFormat`) or computing values via `.resolvedOptions()` repeatedly inside loops, render functions, or frequently called utility functions causes significant garbage collection and parsing overhead in JavaScript. This can lead to noticeable performance degradation.
**Action:** Always prevent repeated instantiation of `Intl` objects or `.resolvedOptions()` computations by hoisting and caching them as constants at the module scope.
