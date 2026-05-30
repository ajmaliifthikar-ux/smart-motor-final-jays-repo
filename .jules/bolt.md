## 2025-02-12 - Prevent Repeated Intl Object Instantiation
**Learning:** To avoid garbage collection and parsing overhead in JavaScript, do not repeatedly instantiate `Intl` objects (like `Intl.NumberFormat` and `Intl.DateTimeFormat`) inside loops or frequently called formatting functions.
**Action:** Hoist and cache `Intl` objects as constants at the module scope so they are only instantiated once.
