
## 2024-05-18 - Intl Object Instantiation Overhead
**Learning:** Recreating `Intl.NumberFormat` or `Intl.DateTimeFormat` objects repeatedly inside formatting functions or loops causes severe performance bottlenecks. A simple microbenchmark showed `new Intl.NumberFormat` taking ~729ms for 10k calls vs ~10ms when cached, and `new Intl.DateTimeFormat` taking ~3517ms vs ~28ms when cached (70x-125x speedup).
**Action:** Always hoist and cache `Intl` instances at the module scope when used in utility formatting functions (like `formatPrice` or `formatDate`) to avoid repeated expensive instantiation and garbage collection overhead.
