
## 2024-05-24 - Intl objects memory allocation & GC overhead
**Learning:** Instantiating `Intl` objects (`Intl.NumberFormat`, `Intl.DateTimeFormat`) repeatedly inside loops, render passes, or formatting helper functions (like `formatAED` or `formatPrice`) creates significant garbage collection (GC) and parsing overhead. In Node/JS, measuring un-cached instantiation inside a tight loop took >5000ms compared to ~85ms when cached.
**Action:** Always extract and hoist `Intl` instantiations to module scope constants. Avoid dynamic timezone checks (`Intl.DateTimeFormat().resolvedOptions().timeZone`) inside map or render loops; cache them at module level instead.
