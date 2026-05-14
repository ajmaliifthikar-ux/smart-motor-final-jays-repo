## 2024-06-03 - N+1 Redis Query Bottlenecks in Knowledge Base
**Learning:** Sequential getter functions for list operations (like searching by keywords or fetching by type) create extreme N+1 bottlenecks. When searching the knowledge base, finding a match by keyword could trigger 6 individual `getKnowledge` calls per match, multiplying network round trips exponentially. The latency hit compounds when dealing with thousands of documents.

**Action:** Consistently replace N+1 sequential `redis.get` requests with grouped batch requests `redis.mget`. Instead of iterating through each potential entry type or ID, batch collect all possible keys and process their parsed JSON results iteratively. Similarly, aggregate Redis sets queries using `redis.pipeline()` when resolving multiple keywords.
