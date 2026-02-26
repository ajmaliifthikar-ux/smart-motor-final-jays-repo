import { GoogleGenerativeAI } from '@google/generative-ai'

let genAIInstance: GoogleGenerativeAI | null = null

export function getGeminiKey(): string {
  const key = process.env.GEMINI_API_KEY
  if (!key) {
    throw new Error('GEMINI_API_KEY is not set in environment variables.')
  }
  return key
}

export function getGeminiClient(): GoogleGenerativeAI {
  if (!genAIInstance) {
    const key = getGeminiKey()
    genAIInstance = new GoogleGenerativeAI(key)
  }
  return genAIInstance
}
