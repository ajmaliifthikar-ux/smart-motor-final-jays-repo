# Bolt's Journal - Critical Learnings

This journal tracks critical performance insights and learnings.


## 2024-05-22 - Hoisting Intl Formatters
**Learning:** Instantiating `Intl.NumberFormat` and `Intl.DateTimeFormat` is expensive (~60-100x overhead vs reuse). Hoisting them to module scope reduced test execution time from 34ms to 6ms in a small suite.
**Action:** Always declare `Intl` formatters as module-level constants when locale and options are static.
