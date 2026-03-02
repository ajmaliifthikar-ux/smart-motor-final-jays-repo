## 2025-02-18 - Redis Benchmark Trap
**Learning:** Redis benchmarks will silently measure DB fallback performance if the local Redis instance is not running, due to fail-fast logic in `checkRateLimit`.
**Action:** Verify Redis connectivity (`redis-cli ping` or similar) before trusting benchmark results for caching layers.
