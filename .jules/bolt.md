## 2024-06-05 - Cache Intl objects at module scope
**Learning:** Instantiating new Intl objects (like Intl.NumberFormat and Intl.DateTimeFormat) within formatting functions or render loops causes significant performance degradation due to garbage collection and parsing overhead (up to ~18x slower).
**Action:** Always hoist and cache Intl objects as constants at the module scope rather than instantiating them repeatedly.
