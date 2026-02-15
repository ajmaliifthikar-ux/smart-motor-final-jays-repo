import redis from '@/lib/redis'
import { Message, ConversationContext } from './types'

export class MemoryManager {
    private readonly TTL = 7 * 24 * 60 * 60 // 7 days

    constructor() { }

    private getKey(userId: string, sessionId: string): string {
        return `agent:memory:${userId}:${sessionId}`
    }

    async addMessage(userId: string, sessionId: string, message: Message): Promise<void> {
        const key = this.getKey(userId, sessionId)
        const context = await this.getContext(userId, sessionId)

        // Add timestamp if missing
        if (!message.timestamp) message.timestamp = Date.now()

        context.messages.push(message)
        context.metadata = { ...context.metadata, lastUpdated: Date.now() }

        await redis.setex(key, this.TTL, JSON.stringify(context))
    }

    async getContext(userId: string, sessionId: string): Promise<ConversationContext> {
        const key = this.getKey(userId, sessionId)
        const data = await redis.get(key)

        if (data) {
            return JSON.parse(data) as ConversationContext
        }

        // Return empty context if new
        return {
            userId,
            sessionId,
            messages: []
        }
    }

    async clearContext(userId: string, sessionId: string): Promise<void> {
        const key = this.getKey(userId, sessionId)
        await redis.del(key)
    }

    // Future: Vector Search implementation for Long-Term Memory
    // async searchLongTermMemory(userId: string, query: string): Promise<string[]> { ... }
}

export const memoryManager = new MemoryManager()
