import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai'
import { calendarTools } from './calendar-tools' // Updated import path

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export class BookingCoordinator {
    private model: any

    constructor() {
        this.model = genAI.getGenerativeModel({
            model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
            systemInstruction: `
                You are the Booking Coordinator for Smart Motor.
                Your role is to help customers find a suitable time for their car service.
                
                Capabilities:
                - Check slot availability using real-time data for a SPECIFIC SERVICE.
                - Suggest alternative times if a slot is taken.
                - Collect necessary details (Service Type, Date, Time) to prepare for booking.
                
                Current Date: ${new Date().toISOString().split('T')[0]}
                
                Protocol:
                1. Ask for the type of service required (e.g., Oil Change, Tinting).
                2. Ask for preferred date.
                3. Check availability for that service on that date.
                4. If available, confirm the slot and ask to proceed with booking.
            `,
            tools: [
                {
                    functionDeclarations: [
                        {
                            name: "checkAvailability",
                            description: "Checks available appointment slots for a specific service on a specific date.",
                            parameters: {
                                type: SchemaType.OBJECT,
                                properties: {
                                    serviceId: {
                                        type: SchemaType.STRING,
                                        description: "The ID or slug of the service (e.g., 'oil-change', 'tinting')"
                                    },
                                    dateString: {
                                        type: SchemaType.STRING,
                                        description: "Date in YYYY-MM-DD format"
                                    }
                                },
                                required: ["serviceId", "dateString"]
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
                    const { serviceId, dateString } = call.args
                    // We need to resolve serviceId to a real ID if the model guesses a slug
                    // For now, let's assume the model is smart enough or we map common names
                    const toolResult = await calendarTools.checkAvailability(serviceId, dateString)

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
