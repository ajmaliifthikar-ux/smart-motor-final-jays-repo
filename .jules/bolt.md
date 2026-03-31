## 2024-05-24 - N+1 Problems in Redis Fetch Loops
**Learning:** Sequential `await redis.get(key)` inside loops introduces severe N+1 overhead and latency proportional to the size of the set, especially relevant in context retrieval scenarios.
**Action:** Always batch fetch operations using `redis.mget(keys)` instead of individual loop iterations. Pass the array of keys directly to `mget`.
