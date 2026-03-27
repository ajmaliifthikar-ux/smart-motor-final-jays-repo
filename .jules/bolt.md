## 2026-03-27 - Optimize Intl formatters
**Learning:** The application instantiates `Intl.NumberFormat` and `Intl.DateTimeFormat` repeatedly inside function calls like `formatPrice`, `formatAED` and `formatDate`. This causes unnecessary overhead, particularly when formatting list items during render loops.
**Action:** Hoisted the formatter instantiations out of the functions to the module scope.
