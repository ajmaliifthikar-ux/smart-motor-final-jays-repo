## 2024-05-18 - Hoisting Intl Objects
**Learning:** Repeatedly instantiating `Intl` objects (`Intl.NumberFormat`, `Intl.DateTimeFormat`) within functions or React render loops introduces a significant performance bottleneck due to excessive object creation and garbage collection.
**Action:** Always hoist these formatting instances to the module scope as constants to reuse them and prevent excessive garbage collection, particularly for frequently invoked utilities like `formatPrice` and `formatDate`.
