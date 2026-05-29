## 2024-05-24 - Hoist Intl formatters for better performance
**Learning:** Instantiating `Intl` objects (like `Intl.NumberFormat` and `Intl.DateTimeFormat`) or computing values via `.resolvedOptions()` inside functions or render loops can cause unnecessary garbage collection and parsing overhead, reducing performance, especially when they are called frequently.
**Action:** Prevent repeated instantiation by hoisting and caching these `Intl` objects as constants at the module scope so they are only created once.
