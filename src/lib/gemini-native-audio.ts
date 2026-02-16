/**
 * Gemini Native Audio Manager - PROPER CLIENT-SIDE IMPLEMENTATION
 * 
 * IMPORTANT: The @google/genai library requires WebSocket connections
 * which only work in browser environment. This library handles the
 * bidirectional audio streaming between client and Gemini API.
 * 
 * Model: gemini-2.5-flash-native-audio-preview-12-2025
 */

export interface NativeAudioConfig {
  userId: string
  conversationId: string
  voiceName?: string
  apiKey?: string
}

export interface AudioStreamChunk {
  type: 'audio' | 'text' | 'metadata' | 'error' | 'done' | 'turn_complete'
  content?: string
  audioData?: string
  mimeType?: string
  tokenCount?: number
  error?: string
}

/**
 * Initialize native audio session
 * MUST be called from client component ('use client')
 */
export async function initializeNativeAudioSession(
  config: NativeAudioConfig,
  apiKey: string,
  onChunk: (chunk: AudioStreamChunk) => void
) {
  // This must be in browser context
  if (typeof window === 'undefined') {
    throw new Error(
      'Native Audio requires browser environment. Use in a "use client" component.'
    )
  }

  try {
    // Dynamically import to avoid server-side issues
    const { GoogleGenAI, MediaResolution, Modality } = await import('@google/genai')

    const ai = new GoogleGenAI({ apiKey })
    const model = 'models/gemini-2.5-flash-native-audio-preview-12-2025'

    let session: any = null
    let isConnected = false

    const sessionConfig = {
      responseModalities: [Modality.AUDIO, Modality.TEXT],
      mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: config.voiceName || 'Zephyr',
          },
        },
      },
    }

    // Connect to live session
    session = await ai.live.connect({
      model,
      config: sessionConfig,
      callbacks: {
        onopen: () => {
          console.log('✅ Gemini Native Audio Connected')
          isConnected = true
          onChunk({ type: 'metadata', content: 'connected' })
        },

        onmessage: (message: any) => {
          try {
            if (message.serverContent?.modelTurn?.parts) {
              for (const part of message.serverContent.modelTurn.parts) {
                // Handle text output
                if (part.text) {
                  console.log('📝 Text:', part.text)
                  onChunk({
                    type: 'text',
                    content: part.text,
                  })
                }

                // Handle audio output
                if (part.inlineData) {
                  console.log('🔊 Audio chunk received')
                  onChunk({
                    type: 'audio',
                    audioData: part.inlineData.data,
                    mimeType: part.inlineData.mimeType || 'audio/pcm',
                  })
                }
              }
            }

            // Handle turn complete
            if (message.serverContent?.turnComplete) {
              console.log('✓ Turn complete')
              onChunk({ type: 'turn_complete' })
            }
          } catch (error) {
            console.error('Message handling error:', error)
          }
        },

        onerror: (error: any) => {
          console.error('❌ Native Audio Error:', error)
          isConnected = false
          onChunk({
            type: 'error',
            error: error.message || 'Unknown error',
          })
        },

        onclose: () => {
          console.log('🔌 Native Audio Session Closed')
          isConnected = false
          onChunk({ type: 'done' })
        },
      },
    })

    // Return session controller
    return {
      isConnected: () => isConnected,

      sendAudio: (audioBase64: string, mimeType: string = 'audio/pcm') => {
        if (!isConnected) {
          console.warn('Session not connected')
          return
        }

        console.log('📤 Sending audio...')
        session.sendClientContent({
          turns: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType,
                    data: audioBase64,
                  },
                },
              ],
            },
          ],
        })
      },

      sendText: (text: string) => {
        if (!isConnected) {
          console.warn('Session not connected')
          return
        }

        console.log('📤 Sending text:', text)
        session.sendClientContent({
          turns: [
            {
              role: 'user',
              parts: [{ text }],
            },
          ],
        })
      },

      close: () => {
        if (session && isConnected) {
          session.close()
          isConnected = false
          console.log('Closed native audio session')
        }
      },
    }
  } catch (error) {
    console.error('Failed to initialize native audio:', error)
    onChunk({
      type: 'error',
      error: `Init failed: ${error}`,
    })
    throw error
  }
}

/**
 * Utility: Convert base64 audio to Blob for playback
 */
export function audioBase64ToBlob(
  base64Data: string,
  mimeType: string = 'audio/pcm'
): Blob {
  const byteCharacters = atob(base64Data)
  const byteNumbers = new Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i)
  }
  const byteArray = new Uint8Array(byteNumbers)
  return new Blob([byteArray], { type: mimeType })
}

/**
 * Utility: Play audio from base64
 */
export async function playAudio(
  audioBase64: string,
  mimeType: string = 'audio/pcm'
): Promise<void> {
  try {
    const blob = audioBase64ToBlob(audioBase64, mimeType)
    const audioUrl = URL.createObjectURL(blob)
    const audio = new Audio(audioUrl)

    return new Promise((resolve, reject) => {
      audio.onended = () => {
        URL.revokeObjectURL(audioUrl)
        resolve()
      }
      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl)
        reject(new Error('Audio playback failed'))
      }
      audio.play().catch(reject)
    })
  } catch (error) {
    console.error('Audio playback error:', error)
    throw error
  }
}
