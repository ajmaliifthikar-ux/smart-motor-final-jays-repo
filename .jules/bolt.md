## 2024-05-26 - Hoist Intl Object Instantiation

**Learning:** Instantiating `Intl` objects like `Intl.NumberFormat` and `Intl.DateTimeFormat` is extremely expensive (~60-100x overhead compared to reusing). Doing this inside functions that format individual items, particularly inside mapping over lists, causes significant performance bottlenecks.

**Action:** Always hoist `Intl` formatter initializations to module scope outside of formatting utility functions or React component render functions so they are reused.
