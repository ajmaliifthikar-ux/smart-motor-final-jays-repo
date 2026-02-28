## 2024-05-19 - Expensive Intl instantiation
**Learning:** Instantiating `Intl` objects like `Intl.NumberFormat` and `Intl.DateTimeFormat` inside utility functions or render loops is a known performance bottleneck in JavaScript. They have significant overhead compared to reusing a pre-instantiated formatter.
**Action:** Always hoist `Intl` instantiations to the module scope and reuse them across calls, especially in utility functions that are called frequently like `formatPrice` or `formatDate`, or in render loops like in `src/app/admin/tools/invoice-gen/page.tsx`.
