## 2026-03-12 - Intl Object Instantiation Overhead
**Learning:** Instantiating `Intl` objects (NumberFormat, DateTimeFormat) is highly expensive and causes significant overhead, especially when used inside utility functions or render loops.
**Action:** Always hoist `Intl` formatters to the module scope and reuse them.
