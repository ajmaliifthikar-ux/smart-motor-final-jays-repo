## 2024-05-20 - Cache Intl Instantiations
**Learning:** Instantiating `Intl.NumberFormat` and `Intl.DateTimeFormat` (or repeatedly calling `.resolvedOptions()`) inside formatting functions or component render loops is surprisingly expensive and creates significant garbage collection overhead, particularly in heavy UI contexts like list rendering (e.g., invoices or device histories).
**Action:** Always hoist `Intl` object instantiations and options resolutions to the module level scope (outside of functions and components) to cache them when formatting rules are static.
