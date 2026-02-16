/**
 * Native Audio Bidirectional Streaming Endpoint
 * Supports audio input with streaming audio + text response
 * Model: gemini-2.5-flash-native-audio-preview-12-2025
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { createNativeAudioSession, type AudioStreamChunk } from '@/lib/gemini-native-audio'

export const dynamic = 'force-dynamic'
export const maxDuration = 60 // 60 seconds max for streaming

/**
 * POST: Initiate native audio bidirectional streaming session
 * Expected body:
 * {
 *   audioBase64?: string,  // Base64 encoded audio data
 *   mimeType?: string,     // Audio mime type (default: audio/pcm)
 *   textInput?: string,    // Text input (if no audio)
 *   conversationId?: string,
 *   voiceName?: string,    // Gemini voice (e.g., 'Zephyr', 'Puck')
 *   systemPrompt?: string
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // Get user session
    const session = await auth()
    const userId = session?.user?.id || `public_${Date.now()}`

    const {
      audioBase64,
      mimeType = 'audio/pcm',
      textInput,
      conversationId,
      voiceName = 'Zephyr',
      systemPrompt,
    } = await req.json()

    // Validate input
    if (!audioBase64 && !textInput?.trim()) {
      return NextResponse.json(
        { error: 'Either audioBase64 or textInput is required' },
        { status: 400 }
      )
    }

    const convId = conversationId || `audio_conv_${Date.now()}`

    // Track abort signal
    const encoder = new TextEncoder()
    let aborted = false

    req.signal.addEventListener('abort', () => {
      aborted = true
    })

    // Create readable stream for SSE
    const customReadable = new ReadableStream<Uint8Array>({
      async start(controller) {
        let audioSession: any = null

        try {
          // Create native audio session
          audioSession = createNativeAudioSession({
            userId,
            conversationId: convId,
            voiceName,
            systemPrompt,
          })

          // Connect to native audio model
          console.log('🎤 Connecting to Native Audio Session...')
          await audioSession.connect()

          // Send message and stream response
          let generator: AsyncGenerator<AudioStreamChunk>

          if (audioBase64) {
            console.log('📥 Streaming audio input...')
            generator = audioSession.streamAudio(audioBase64, mimeType)
          } else {
            console.log('📝 Streaming text input...')
            generator = audioSession.streamText(textInput)
          }

          // Process response stream
          for await (const chunk of generator) {
            if (aborted) {
              console.log('⏹️ Stream aborted by client')
              break
            }

            // Format as Server-Sent Event
            const data = JSON.stringify(chunk)
            const event = `data: ${data}\n\n`

            try {
              controller.enqueue(encoder.encode(event))
            } catch (error) {
              console.error('Failed to enqueue chunk:', error)
              break
            }

            // Throttle to allow client processing
            await new Promise((resolve) => setTimeout(resolve, 5))
          }

          if (!aborted) {
            controller.close()
          }

          // Close session
          audioSession.close()
        } catch (error) {
          console.error('Stream error:', error)

          const errorChunk: AudioStreamChunk = {
            type: 'error',
            error: error instanceof Error ? error.message : 'Unknown error',
          }

          const event = `data: ${JSON.stringify(errorChunk)}\n\n`
          controller.enqueue(encoder.encode(event))
          controller.close()

          if (audioSession) {
            audioSession.close()
          }
        }
      },
    })

    return new NextResponse(customReadable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('Native audio error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

/**
 * OPTIONS: Handle CORS preflight
 */
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}
