import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createLiveSession } from '@/lib/gemini-live'

export const dynamic = 'force-dynamic'

/**
 * Stream chat response as Server-Sent Events
 * Supports bidirectional conversation with token-by-token streaming
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, conversationId, systemPrompt, maxTokens, temperature } =
      await req.json()

    if (!message?.trim()) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const convId = conversationId || `conv_${Date.now()}`

    // Create a readable stream for SSE
    const encoder = new TextEncoder()
    let aborted = false

    // Handle client disconnect
    req.signal.addEventListener('abort', () => {
      aborted = true
    })

    const customReadable = new ReadableStream({
      async start(controller) {
        try {
          // Create live session
          const session_instance = createLiveSession({
            userId: session.user!.id,
            conversationId: convId,
            systemPrompt,
            maxTokens,
            temperature,
          })

          // Stream the message
          for await (const chunk of session_instance.streamMessage(message)) {
            if (aborted) break

            // Format as SSE
            const data = JSON.stringify(chunk)
            const event = `data: ${data}\n\n`

            try {
              controller.enqueue(encoder.encode(event))
            } catch (error) {
              console.error('Failed to enqueue chunk:', error)
              break
            }

            // Small delay to allow client to process
            await new Promise((resolve) => setTimeout(resolve, 10))
          }

          if (!aborted) {
            controller.close()
          }
        } catch (error) {
          console.error('Stream error:', error)
          const errorChunk = {
            type: 'error',
            error:
              error instanceof Error
                ? error.message
                : 'Unknown error occurred',
          }
          const event = `data: ${JSON.stringify(errorChunk)}\n\n`
          controller.enqueue(encoder.encode(event))
          controller.close()
        }
      },
    })

    return new NextResponse(customReadable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Live chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
