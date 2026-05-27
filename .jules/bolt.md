
## 2024-05-18 - Avoid repeated Intl instantiations in formatting functions
**Learning:** Instantiating `Intl` objects (like `Intl.NumberFormat` and `Intl.DateTimeFormat`) on every render or within iterative loops is a hidden performance bottleneck due to excessive garbage collection and parsing overhead. Our benchmark script showed a ~1.144s runtime for 10k iterations when uncached, compared to ~66ms when cached.
**Action:** Always hoist and cache `Intl` formatter instantiations at the module level rather than repeatedly computing them inside formatting functions (e.g., `formatPrice`, `formatDate`, `formatAED`).
