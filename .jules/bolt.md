## 2024-05-06 - Caching Intl API Objects
**Learning:** Instantiating `Intl` objects (like `Intl.NumberFormat` and `Intl.DateTimeFormat`) is relatively expensive and forces V8/JavaScript engine to parse locales and do setup work repeatedly if placed inside formatting functions or loops. The codebase heavily used these inline within utilities and render loops (like `.map`).
**Action:** Always hoist `Intl.*` constructor calls to module-scoped constants so they are instantiated once and reused, preventing unnecessary allocations and garbage collection overhead.
