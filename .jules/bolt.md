## 2025-03-01 - Hoisting Intl Objects
**Learning:** Instantiating `Intl` objects like `NumberFormat` and `DateTimeFormat` inside utility functions is highly expensive, incurring a ~60-100x overhead on every call.
**Action:** Always hoist `Intl` object instantiations to the module scope so they are created once and reused across function calls.
