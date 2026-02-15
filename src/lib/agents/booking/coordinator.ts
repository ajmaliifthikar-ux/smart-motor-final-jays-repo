import { GoogleGenerativeAI } from '@google/generative-ai'
import { calendarTools } from '@/lib/tools/calendar-tools'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export class BookingCoordinator {
    private model: any

    constructor() {
        this.model = genAI.getGenerativeModel({
            model: process.env.GEMINI_MODEL || 'gemini-3-flash-preview',
            systemInstruction: `
                You are the Booking Coordinator for Smart Motor.
                Your role is to help customers find a suitable time for their car service.
                
                Capabilities:
                - Check slot availability using real-time data.
                - Suggest alternative times if a slot is taken.
                - Collect necessary details (Name, Car Model, Date, Time) to prepare for booking.
                
                Current Date: ${new Date().toISOString().split('T')[0]}
                
                Protocol:
                1. Ask for preferred date.
                2. Check availability.
                3. If available, confirm the slot and ask to proceed with booking (which links to the form).
                4. If not available, offer the nearest open slots.
            `,
            tools: [
                {
                    functionDeclarations: [
                        {
                            name: "checkAvailability",
                            description: "Checks available appointment slots for a specific date.",
                            parameters: {
                                type: "OBJECT",
                                properties: {
                                    dateString: {
                                        type: "STRING",
                                        description: "Date in YYYY-MM-DD format"
                                    }
                                },
                                required: ["dateString"]
                            }
                        }
                    ]
                }
            ]
        })
    }

    async processRequest(userMessage: string, history: any[] = []) {
        const chat = this.model.startChat({
            history: history.map(h => ({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: h.content }]
            }))
        })

        try {
            const result = await chat.sendMessage(userMessage)
            const response = result.response
            const functionCalls = response.functionCalls()

            if (functionCalls && functionCalls.length > 0) {
                // Handle Function Call (Tool Use)
                const call = functionCalls[0]
                if (call.name === 'checkAvailability') {
                    const { dateString } = call.args
                    const toolResult = await calendarTools.checkAvailability(dateString)

                    // Send tool result back to model
                    const nextResult = await chat.sendMessage([
                        {
                            functionResponse: {
                                name: 'checkAvailability',
                                response: { result: toolResult }
                            }
                        }
                    ])
                    return nextResult.response.text()
                }
            }

            return response.text()
        } catch (error) {
            console.error('Booking Coordinator Error:', error)
            return "I'm having trouble accessing the calendar right now. Please try using the booking form directly."
        }
    }
}
