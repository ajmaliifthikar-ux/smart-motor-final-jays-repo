## 2026-03-05 - Hoist Intl formatters for performance
**Learning:** Instantiating `Intl` objects (NumberFormat, DateTimeFormat) is highly expensive (~60-100x overhead); these must be hoisted to module scope and reused rather than instantiated inside functions or render loops.
**Action:** Always extract `Intl.NumberFormat` and `Intl.DateTimeFormat` instantiations outside of formatters and render functions to global/module scope for reuse.
