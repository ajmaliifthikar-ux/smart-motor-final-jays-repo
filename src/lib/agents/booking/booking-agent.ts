import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

interface BookingState {
    step: 'IDLE' | 'COLLECTING_DETAILS' | 'CONFIRMING' | 'COMPLETED'
    service?: string
    date?: string
    vehicle?: string
}

export class BookingCoordinatorAgent {
    private model: GenerativeModel
    // In a real app, this would be persisted in Redis/DB per user session
    private state: BookingState = { step: 'IDLE' }

    constructor(model?: GenerativeModel) {
        this.model = model || genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || 'gemini-3-flash-preview' })
    }

    async processMessage(userId: string, message: string): Promise<string> {
        // 1. Analyze intent
        const intent = await this.analyzeIntent(message)

        if (intent === 'BOOK_SERVICE' && this.state.step === 'IDLE') {
            this.state.step = 'COLLECTING_DETAILS'
            return "I can help you book a service. What type of service does your vehicle need? (e.g., Oil Change, Brake Inspection)"
        }

        if (this.state.step === 'COLLECTING_DETAILS') {
            // extracting details using LLM
            const details = await this.extractBookingDetails(message)
            if (details.service) this.state.service = details.service
            if (details.date) this.state.date = details.date

            if (!this.state.service) {
                return "Could you specify the service type?"
            }
            if (!this.state.date) {
                return "When would you like to bring your car in?"
            }

            this.state.step = 'CONFIRMING'
            return `Great. I have a request for ${this.state.service} on ${this.state.date}. Shall I confirm this booking?`
        }

        if (this.state.step === 'CONFIRMING') {
            if (message.toLowerCase().includes('yes') || message.toLowerCase().includes('confirm')) {
                this.state.step = 'COMPLETED'
                // Here we would call the actual Booking API/Database
                return "Booking confirmed! We look forward to seeing you."
            } else {
                this.state.step = 'IDLE' // Reset
                return "Okay, I've cancelled that request. Let me know if you need anything else."
            }
        }

        // Default conversational fallback
        return "I'm the Booking Coordinator. I can help you schedule appointments. Just say 'I want to book a service'."
    }

    private async analyzeIntent(message: string): Promise<string> {
        const prompt = `
      Analyze the intent of this message: "${message}"
      Categories: BOOK_SERVICE, CHECK_STATUS, GENERAL_QUERY
      Return only the category name.
    `
        const result = await this.model.generateContent(prompt)
        return result.response.text().trim()
    }

    private async extractBookingDetails(message: string): Promise<{ service?: string, date?: string }> {
        const prompt = `
      Extract service type and date from: "${message}"
      Return JSON: { "service": "...", "date": "..." }
      If missing, return null for that field.
    `
        try {
            const result = await this.model.generateContent(prompt)
            const text = result.response.text().replace(/```json|```/g, '').trim()
            return JSON.parse(text)
        } catch (e) {
            return {}
        }
    }
}
