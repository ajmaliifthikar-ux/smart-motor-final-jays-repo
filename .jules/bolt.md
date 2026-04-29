## 2024-04-29 - Cache Intl formatters
**Learning:** `Intl.NumberFormat` and `Intl.DateTimeFormat` instantiation causes parsing and garbage collection overhead, especially within React render loops or frequent utility function calls.
**Action:** Extract `Intl` formatter instantiations to module-level constants to reuse the same instance, significantly improving performance.
