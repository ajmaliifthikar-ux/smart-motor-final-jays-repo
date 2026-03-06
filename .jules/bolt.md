
## 2025-02-28 - Intl Object Instantiation Bottleneck
**Learning:** Instantiating `Intl` objects (`NumberFormat`, `DateTimeFormat`) inside functions or render loops is a significant performance bottleneck, with a ~60-100x overhead compared to reusing a hoisted instance. This is particularly problematic in functions that are called frequently, such as formatting utilities or line item renderers in a table.
**Action:** Always hoist `Intl` object instantiations to module scope and reuse the instances across function calls.
