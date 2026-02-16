import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { AgentConfig, Message, ToolDefinition } from '../core/types'
import { memoryManager } from '../core/memory'
import { knowledgeBase } from '../core/knowledge'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyD9nwv7J0MXrgk9O5xcBl-ptLBjfIjzxnk')

export class SmartAssistant {
    private model: GenerativeModel
    private config: AgentConfig

    constructor() {
        this.config = {
            model: 'gemini-2.5-flash',
            systemPrompt: `You are a helpful AI Assistant for Smart Motor, a luxury car service center in UAE.
      
      Your goal is to assist customers with:
      - Booking appointments
      - Answering FAQs about services
      - Providing price estimates (ranges only)
      
      Guidelines:
      - Be professional, polite, and concise.
      - If you don't know an answer, check the Knowledge Base or ask the user to contact support.
      - NEVER diagnose vehicle issues definitively remotely. ALWAYS recommend a physical inspection.
      - Use the provided tools to check availability.
      `,
            temperature: 0.7
        }

        this.model = genAI.getGenerativeModel({
            model: this.config.model,
            systemInstruction: this.config.systemPrompt
        })
    }

    async processMessage(userId: string, sessionId: string, text: string): Promise<string> {
        // 1. Retrieve Context
        const context = await memoryManager.getContext(userId, sessionId)

        // 2. Retrieve Knowledge (RAG)
        const relevantKnowledge = await knowledgeBase.search(text)
        const knowledgeContext = relevantKnowledge.map(k => k.content).join('\n\n')

        // 3. Construct Prompt
        const chatSession = this.model.startChat({
            history: context.messages.map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                parts: [{ text: m.content }]
            }))
        })

        // Inject Knowledge if beneficial (simplified for now)
        const promptWithRAG = knowledgeContext
            ? `Global Knowledge:\n${knowledgeContext}\n\nUser Question: ${text}`
            : text

        // 4. Generate Response
        try {
            const result = await chatSession.sendMessage(promptWithRAG)
            const responseText = result.response.text()

            // 5. Update Memory
            await memoryManager.addMessage(userId, sessionId, { role: 'user', content: text })
            await memoryManager.addMessage(userId, sessionId, { role: 'assistant', content: responseText })

            return responseText
        } catch (error) {
            console.error('SmartAssistant Error:', error)
            return "I apologize, but I'm having trouble connecting right now. Please try again later."
        }
    }
}
