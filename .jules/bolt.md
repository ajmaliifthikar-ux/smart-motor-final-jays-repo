## 2026-04-13 - Hoisting Intl formatters for performance
**Learning:** Instantiating `Intl` objects (like `Intl.NumberFormat` and `Intl.DateTimeFormat`) repeatedly inside functions or React render loops is a significant performance bottleneck due to excessive garbage collection and setup overhead.
**Action:** Always hoist `Intl` formatter instances to the module scope as constants so they can be reused across multiple function calls or renders.
