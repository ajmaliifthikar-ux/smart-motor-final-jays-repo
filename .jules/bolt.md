## 2023-10-27 - Cached Intl formatters
**Learning:** Instantiating `Intl` objects (like `Intl.NumberFormat` and `Intl.DateTimeFormat`) inside render loops or frequently called utility functions causes significant garbage collection overhead and blocks the main thread during heavy formatting operations.
**Action:** Always hoist `Intl` formatters and timezone lookups to the module scope (as constants) so they are instantiated only once per module load.
