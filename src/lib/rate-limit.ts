import { prisma } from "@/lib/prisma"

/**
 * Checks if a user has exceeded their rate limit for a specific action.
 * Uses the database logs to be stateless and robust.
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
    const windowStart = new Date(Date.now() - windowSeconds * 1000)

    // Count logs for this user and action in the time window
    // We check both AIUsageLog (for AI actions) and specific AuditLogs if needed
    // For simplicity, we'll assume we are checking AIUsageLog for AI actions
    // and generic limits might use a different table or logic.

    // Strategy: If action starts with "AI_", check AIUsageLog
    // Otherwise, we might need a general RateLimit table, but for now 
    // we are prioritizing AI Cost Safety.

    if (action === "GENERATE_ARTICLE") {
        const count = await prisma.aIUsageLog.count({
            where: {
                userId: userId,
                action: action,
                createdAt: {
                    gte: windowStart
                }
            }
        })

        return count < limit
    }

    // Fallback for other actions if we implement them later
    return true
}
