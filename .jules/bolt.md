## 2026-03-22 - [Intl Object Instantiation Overhead]
**Learning:** Instantiating `Intl` objects like `NumberFormat` and `DateTimeFormat` has a huge performance overhead (~60-100x slower) compared to reusing existing instances. Doing this inside functions that run frequently (e.g. formatters in render loops or map iterations) creates a significant bottleneck.
**Action:** Always hoist the instantiation of `Intl` objects out to the module scope and reuse the cached instances inside formatting functions.
