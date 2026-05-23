
## 2024-05-18 - Avoid Repeated Intl Instantiation
**Learning:** Instantiating `Intl` objects (like `Intl.NumberFormat` and `Intl.DateTimeFormat`) is an expensive operation in V8 and other JavaScript engines. Repeating this instantiation inside frequently called formatting functions (e.g., inside a `.map()` or a React render cycle) introduces unnecessary garbage collection overhead and blocks the main thread, resulting in performance degradation.
**Action:** Always hoist `Intl` instantiation out of the function body and cache it as a constant at the module scope if the locale and options are static. Use the cached formatter instance via `.format()` to perform the formatting.
