## 2025-02-14 - Cache Intl object instantiations
**Learning:** Repeated instantiation of `Intl` objects (like `Intl.NumberFormat` and `Intl.DateTimeFormat`) or computing values via `.resolvedOptions()` inside formatting functions or render loops causes unnecessary garbage collection and parsing overhead in JavaScript.
**Action:** Always hoist and cache `Intl` instances and computed `.resolvedOptions()` as constants at the module scope.
