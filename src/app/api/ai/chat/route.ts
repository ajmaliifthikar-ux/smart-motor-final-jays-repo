import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { aiMemory } from '@/lib/ai-memory'

export async function POST(req: Request) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { message, conversationId } = await req.json()

        if (!message) {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            )
        }

        // Use existing conversation ID or create new one
        const convId = conversationId || `conv_${Date.now()}`

        // Get AI response with memory
        const response = await aiMemory.getAIResponse(
            session.user.id,
            convId,
            message
        )

        return NextResponse.json({
            response,
            conversationId: convId,
        })
    } catch (error) {
        console.error('AI chat error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * Get conversation history
 */
export async function GET(req: Request) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const conversationId = searchParams.get('conversationId')

        if (conversationId) {
            // Get specific conversation
            const conversation = await aiMemory.getConversation(
                session.user.id,
                conversationId
            )

            return NextResponse.json({ conversation })
        } else {
            // Get all user conversations
            const conversations = await aiMemory.getUserConversations(
                session.user.id,
                20
            )

            return NextResponse.json({ conversations })
        }
    } catch (error) {
        console.error('Get conversation error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * Delete conversation
 */
export async function DELETE(req: Request) {
    try {
        const session = await auth()

        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const conversationId = searchParams.get('conversationId')

        if (!conversationId) {
            return NextResponse.json(
                { error: 'Conversation ID required' },
                { status: 400 }
            )
        }

        await aiMemory.clearConversation(session.user.id, conversationId)

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Delete conversation error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
