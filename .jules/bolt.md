## 2024-05-18 - Intl Object Instantiation Performance
**Learning:** Instantiating `Intl` objects (NumberFormat, DateTimeFormat) is highly expensive (~60-100x overhead) in JavaScript. When these are instantiated inside functions or render loops (e.g., in `formatPrice`, `formatDate`, `formatAED`), it causes significant performance degradation.
**Action:** These must be hoisted to module scope and reused rather than instantiated inside functions or render loops.
