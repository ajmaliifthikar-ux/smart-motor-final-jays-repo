## 2024-06-18 - Optimize batched Redis responses (mget) with calculated indexes

**Learning:** When mapping flattened batched Redis responses (e.g., from `redis.mget`) back to nested structures (like iterating over IDs and types), using calculated indexes (e.g., `i * types.length + j`) is crucial instead of linearly incrementing variables (e.g., `dataIndex++`), which desynchronize if the inner loop contains a `break` or `continue` statement. Additionally, when executing batched `ioredis` operations like `redis.mget()`, the array should be passed directly as an argument (e.g., `redis.mget(keys)`) rather than spreading the elements (`redis.mget(...keys)`) to avoid `Maximum call stack size exceeded` errors.

**Action:** Replace N+1 sequential `redis.get()` loops with `redis.mget(keys)` and correctly index into the resulting flattened data array using calculated indices (`i * types.length + j`).
