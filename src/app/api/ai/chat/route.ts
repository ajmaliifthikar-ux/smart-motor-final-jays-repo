import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { aiMemory } from '@/lib/ai-memory'
import { headers } from 'next/headers'
import { traceIntegration } from '@/lib/diagnostics'

export async function POST(req: Request) {
    try {
        const { message, conversationId } = await req.json()
        const userId = `guest_${Date.now()}`

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 })
        }

        const convId = conversationId || `conv_${Date.now()}`
        const response = await aiMemory.getAIResponse(userId, convId, message)

        return NextResponse.json({
            response,
            conversationId: convId,
        })
    } catch (error: any) {
        console.error('AI chat error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const conversationId = searchParams.get('conversationId')

        if (conversationId) {
            const conversation = await aiMemory.getConversation(session.user.id, conversationId)
            return NextResponse.json({ conversation })
        } else {
            const conversations = await aiMemory.getUserConversations(session.user.id, 20)
            return NextResponse.json({ conversations })
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
