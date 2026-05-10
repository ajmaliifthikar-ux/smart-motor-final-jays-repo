## 2025-05-10 - Cache Intl Formatters at Module Scope
**Learning:** Instantiating `Intl.NumberFormat` and `Intl.DateTimeFormat` objects inside formatting functions or render loops introduces significant garbage collection and parsing overhead in JavaScript. The system prompt explicitly highlighted this as an optimization target to avoid memory pressure and unnecessary parsing.
**Action:** Always hoist and cache `Intl` formatter instances as constants at the module scope. Re-use these cached instances in functions instead of creating new ones upon every invocation.
