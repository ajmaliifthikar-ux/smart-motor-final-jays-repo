import redis from './redis'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

// Types
export interface Message {
    role: 'user' | 'assistant' | 'system'
    content: string
    timestamp: number
}

export interface ConversationContext {
    userId: string
    conversationId: string
    messages: Message[]
    metadata?: Record<string, any>
    lastUpdated: number
}

/**
 * AI Agent Memory Manager using Redis
 */
export class AIMemoryManager {
    private readonly TTL = 7 * 24 * 60 * 60 // 7 days

    /**
     * Store conversation message
     */
    async addMessage(
        userId: string,
        conversationId: string,
        role: 'user' | 'assistant',
        content: string,
        metadata?: Record<string, any>
    ): Promise<void> {
        const message: Message = {
            role,
            content,
            timestamp: Date.now(),
        }

        const key = `conversation:${userId}:${conversationId}`

        // Get existing conversation
        const existingData = await redis.get(key)
        const conversation: ConversationContext = existingData
            ? JSON.parse(existingData)
            : {
                userId,
                conversationId,
                messages: [],
                metadata: metadata || {},
                lastUpdated: Date.now(),
            }

        // Add new message
        conversation.messages.push(message)
        conversation.lastUpdated = Date.now()

        // Store back to Redis
        await redis.setex(key, this.TTL, JSON.stringify(conversation))

        // Also store in a sorted set for quick retrieval
        await redis.zadd(
            `user:${userId}:conversations`,
            Date.now(),
            conversationId
        )
    }

    /**
     * Get conversation history
     */
    async getConversation(
        userId: string,
        conversationId: string
    ): Promise<ConversationContext | null> {
        const key = `conversation:${userId}:${conversationId}`
        const data = await redis.get(key)

        return data ? JSON.parse(data) : null
    }

    /**
     * Get recent conversations for a user
     */
    async getUserConversations(
        userId: string,
        limit: number = 10
    ): Promise<string[]> {
        // Get conversation IDs sorted by most recent
        return await redis.zrevrange(`user:${userId}:conversations`, 0, limit - 1)
    }

    /**
     * Get conversation summary (last N messages)
     */
    async getConversationSummary(
        userId: string,
        conversationId: string,
        lastN: number = 5
    ): Promise<Message[]> {
        const conversation = await this.getConversation(userId, conversationId)

        if (!conversation) return []

        // Return last N messages
        return conversation.messages.slice(-lastN)
    }

    /**
     * Generate embeddings for semantic search
     */
    async generateEmbedding(text: string): Promise<number[]> {
        try {
            const model = genAI.getGenerativeModel({ model: 'text-embedding-004' })
            const result = await model.embedContent(text)
            return result.embedding.values
        } catch (error) {
            console.error('Embedding generation error:', error)
            // Fallback: simple hash-based pseudo-embedding
            return this.simplePseudoEmbedding(text)
        }
    }

    /**
     * Simple pseudo-embedding fallback (for demo/dev)
     */
    private simplePseudoEmbedding(text: string): number[] {
        const hash = text.split('').reduce((acc, char) => {
            return ((acc << 5) - acc + char.charCodeAt(0)) | 0
        }, 0)

        // Generate 768-dimensional vector (match typical embedding size)
        const embedding: number[] = []
        for (let i = 0; i < 768; i++) {
            embedding.push(Math.sin(hash + i) * 0.5 + 0.5)
        }
        return embedding
    }

    /**
     * Store context with vector embedding
     */
    async storeContext(
        userId: string,
        contextId: string,
        text: string,
        metadata?: Record<string, any>
    ): Promise<void> {
        const embedding = await this.generateEmbedding(text)

        const context = {
            userId,
            contextId,
            text,
            embedding,
            metadata: metadata || {},
            timestamp: Date.now(),
        }

        const key = `context:${userId}:${contextId}`
        await redis.setex(key, this.TTL, JSON.stringify(context))

        // Index for user
        await redis.sadd(`user:${userId}:contexts`, contextId)
    }

    /**
     * Search similar contexts (simplified cosine similarity)
     */
    async searchSimilarContexts(
        userId: string,
        query: string,
        limit: number = 5
    ): Promise<Array<{ contextId: string; text: string; score: number }>> {
        const queryEmbedding = await this.generateEmbedding(query)
        const contextIds = await redis.smembers(`user:${userId}:contexts`)

        const results: Array<{ contextId: string; text: string; score: number }> =
            []

        for (const contextId of contextIds) {
            const key = `context:${userId}:${contextId}`
            const data = await redis.get(key)

            if (!data) continue

            const context = JSON.parse(data)
            const score = this.cosineSimilarity(queryEmbedding, context.embedding)

            results.push({
                contextId,
                text: context.text,
                score,
            })
        }

        // Sort by score descending and return top N
        return results.sort((a, b) => b.score - a.score).slice(0, limit)
    }

    /**
     * Calculate cosine similarity between two vectors
     */
    private cosineSimilarity(vecA: number[], vecB: number[]): number {
        let dotProduct = 0
        let normA = 0
        let normB = 0

        for (let i = 0; i < vecA.length; i++) {
            dotProduct += vecA[i] * vecB[i]
            normA += vecA[i] * vecA[i]
            normB += vecB[i] * vecB[i]
        }

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
    }

    /**
     * Clear conversation
     */
    async clearConversation(
        userId: string,
        conversationId: string
    ): Promise<void> {
        const key = `conversation:${userId}:${conversationId}`
        await redis.del(key)
        await redis.zrem(`user:${userId}:conversations`, conversationId)
    }

    /**
     * Clear all user data
     */
    async clearUserData(userId: string): Promise<void> {
        // Get all conversation IDs
        const conversations = await redis.zrange(
            `user:${userId}:conversations`,
            0,
            -1
        )

        // Delete all conversations
        for (const convId of conversations) {
            await redis.del(`conversation:${userId}:${convId}`)
        }

        // Delete conversation list
        await redis.del(`user:${userId}:conversations`)

        // Get all context IDs
        const contexts = await redis.smembers(`user:${userId}:contexts`)

        // Delete all contexts
        for (const ctxId of contexts) {
            await redis.del(`context:${userId}:${ctxId}`)
        }

        await redis.del(`user:${userId}:contexts`)
    }

    /**
   * Get AI agent response with conversation history and global knowledge
   */
    async getAIResponse(
        userId: string,
        conversationId: string,
        userMessage: string
    ): Promise<string> {
        // Import knowledge base
        const { knowledgeBase } = await import('./knowledge-base')

        // Add user message to history
        await this.addMessage(userId, conversationId, 'user', userMessage)

        // 1. Get GLOBAL KNOWLEDGE (shared by all users)
        const globalKnowledge = await knowledgeBase.getRelevantKnowledge(userMessage, 3)

        // 2. Get PERSONAL MEMORY (specific to this user)
        const personalHistory = await this.getConversationSummary(
            userId,
            conversationId,
            10
        )

        // 3. Search user's personal context
        const personalContexts = await this.searchSimilarContexts(
            userId,
            userMessage,
            2
        )

        // Build context from user's past conversations
        const personalContextText = personalContexts
            .map((ctx) => ctx.text)
            .join('\n')

        // 4. Prepare comprehensive prompt with BOTH layers
        const prompt = `
You are a helpful AI assistant for Smart Motor, a luxury car service center in UAE.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GLOBAL COMPANY KNOWLEDGE (shared):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${globalKnowledge}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PERSONAL CUSTOMER CONTEXT (this user only):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${personalContextText || 'No previous interaction history with this customer.'}

Conversation history with this customer:
${personalHistory
                .map((m) => `${m.role === 'user' ? 'Customer' : 'Assistant'}: ${m.content}`)
                .join('\n')}

Customer: ${userMessage}

Instructions:
- Use GLOBAL KNOWLEDGE for accurate company information
- Use PERSONAL CONTEXT to personalize your response to THIS customer
- Never mix up customers - each has separate memory
- Be helpful, professional, and specific to their needs
- If you don't know something, say so - never make up information

Provide your response:
`

        try {
            const { GoogleGenerativeAI } = await import('@google/generative-ai')
            const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
            const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-3-flash-preview' })

            const result = await model.generateContent(prompt)
            const response = result.response.text()

            // Store assistant response in PERSONAL memory only
            await this.addMessage(userId, conversationId, 'assistant', response)

            // Store this exchange as context for THIS user only
            await this.storeContext(
                userId,
                `${conversationId}_${Date.now()}`,
                `Q: ${userMessage}\nA: ${response}`,
                { conversationId, timestamp: Date.now() }
            )

            return response
        } catch (error) {
            console.error('AI response error:', error)
            return 'I apologize, but I encountered an error. Please try again or contact our support team.'
        }
    }

    /**
     * Get conversation statistics
     */
    async getConversationStats(
        userId: string,
        conversationId: string
    ): Promise<{
        messageCount: number
        duration: number
        lastActive: number
    }> {
        const conversation = await this.getConversation(userId, conversationId)

        if (!conversation) {
            return { messageCount: 0, duration: 0, lastActive: 0 }
        }

        const firstMessage = conversation.messages[0]
        const lastMessage =
            conversation.messages[conversation.messages.length - 1]

        return {
            messageCount: conversation.messages.length,
            duration: lastMessage
                ? lastMessage.timestamp - firstMessage.timestamp
                : 0,
            lastActive: conversation.lastUpdated,
        }
    }
}

// Export singleton instance
export const aiMemory = new AIMemoryManager()
