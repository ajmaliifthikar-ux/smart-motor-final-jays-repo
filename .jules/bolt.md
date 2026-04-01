
## 2024-05-15 - Redis N+1 and Stack Overflow Avoidance
**Learning:** Sequential `await redis.get()` or `await redis.del()` inside loops can cause severe N+1 query bottlenecks, especially in heavily used services like AI Memory. Furthermore, when switching to batch operations (`mget` or `del`), using the spread operator (`...keys`) with large datasets can cause a "Maximum call stack size exceeded" error. `ioredis` inherently supports passing arrays directly to these commands.
**Action:** Always prefer batch Redis commands (`mget`, `del`) over looping sequential single-key operations. Crucially, pass the array of keys directly into the `ioredis` command (e.g., `redis.mget(keys)` or `redis.del(keys)`) rather than spreading them.
