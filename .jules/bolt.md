## 2025-06-03 - N+1 Queries in Redis Knowledge Base
**Learning:** Sequential `redis.get()` loops for fetching items from a set of IDs (e.g., `redis.smembers`) cause severe N+1 latency, especially when network round-trips accumulate.
**Action:** Always refactor sequential `redis.get()` requests (like the `this.getKnowledge` loops) into batched `redis.mget()` operations for fetching multiple items by ID, while ensuring `null` results and JSON parsing errors are explicitly handled for each batch item.
