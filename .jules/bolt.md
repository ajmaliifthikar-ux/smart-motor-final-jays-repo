## 2024-05-24 - Hoist Intl Instantiations for Performance
**Learning:** Repeatedly instantiating `Intl` objects (like `Intl.NumberFormat` or `Intl.DateTimeFormat`) inside functions or render loops introduces performance bottlenecks. A benchmark showed a 18x slowdown when recreating these objects compared to reusing them.
**Action:** Hoist these formatting instances to the module scope as constants for reuse whenever they use static locale/options, preventing repeated instantiation on every render/function call.
