## 2024-06-13 - [Optimize Knowledge Base Redis queries]
**Learning:** Sequential reads (N+1 pattern) inside loops (like looping over IDs to fetch Redis keys individually) create significant network latency overhead.
**Action:** Always batch related requests using `redis.mget` (or `redis.pipeline()`). When mapping flattened batched Redis responses back to nested structures (like iterating over IDs and types), use calculated indexes (`i * types.length + j`) instead of linearly incrementing variables.
