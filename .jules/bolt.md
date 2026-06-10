## 2024-10-25 - [Optimize Knowledge Base Redis queries]
**Learning:** Sequential `redis.get` calls inside a loop (N+1 query problem) in the Knowledge Base (like `getKnowledgeByType` and `searchKnowledge`) introduce high network latency.
**Action:** Replace N+1 sequential `redis.get` queries with batched `redis.mget` (or `redis.pipeline()`), and fetch sets concurrently using `Promise.all` to significantly reduce the number of network roundtrips. Ensure error handling and JSON parsing logic is explicitly reimplemented for the batched string results.
