import { prisma } from "@/lib/prisma"
import redis from "@/lib/redis"

const RATE_LIMIT_PREFIX = "rate_limit:"
const REDIS_TIMEOUT_MS = 200 // Fail fast if Redis is slow/down

async function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    let timeoutId: ReturnType<typeof setTimeout>;
    const timeoutPromise = new Promise<T>((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error(`Redis operation timed out after ${ms}ms`)), ms);
    });

    try {
        const result = await Promise.race([promise, timeoutPromise]);
        clearTimeout(timeoutId!);
        return result;
    } catch (error) {
        clearTimeout(timeoutId!);
        throw error;
    }
}

/**
 * Checks if a user has exceeded their rate limit for a specific action.
 * Uses Redis for O(1) checks, falling back to DB if Redis is empty or fails.
 * Includes a timeout to ensure Redis issues don't block the request indefinitely.
 * 
 * @param userId - The ID of the user performing the action
 * @param action - The action identifier (e.g., "GENERATE_ARTICLE")
 * @param limit - Maximum number of allowed actions within the window
 * @param windowSeconds - Time window in seconds (default: 3600 = 1 hour)
 * @returns true if allowed, false if limit exceeded
 */
export async function checkRateLimit(
    userId: string,
    action: string,
    limit: number = 10,
    windowSeconds: number = 3600
): Promise<boolean> {
    const key = `${RATE_LIMIT_PREFIX}${userId}:${action}`
    const now = Date.now()
    const windowStart = now - windowSeconds * 1000

    try {
        // 1. Check if key exists in Redis (with timeout)
        const exists = await withTimeout(redis.exists(key), REDIS_TIMEOUT_MS)

        if (!exists) {
            // 2. If missing, populate from DB (Hydration)
            const logs = await prisma.aIUsageLog.findMany({
                where: {
                    userId: userId,
                    action: action,
                    createdAt: {
                        gte: new Date(windowStart)
                    }
                },
                select: { createdAt: true }
            })

            const pipeline = redis.pipeline()

            if (logs.length > 0) {
                logs.forEach((log, index) => {
                    pipeline.zadd(key, log.createdAt.getTime(), `${log.createdAt.getTime()}-${index}`)
                })
            } else {
                // No usage, but we set a dummy "INIT" member (score 0) so the key exists
                // This prevents subsequent checks from hitting the DB
                pipeline.zadd(key, 0, "INIT")
            }

            pipeline.expire(key, windowSeconds)
            await withTimeout(pipeline.exec(), REDIS_TIMEOUT_MS)
        }

        // 3. Clean old entries & Count
        const pipeline = redis.pipeline()

        // Remove entries older than windowStart but keep "INIT" (score 0)
        // We start removing from score 1 up to windowStart - 1 (exclusive of windowStart)
        pipeline.zremrangebyscore(key, 1, windowStart - 1)

        // Count entries in the current window (score >= windowStart)
        // "INIT" (score 0) is excluded
        pipeline.zcount(key, windowStart, "+inf")

        pipeline.expire(key, windowSeconds)

        const results = await withTimeout(pipeline.exec(), REDIS_TIMEOUT_MS)

        // Results is [[err, countRemoved], [err, count], [err, expireResult]]
        // We care about count (index 1)
        if (!results || results[1][0]) {
            throw results ? results[1][0] : new Error("Redis pipeline failed")
        }

        const count = results[1][1] as number
        return count < limit

    } catch (error) {
        console.error("Rate limit Redis error/timeout, falling back to DB check", error)

        // Fallback to DB check
        try {
            const count = await prisma.aIUsageLog.count({
                where: {
                    userId: userId,
                    action: action,
                    createdAt: {
                        gte: new Date(windowStart)
                    }
                }
            })
            return count < limit
        } catch (dbError) {
            console.error("Rate limit DB fallback failed", dbError)
            return true // Fail open
        }
    }
}

/**
 * Records a new usage event in Redis to keep it in sync with DB.
 * Should be called after successfully recording the event in DB.
 */
export async function incrementRateLimit(
    userId: string,
    action: string,
    windowSeconds: number = 3600
): Promise<void> {
    const key = `${RATE_LIMIT_PREFIX}${userId}:${action}`
    const now = Date.now()
    const member = `${now}-${Math.random().toString(36).substring(7)}`

    try {
        await withTimeout(
            redis.pipeline()
                .zadd(key, now, member)
                .expire(key, windowSeconds)
                .exec(),
            REDIS_TIMEOUT_MS
        )
    } catch (error) {
        console.error("Failed to increment rate limit in Redis", error)
    }
}
