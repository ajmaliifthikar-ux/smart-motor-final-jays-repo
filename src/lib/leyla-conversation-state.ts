/**
 * Leyla Conversation State Machine
 * Tracks conversation phases and collected data
 */

export type ConversationPhase = 'greeting' | 'info_collection' | 'verification' | 'booking' | 'complete'

export interface CustomerData {
  name?: string
  email?: string
  phone?: string
  carBrand?: string
  carModel?: string
  lastService?: string
  lastServiceDate?: string
}

export interface ConversationState {
  phase: ConversationPhase
  customerId?: string
  isReturningCustomer: boolean
  collectedData: CustomerData
  missingFields: (keyof CustomerData)[]
  messageCount: number
  lastMessageTime: Date
  conversationStarted: Date
  sessionId: string
}

/**
 * Initialize new conversation state
 */
export function initializeConversationState(): ConversationState {
  return {
    phase: 'greeting',
    isReturningCustomer: false,
    collectedData: {},
    missingFields: ['name', 'email', 'phone', 'carBrand', 'carModel'],
    messageCount: 0,
    lastMessageTime: new Date(),
    conversationStarted: new Date(),
    sessionId: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  }
}

/**
 * Get next phase based on current state
 */
export function getNextPhase(state: ConversationState): ConversationPhase {
  // If all required fields collected, move to verification
  if (state.missingFields.length === 0 && state.phase === 'info_collection') {
    return 'verification'
  }

  // If verified and ready, move to booking
  if (state.phase === 'verification' && state.collectedData.name && state.collectedData.email) {
    return 'booking'
  }

  // If booking confirmed, complete
  if (state.phase === 'booking') {
    return 'complete'
  }

  return state.phase
}

/**
 * Update collected data and track missing fields
 */
export function updateCustomerData(
  state: ConversationState,
  data: Partial<CustomerData>
): ConversationState {
  const collectedData = { ...state.collectedData, ...data }
  
  // Determine missing required fields
  const required: (keyof CustomerData)[] = ['name', 'email', 'phone', 'carBrand', 'carModel']
  const missingFields = required.filter(field => !collectedData[field])

  return {
    ...state,
    collectedData,
    missingFields,
    lastMessageTime: new Date(),
  }
}

/**
 * Advance to next phase
 */
export function advancePhase(state: ConversationState): ConversationState {
  const nextPhase = getNextPhase(state)
  return {
    ...state,
    phase: nextPhase,
  }
}

/**
 * Get conversation summary for display
 */
export function getConversationSummary(state: ConversationState): string {
  const { phase, collectedData, missingFields } = state

  let summary = `Phase: ${phase}\n`
  summary += `Customer Data: ${JSON.stringify(collectedData, null, 2)}\n`
  summary += `Missing Fields: ${missingFields.length > 0 ? missingFields.join(', ') : 'None'}\n`

  return summary
}

/**
 * Check if customer data is complete
 */
export function isDataComplete(state: ConversationState): boolean {
  return state.missingFields.length === 0
}

/**
 * Get next question based on phase
 */
export function getNextQuestion(state: ConversationState): string {
  if (state.phase === 'greeting') {
    return state.isReturningCustomer
      ? `Hi ${state.collectedData.name}! Welcome back! 👋 How can I help you today?`
      : "Hi there! I'm Leyla from Smart Motor. Before we get started, what's your name?"
  }

  if (state.phase === 'info_collection') {
    if (!state.collectedData.name) {
      return "What's your name?"
    }
    if (!state.collectedData.email) {
      return `Nice to meet you, ${state.collectedData.name}! What's your email address?`
    }
    if (!state.collectedData.phone) {
      return "And your phone number?"
    }
    if (!state.collectedData.carBrand) {
      return "What car brand do you drive?"
    }
    if (!state.collectedData.carModel) {
      return `Great! What model of ${state.collectedData.carBrand} do you have?`
    }
  }

  if (state.phase === 'verification') {
    return `Let me confirm your details:
Name: ${state.collectedData.name}
Email: ${state.collectedData.email}
Phone: ${state.collectedData.phone}
Car: ${state.collectedData.carBrand} ${state.collectedData.carModel}

Is everything correct?`
  }

  if (state.phase === 'booking') {
    return `Perfect! Now, what services are you interested in? We offer oil changes, tire rotations, brake service, and more. What brings you in today?`
  }

  return "How can I help you?"
}

/**
 * Parse user input to extract customer data
 */
export function parseUserInput(
  input: string,
  currentPhase: ConversationPhase
): Partial<CustomerData> {
  const data: Partial<CustomerData> = {}

  const normalizedInput = input.toLowerCase().trim()

  // Try to extract email
  const emailMatch = normalizedInput.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i)
  if (emailMatch) {
    data.email = emailMatch[1]
  }

  // Try to extract phone
  const phoneMatch = normalizedInput.match(/(\+?1?\s?)?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/i)
  if (phoneMatch) {
    data.phone = normalizedInput.replace(/[^\d+]/g, '').slice(-10)
  }

  // Try to extract car brands (basic list)
  const carBrands = ['bmw', 'audi', 'mercedes', 'tesla', 'toyota', 'honda', 'ford', 'chevrolet', 'volkswagen', 'nissan', 'hyundai', 'kia', 'lexus', 'porsche', 'lamborghini', 'ferrari', 'bugatti']
  for (const brand of carBrands) {
    if (normalizedInput.includes(brand)) {
      data.carBrand = brand.charAt(0).toUpperCase() + brand.slice(1)
      break
    }
  }

  // For names, accept 2+ word input when expecting name
  if (currentPhase === 'info_collection' && !emailMatch && !phoneMatch && input.split(' ').length >= 1) {
    const words = input.split(' ').filter(w => w.length > 1 && /^[a-zA-Z]+$/.test(w))
    if (words.length > 0) {
      data.name = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    }
  }

  return data
}
