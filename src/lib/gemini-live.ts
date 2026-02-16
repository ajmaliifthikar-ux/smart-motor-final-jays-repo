import { GoogleGenerativeAI } from '@google/generative-ai'
import { aiMemory } from './ai-memory'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyD9nwv7J0MXrgk9O5xcBl-ptLBjfIjzxnk')

export interface LiveSessionConfig {
  userId: string
  conversationId: string
  maxTokens?: number
  temperature?: number
  systemPrompt?: string
}

export interface StreamChunk {
  type: 'token' | 'metadata' | 'error' | 'done'
  content?: string
  tokenCount?: number
  finishReason?: string
  error?: string
}

/**
 * Gemini Live Session Manager - Handles streaming conversations
 */
export class GeminiLiveSession {
  private config: LiveSessionConfig
  private tokenCount = 0
  private systemPrompt: string

  constructor(config: LiveSessionConfig) {
    this.config = config
    this.systemPrompt = config.systemPrompt || this.getDefaultSystemPrompt()
  }

  /**
   * Stream a message with token-by-token output
   */
  async *streamMessage(userMessage: string): AsyncGenerator<StreamChunk> {
    try {
      // Add user message to memory
      await aiMemory.addMessage(
        this.config.userId,
        this.config.conversationId,
        'user',
        userMessage
      )

      // Get conversation context
      const { knowledgeBase } = await import('./knowledge-base')
      const globalKnowledge = await knowledgeBase.getRelevantKnowledge(userMessage, 3)
      const personalHistory = await aiMemory.getConversationSummary(
        this.config.userId,
        this.config.conversationId,
        10
      )
      const personalContexts = await aiMemory.searchSimilarContexts(
        this.config.userId,
        userMessage,
        2
      )

      const personalContextText = personalContexts
        .map((ctx) => ctx.text)
        .join('\n')

      // Build comprehensive prompt
      const prompt = `
${this.systemPrompt}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
GLOBAL COMPANY KNOWLEDGE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${globalKnowledge}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PERSONAL CUSTOMER CONTEXT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${personalContextText || 'No previous interaction history with this customer.'}

Conversation history:
${personalHistory
  .map((m) => `${m.role === 'user' ? 'Customer' : 'Assistant'}: ${m.content}`)
  .join('\n')}

Customer: ${userMessage}

Respond helpfully and professionally:
`

      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
      })

      // Optimized for Agentic & Native Live Audio: gemini-2.5-flash-native-audio-preview-12-2025
      
      const request = {
        contents: [{ role: 'user' as const, parts: [{ text: prompt }] }],
        generationConfig: {
          maxOutputTokens: this.config.maxTokens || 1024,
          temperature: this.config.temperature ?? 0.7,
        },
      }

      // Stream the response
      const stream = await model.generateContentStream(request)

      let fullResponse = ''

      for await (const chunk of stream.stream) {
        // Handle different chunk formats
        const text = chunk.text?.()
        if (text) {
          fullResponse += text

          // Emit token chunks (split by words for realistic token display)
          const tokens = text.split(/(\s+)/).filter((t) => t.length > 0)
          for (const token of tokens) {
            this.tokenCount++
            yield {
              type: 'token',
              content: token,
              tokenCount: this.tokenCount,
            }
          }
        }
      }

      // Get final response for metadata
      const response = await stream.response
      const finishReason = response.candidates?.[0]?.finishReason || 'STOP'

      // Emit metadata
      yield {
        type: 'metadata',
        tokenCount: this.tokenCount,
        finishReason: finishReason,
      }

      // Store complete response in memory
      await aiMemory.addMessage(
        this.config.userId,
        this.config.conversationId,
        'assistant',
        fullResponse
      )

      // Store as context for future relevance
      await aiMemory.storeContext(
        this.config.userId,
        `${this.config.conversationId}_${Date.now()}`,
        `Q: ${userMessage}\nA: ${fullResponse}`,
        {
          conversationId: this.config.conversationId,
          timestamp: Date.now(),
          tokenCount: this.tokenCount,
        }
      )

      yield { type: 'done' }
    } catch (error) {
      console.error('Stream error:', error)
      yield {
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      }
    }
  }

  /**
   * Get default system prompt for Smart Motor
   */
  private getDefaultSystemPrompt(): string {
    return `You are a helpful and professional AI assistant for Smart Motor, a luxury automotive service center in UAE.

Your role is to:
- Help customers with booking services, pricing, and vehicle care information
- Provide technical advice on car maintenance (general guidance only, not professional diagnosis)
- Answer questions about Smart Motor's services, facilities, and expertise
- Be friendly, professional, and solution-focused
- Personalize responses based on the customer's history and preferences

Always:
- Be honest about limitations - refer complex technical questions to our technicians
- Maintain professional tone while being approachable
- Use the provided knowledge base and customer history
- Suggest booking or contacting us for specific solutions`
  }

  /**
   * Reset token counter (useful for new messages)
   */
  resetTokenCount(): void {
    this.tokenCount = 0
  }

  /**
   * Get current token count
   */
  getTokenCount(): number {
    return this.tokenCount
  }
}

/**
 * Create a new live session
 */
export function createLiveSession(config: LiveSessionConfig): GeminiLiveSession {
  return new GeminiLiveSession(config)
}
