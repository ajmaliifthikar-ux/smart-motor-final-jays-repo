import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'
import { AgentConfig } from '../core/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

interface BookingState {
    step: 'IDLE' | 'COLLECTING' | 'CONFIRMING' | 'COMPLETED'
    data: Record<string, any>
}

export class BookingCoordinator {
    private model: GenerativeModel
    private config: AgentConfig

    constructor() {
        this.config = {
            model: 'gemini-2.5-flash',
            systemPrompt: `You are the specific Booking Coordinator logic agent.
      
      Your sole purpose is to extract booking details efficiently.
      - Service Type
      - Preferred Date/Time
      - Car Make/Model
      
      Output ONLY structured data when asked.
      `,
            temperature: 0.2 // Low temp for logic
        }

        this.model = genAI.getGenerativeModel({
            model: this.config.model,
            systemInstruction: this.config.systemPrompt
        })
    }

    async extractDetails(userMessage: string): Promise<Record<string, any>> {
        const prompt = `Extract booking details from: "${userMessage}".\nReturn JSON: { "service": "...", "date": "...", "car": "..." }. Return null for missing fields.`

        try {
            const result = await this.model.generateContent(prompt)
            const text = result.response.text().replace(/```json|```/g, '').trim()
            return JSON.parse(text)
        } catch (e) {
            return {}
        }
    }
}
