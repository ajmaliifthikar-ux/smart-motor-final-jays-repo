import { GoogleGenerativeAI } from '@google/generative-ai'

/**
 * Get the Google Generative AI client.
 * This is a singleton-like factory to ensure we don't accidentally expose secrets
 * by hardcoding them in multiple places.
 */
export const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment variables')
  }

  return new GoogleGenerativeAI(apiKey)
}
