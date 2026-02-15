import { NextRequest, NextResponse } from 'next/server'
import { SmartAssistant } from '@/lib/agents/smart-assistant/agent'
// import { BookingCoordinator } from '@/lib/agents/booking/agent'
// import { SEOSpecialist } from '@/lib/agents/seo/agent'

export const maxDuration = 60 // Allow longer processing for AI

const smartAssistant = new SmartAssistant()

export async function POST(req: NextRequest) {
    try {
        const { message, userId, sessionId, agentType = 'assistant' } = await req.json()

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        let response: string | object = ''

        switch (agentType) {
            case 'assistant':
                response = await smartAssistant.processMessage(
                    userId || 'guest',
                    sessionId || 'default',
                    message
                )
                break

            // Future integrations:
            // case 'booking':
            //   const coordinator = new BookingCoordinator()
            //   response = await coordinator.extractDetails(message)
            //   break

            default:
                return NextResponse.json({ error: 'Invalid agent type' }, { status: 400 })
        }

        return NextResponse.json({ response })
    } catch (error) {
        console.error('AI API Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
