## 2024-05-20 - Intl Object Instantiation Overhead
**Learning:** Instantiating `Intl` objects like `Intl.NumberFormat` and `Intl.DateTimeFormat` inside formatting functions or React render loops introduces significant overhead (~60-100x), especially in frequently called utilities or lists (like invoice line items).
**Action:** Always hoist `Intl` formatter instances to the module scope and reuse them across function calls instead of re-instantiating them for every format operation.
