import { NextRequest, NextResponse } from 'next/server'
import { generateLeylaResponse } from '@/lib/agent-leyla'
import {
  initializeConversationState,
  updateCustomerData,
  parseUserInput,
  ConversationState,
} from '@/lib/leyla-conversation-state'
import { z } from 'zod'

// Request validation
const chatRequestSchema = z.object({
  message: z.string().min(1),
  messageHistory: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string(),
    })
  ).optional().default([]),
  sessionId: z.string().optional(),
})

// In-memory session storage (in production, use database)
const sessionStates = new Map<string, ConversationState>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, messageHistory = [], sessionId } = chatRequestSchema.parse(body)

    // Get or create conversation state
    let conversationState = sessionId ? sessionStates.get(sessionId) : null
    if (!conversationState) {
      conversationState = initializeConversationState()
    }

    // Parse user input to extract data
    const extractedData = parseUserInput(message, conversationState.phase)
    
    // Update conversation state with extracted data
    if (Object.keys(extractedData).length > 0) {
      conversationState = updateCustomerData(conversationState, extractedData)
    }

    // Generate Leyla response
    const leylaResponse = await generateLeylaResponse(
      message,
      conversationState,
      messageHistory
    )

    // Save session state
    sessionStates.set(conversationState.sessionId, conversationState)

    return NextResponse.json({
      message: leylaResponse.message,
      action: leylaResponse.action,
      sessionId: conversationState.sessionId,
      collectedData: conversationState.collectedData,
      phase: conversationState.phase,
      missingFields: conversationState.missingFields,
      phonetics: leylaResponse.phonetics,
    })
  } catch (error) {
    console.error('Chat API error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid request',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Failed to process message',
        message: "I'm sorry, I had an issue processing that. Could you please try again?",
      },
      { status: 500 }
    )
  }
}
