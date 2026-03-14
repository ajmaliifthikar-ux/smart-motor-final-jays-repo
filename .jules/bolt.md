
## 2024-05-24 - Hoist Intl formatters out of render loops
**Learning:** Instantiating `Intl.NumberFormat` and `Intl.DateTimeFormat` inside loop functions or during component render cycles creates significant performance overhead (~60-100x slower) compared to reusing a globally scoped instance.
**Action:** Always hoist `Intl` formatters to the module scope (or reuse them via context/hooks) when formatting strings, particularly for numbers and dates rendered dynamically or repeatedly in loops.
