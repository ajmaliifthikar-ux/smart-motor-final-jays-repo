## 2024-06-05 - Avoid repeatedly instantiating `Intl` objects
**Learning:** `Intl` object instantiations (like `Intl.NumberFormat` and `Intl.DateTimeFormat`) are relatively expensive and can cause noticeable garbage collection overhead if done inside tight loops or often-called rendering functions.
**Action:** Always hoist `Intl` formatter instantiations to module scope, and reuse them across function calls. `Intl` instances are stateless and thread-safe.
