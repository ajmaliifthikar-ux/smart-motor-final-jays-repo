## 2024-05-18 - High Overhead of Intl Instantiations
**Learning:** Instantiating `Intl` objects (`NumberFormat`, `DateTimeFormat`) inside functions or render loops introduces a massive performance overhead (~60-100x slower) compared to reusing a single instance. In React, this can severely impact rendering performance when called repeatedly (e.g., mapping over arrays).
**Action:** Always hoist `Intl` object instantiations to the module scope and reuse them across function calls or render cycles.
