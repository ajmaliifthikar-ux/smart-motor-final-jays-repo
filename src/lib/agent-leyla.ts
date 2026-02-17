/**
 * Leyla Agent Personality Engine
 * Handles conversation with Gemini API
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import { ConversationState, ConversationPhase, CustomerData } from './leyla-conversation-state'
import { getSpellingVerification, getCarBrandPhonetic } from './phonetic-alphabet'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

/**
 * System prompt for Leyla persona
 */
const LEYLA_SYSTEM_PROMPT = `You are Leyla, a 28-year-old automotive sales specialist at Smart Motor UAE. 

YOUR PERSONALITY:
- Warm, hyper-happy, and genuinely enthusiastic about cars
- Arabic-influenced English accent (occasionally use casual Arabic expressions like "habibi" or "alhamdulillah")
- Professional yet friendly and personal
- Car-crazy and passionate about helping customers
- Psychological sales expert who understands customer needs
- Remember customer names and reference them frequently
- Make personalized suggestions based on their history

YOUR COMMUNICATION STYLE:
- Use car emojis and enthusiastic language 🚗 ⚡
- Ask about the customer's car with genuine interest
- Use the NATO phonetic alphabet for data verification
- Be proactive in suggesting services
- Make customers feel valued and remembered
- Use simple, clear language
- Keep responses concise (2-3 sentences)

YOUR ROLE:
- Greet customers warmly
- Collect their contact information (name, email, phone, car brand/model)
- Verify information using NATO phonetics
- Reference their last service visit if returning customer
- Suggest relevant services
- Help them book an appointment

IMPORTANT RULES:
- Always be friendly and warm
- Never be pushy - let customers decide
- If customer provides data, use NATO alphabet to confirm
- Reference the car model they drive - show genuine interest
- If they mention a previous visit, acknowledge it warmly
- Offer to set up their booking once confirmed

CONVERSATION PHASES:
1. GREETING: Welcome them, check if returning customer
2. INFO COLLECTION: Ask for name, email, phone, car brand/model
3. VERIFICATION: Confirm all details are correct
4. BOOKING: Help them schedule service

EXAMPLE RESPONSES:
- "Hi! I'm Leyla from Smart Motor! What's your name?"
- "Oh, BMW! Which model? I love German engineering! 🚗"
- "Let me confirm - that's spelled B-Bravo, M-Mike, W-Whiskey, right?"
- "Awesome! So we have you down for an oil change. Let's get you booked!"
`

export interface LeylaResponse {
  message: string
  action?: 'continue' | 'verify' | 'book' | 'complete'
  suggestedNext?: string
  phonetics?: string
}

/**
 * Generate Leyla response using Gemini
 */
export async function generateLeylaResponse(
  userMessage: string,
  conversationState: ConversationState,
  messageHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<LeylaResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    // Build context about current conversation phase
    const phaseContext = buildPhaseContext(conversationState)

    // Build full conversation prompt
    const systemContext = `${LEYLA_SYSTEM_PROMPT}

CURRENT CONVERSATION STATE:
${phaseContext}

CUSTOMER DATA COLLECTED SO FAR:
${JSON.stringify(conversationState.collectedData, null, 2)}

MISSING INFORMATION: ${conversationState.missingFields.length > 0 ? conversationState.missingFields.join(', ') : 'None'}
`

    // Format message history for Gemini
    const formattedHistory = messageHistory.slice(-6).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.content }],
    }))

    // Add current user message
    formattedHistory.push({
      role: 'user',
      parts: [{ text: userMessage }],
    })

    const chat = model.startChat({
      history: formattedHistory.slice(0, -1),
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.9,
      },
    })

    const result = await chat.sendMessage(userMessage)
    const responseText = result.response.text()

    // Determine action based on conversation phase
    let action: 'continue' | 'verify' | 'book' | 'complete' = 'continue'
    if (conversationState.missingFields.length === 0 && conversationState.phase === 'info_collection') {
      action = 'verify'
    } else if (conversationState.phase === 'verification') {
      action = 'verify'
    } else if (conversationState.phase === 'booking') {
      action = 'book'
    }

    return {
      message: responseText,
      action,
      suggestedNext: buildSuggestedNext(conversationState),
    }
  } catch (error) {
    console.error('Error generating Leyla response:', error)
    // Fallback response
    return {
      message: getDefaultResponse(conversationState),
      action: 'continue',
    }
  }
}

/**
 * Build context string for current phase
 */
function buildPhaseContext(state: ConversationState): string {
  switch (state.phase) {
    case 'greeting':
      return `Currently in GREETING phase. ${
        state.isReturningCustomer && state.collectedData.name
          ? `This is a returning customer (${state.collectedData.name}). Reference their previous visit warmly!`
          : 'This is a new customer. Welcome them warmly and start collecting information.'
      }`

    case 'info_collection':
      const collected = Object.entries(state.collectedData)
        .filter(([_, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join(', ')
      return `Currently in INFO_COLLECTION phase. Already collected: ${collected}. Continue collecting missing fields: ${state.missingFields.join(', ')}`

    case 'verification':
      return `Currently in VERIFICATION phase. Confirming all customer details are correct. Be ready to use NATO phonetics if needed.`

    case 'booking':
      return `Currently in BOOKING phase. Help customer schedule their service. Ask about preferred date/time and services needed.`

    case 'complete':
      return `Conversation is COMPLETE. Thank them and provide booking confirmation.`

    default:
      return `Current phase: ${state.phase}`
  }
}

/**
 * Get default response when Gemini fails
 */
function getDefaultResponse(state: ConversationState): string {
  const { phase, collectedData, missingFields } = state

  switch (phase) {
    case 'greeting':
      return state.isReturningCustomer
        ? `Welcome back${collectedData.name ? `, ${collectedData.name}` : ''}! How can I help you today?`
        : "Hi! I'm Leyla from Smart Motor! What's your name?"

    case 'info_collection':
      if (!collectedData.name) return "What's your name?"
      if (!collectedData.email) return `Nice to meet you, ${collectedData.name}! What's your email?`
      if (!collectedData.phone) return "And your phone number?"
      if (!collectedData.carBrand) return "What car brand do you drive? 🚗"
      if (!collectedData.carModel) return `What model of ${collectedData.carBrand}?`
      return "Perfect! Do you have any other information for me?"

    case 'verification':
      return `Let me confirm: ${collectedData.name}, ${collectedData.email}, ${collectedData.phone}, ${collectedData.carBrand} ${collectedData.carModel}. Is this correct?`

    case 'booking':
      return `Great! What service can I help you with today? We offer oil changes, tire rotations, brake service, and more!`

    case 'complete':
      return `Thank you for booking with us! We'll see you soon! 🚗`

    default:
      return "How can I help you?"
  }
}

/**
 * Build suggested next action
 */
function buildSuggestedNext(state: ConversationState): string {
  if (state.missingFields.length > 0) {
    return `Please provide: ${state.missingFields[0]}`
  }
  if (state.phase === 'info_collection') {
    return 'Ready to verify information'
  }
  if (state.phase === 'verification') {
    return 'Ready to proceed to booking'
  }
  if (state.phase === 'booking') {
    return 'Confirm booking'
  }
  return ''
}

/**
 * Format response with phonetics if needed
 */
export function formatResponseWithPhonetics(
  message: string,
  customerData: Partial<CustomerData>
): { message: string; phonetics?: string } {
  // If we just collected car brand, add phonetics
  if (customerData.carBrand) {
    const phonetics = getCarBrandPhonetic(customerData.carBrand)
    if (message.includes(customerData.carBrand)) {
      return {
        message,
        phonetics,
      }
    }
  }

  return { message }
}
