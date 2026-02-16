import {
  getDatabase,
  ref,
  push,
  set,
  get,
  update,
  remove,
  onValue,
  Unsubscribe,
} from 'firebase/database'
import { initializeApp, getApps } from 'firebase/app'

// Initialize Realtime Database
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
export const rtdb = getDatabase(app)

export interface ConversationData {
  id?: string
  participantIds: string[]
  createdAt: number
  lastMessage?: string
  lastMessageTime?: number
  lastMessageFrom?: string
}

export interface MessageData {
  id?: string
  conversationId: string
  userId: string
  text?: string
  audio?: string
  timestamp: number
  read?: boolean
  role?: 'user' | 'assistant'
}

// ─── CONVERSATION MANAGEMENT ───

export async function createConversation(participantIds: string[]): Promise<string> {
  try {
    const conversationsRef = ref(rtdb, 'conversations')
    const newConvRef = push(conversationsRef)

    const conversationData: ConversationData = {
      participantIds,
      createdAt: Date.now(),
    }

    await set(newConvRef, conversationData)
    return newConvRef.key || ''
  } catch (error) {
    console.error('Error creating conversation:', error)
    throw error
  }
}

export async function getConversation(conversationId: string): Promise<ConversationData | null> {
  try {
    const snapshot = await get(ref(rtdb, `conversations/${conversationId}`))
    return snapshot.exists() ? (snapshot.val() as ConversationData) : null
  } catch (error) {
    console.error('Error fetching conversation:', error)
    return null
  }
}

export async function updateConversationLastMessage(
  conversationId: string,
  message: string,
  userId: string
): Promise<void> {
  try {
    await update(ref(rtdb, `conversations/${conversationId}`), {
      lastMessage: message,
      lastMessageTime: Date.now(),
      lastMessageFrom: userId,
    })
  } catch (error) {
    console.error('Error updating conversation:', error)
    throw error
  }
}

export function subscribeToConversation(
  conversationId: string,
  callback: (data: ConversationData | null) => void
): Unsubscribe {
  const conversationRef = ref(rtdb, `conversations/${conversationId}`)
  return onValue(conversationRef, (snapshot) => {
    callback(snapshot.exists() ? (snapshot.val() as ConversationData) : null)
  })
}

// ─── MESSAGE MANAGEMENT ───

export async function sendMessage(
  conversationId: string,
  messageData: Omit<MessageData, 'id'>
): Promise<string> {
  try {
    const messagesRef = ref(rtdb, `conversations/${conversationId}/messages`)
    const newMessageRef = push(messagesRef)

    const message: MessageData = {
      ...messageData,
      timestamp: Date.now(),
    }

    await set(newMessageRef, message)
    await updateConversationLastMessage(conversationId, message.text || '[Audio Message]', message.userId)

    return newMessageRef.key || ''
  } catch (error) {
    console.error('Error sending message:', error)
    throw error
  }
}

export async function getMessage(conversationId: string, messageId: string): Promise<MessageData | null> {
  try {
    const snapshot = await get(ref(rtdb, `conversations/${conversationId}/messages/${messageId}`))
    return snapshot.exists() ? (snapshot.val() as MessageData) : null
  } catch (error) {
    console.error('Error fetching message:', error)
    return null
  }
}

export async function getConversationMessages(conversationId: string): Promise<MessageData[]> {
  try {
    const snapshot = await get(ref(rtdb, `conversations/${conversationId}/messages`))
    if (!snapshot.exists()) return []

    const messages = snapshot.val() as Record<string, MessageData>
    return Object.entries(messages)
      .map(([id, msg]) => ({ ...msg, id }))
      .sort((a, b) => a.timestamp - b.timestamp)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return []
  }
}

export async function updateMessage(
  conversationId: string,
  messageId: string,
  updates: Partial<MessageData>
): Promise<void> {
  try {
    await update(ref(rtdb, `conversations/${conversationId}/messages/${messageId}`), updates)
  } catch (error) {
    console.error('Error updating message:', error)
    throw error
  }
}

export async function markMessageAsRead(conversationId: string, messageId: string): Promise<void> {
  try {
    await updateMessage(conversationId, messageId, { read: true })
  } catch (error) {
    console.error('Error marking message as read:', error)
    throw error
  }
}

export function subscribeToMessages(
  conversationId: string,
  callback: (messages: MessageData[]) => void
): Unsubscribe {
  const messagesRef = ref(rtdb, `conversations/${conversationId}/messages`)
  return onValue(messagesRef, (snapshot) => {
    if (!snapshot.exists()) {
      callback([])
      return
    }

    const messages = snapshot.val() as Record<string, MessageData>
    const messageList = Object.entries(messages)
      .map(([id, msg]) => ({ ...msg, id }))
      .sort((a, b) => a.timestamp - b.timestamp)

    callback(messageList)
  })
}

// ─── CLEANUP ───

export async function deleteConversation(conversationId: string): Promise<void> {
  try {
    await remove(ref(rtdb, `conversations/${conversationId}`))
  } catch (error) {
    console.error('Error deleting conversation:', error)
    throw error
  }
}

export async function deleteMessage(conversationId: string, messageId: string): Promise<void> {
  try {
    await remove(ref(rtdb, `conversations/${conversationId}/messages/${messageId}`))
  } catch (error) {
    console.error('Error deleting message:', error)
    throw error
  }
}

export function getTimestampInSeconds(): number {
  return Math.floor(Date.now() / 1000)
}

export function getTimestampInMillis(): number {
  return Date.now()
}
