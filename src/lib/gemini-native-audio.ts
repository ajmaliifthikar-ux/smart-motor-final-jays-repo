/**
 * Gemini Native Audio Live Session Manager
 * Handles bidirectional audio streaming with gemini-2.5-flash-native-audio-preview-12-2025
 */

import {
  GoogleGenAI,
  LiveServerMessage,
  MediaResolution,
  Modality,
  Session,
} from '@google/genai'

export interface NativeAudioConfig {
  userId: string
  conversationId: string
  voiceName?: string
  maxTokens?: number
  temperature?: number
  systemPrompt?: string
}

export interface AudioStreamChunk {
  type: 'audio' | 'text' | 'metadata' | 'error' | 'done' | 'turn_complete'
  content?: string
  audioData?: string // base64 encoded audio
  mimeType?: string
  tokenCount?: number
  finishReason?: string
  error?: string
}

/**
 * Gemini Native Audio Session - Bidirectional streaming with native audio model
 */
export class GeminiNativeAudioSession {
  private config: NativeAudioConfig
  private session: Session | undefined
  private responseQueue: LiveServerMessage[] = []
  private audioParts: string[] = []
  private isConnected = false
  private tokenCount = 0
  private systemPrompt: string

  constructor(config: NativeAudioConfig) {
    this.config = config
    this.systemPrompt = config.systemPrompt || this.getDefaultSystemPrompt()
  }

  /**
   * Initialize and connect to live audio session
   */
  async connect(): Promise<void> {
    try {
      const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyD9nwv7J0MXrgk9O5xcBl-ptLBjfIjzxnk'
      const ai = new GoogleGenAI({ apiKey })

      const model = 'models/gemini-2.5-flash-native-audio-preview-12-2025'

      const config = {
        responseModalities: [Modality.AUDIO, Modality.TEXT],
        mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: this.config.voiceName || 'Zephyr',
            },
          },
        },
        systemInstruction: this.systemPrompt,
        contextWindowCompression: {
          triggerTokens: '25600',
          slidingWindow: { targetTokens: '12800' },
        },
      }

      this.session = await ai.live.connect({
        model,
        callbacks: {
          onopen: () => {
            console.log('✅ Native Audio Session Connected')
            this.isConnected = true
          },
          onmessage: (message: LiveServerMessage) => {
            this.responseQueue.push(message)
          },
          onerror: (e: ErrorEvent) => {
            console.error('❌ Native Audio Error:', e.message)
            this.isConnected = false
          },
          onclose: (e: CloseEvent) => {
            console.log('🔌 Native Audio Session Closed:', e.reason)
            this.isConnected = false
          },
        },
        config,
      })
    } catch (error) {
      console.error('Failed to connect native audio session:', error)
      throw error
    }
  }

  /**
   * Stream audio and text message bidirectionally
   */
  async *streamAudio(audioBase64: string, mimeType: string = 'audio/pcm'): AsyncGenerator<AudioStreamChunk> {
    if (!this.isConnected) {
      yield {
        type: 'error',
        error: 'Native Audio session not connected. Call connect() first.',
      }
      return
    }

    try {
      // Send audio input
      if (this.session) {
        this.session.sendClientContent({
          turns: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: audioBase64,
                  },
                },
              ],
            },
          ],
        })
      }

      // Process response
      yield* this.handleAudioResponse()
    } catch (error) {
      console.error('Stream error:', error)
      yield {
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Handle model response (audio and text)
   */
  private async *handleAudioResponse(): AsyncGenerator<AudioStreamChunk> {
    let done = false
    this.audioParts = []

    while (!done && this.session) {
      const message = await this.waitForMessage()

      if (message.serverContent?.modelTurn?.parts) {
        for (const part of message.serverContent.modelTurn.parts) {
          // Handle audio response
          if (part.inlineData) {
            const audioData = part.inlineData.data || ''
            this.audioParts.push(audioData)

            yield {
              type: 'audio',
              audioData: audioData,
              mimeType: part.inlineData.mimeType || 'audio/pcm',
            }
          }

          // Handle text response
          if (part.text) {
            this.tokenCount += part.text.split(/\s+/).length
            yield {
              type: 'text',
              content: part.text,
              tokenCount: this.tokenCount,
            }
          }

          // Handle file data (if applicable)
          if (part.fileData) {
            console.log(`📁 File received: ${part.fileData.fileUri}`)
          }
        }
      }

      // Check if turn is complete
      if (message.serverContent?.turnComplete) {
        done = true
        yield {
          type: 'turn_complete',
          tokenCount: this.tokenCount,
        }
      }
    }

    yield { type: 'done' }
  }

  /**
   * Wait for next message from queue
   */
  private async waitForMessage(): Promise<LiveServerMessage> {
    let message: LiveServerMessage | undefined
    while (!message) {
      message = this.responseQueue.shift()
      if (!message) {
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
    }
    return message
  }

  /**
   * Send text message (without audio)
   */
  async *streamText(text: string): AsyncGenerator<AudioStreamChunk> {
    if (!this.isConnected) {
      yield {
        type: 'error',
        error: 'Native Audio session not connected. Call connect() first.',
      }
      return
    }

    try {
      // Send text input
      if (this.session) {
        this.session.sendClientContent({
          turns: [
            {
              role: 'user',
              parts: [{ text }],
            },
          ],
        })
      }

      // Process response
      yield* this.handleAudioResponse()
    } catch (error) {
      console.error('Stream error:', error)
      yield {
        type: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Convert audio chunks to WAV format
   */
  convertToWav(mimeType: string): Buffer | null {
    if (this.audioParts.length === 0) return null

    interface WavOptions {
      numChannels: number
      sampleRate: number
      bitsPerSample: number
    }

    const parseMimeType = (mime: string): WavOptions => {
      const [fileType, ...params] = mime.split(';').map((s) => s.trim())
      const [, format] = fileType.split('/')

      const options: WavOptions = {
        numChannels: 1,
        bitsPerSample: 16,
        sampleRate: 24000, // Default sample rate
      }

      if (format && format.startsWith('L')) {
        const bits = parseInt(format.slice(1), 10)
        if (!isNaN(bits)) {
          options.bitsPerSample = bits
        }
      }

      for (const param of params) {
        const [key, value] = param.split('=').map((s) => s.trim())
        if (key === 'rate') {
          options.sampleRate = parseInt(value, 10)
        }
      }

      return options
    }

    const createWavHeader = (dataLength: number, options: WavOptions): Buffer => {
      const { numChannels, sampleRate, bitsPerSample } = options
      const byteRate = (sampleRate * numChannels * bitsPerSample) / 8
      const blockAlign = (numChannels * bitsPerSample) / 8
      const buffer = Buffer.alloc(44)

      buffer.write('RIFF', 0)
      buffer.writeUInt32LE(36 + dataLength, 4)
      buffer.write('WAVE', 8)
      buffer.write('fmt ', 12)
      buffer.writeUInt32LE(16, 16)
      buffer.writeUInt16LE(1, 20)
      buffer.writeUInt16LE(numChannels, 22)
      buffer.writeUInt32LE(sampleRate, 24)
      buffer.writeUInt32LE(byteRate, 28)
      buffer.writeUInt16LE(blockAlign, 32)
      buffer.writeUInt16LE(bitsPerSample, 34)
      buffer.write('data', 36)
      buffer.writeUInt32LE(dataLength, 40)

      return buffer
    }

    const options = parseMimeType(mimeType)
    const dataLength = this.audioParts.reduce((a, b) => a + b.length, 0)
    const wavHeader = createWavHeader(dataLength, options)

    const audioBuffers = this.audioParts.map((data) => Buffer.from(data, 'base64'))
    const audioBuffer = Buffer.concat(audioBuffers)

    return Buffer.concat([wavHeader, audioBuffer])
  }

  /**
   * Close the session
   */
  close(): void {
    if (this.session) {
      this.session.close()
      this.isConnected = false
      console.log('🔌 Native Audio Session Closed')
    }
  }

  /**
   * Check if session is connected
   */
  isSessionConnected(): boolean {
    return this.isConnected
  }

  /**
   * Get default system prompt
   */
  private getDefaultSystemPrompt(): string {
    return `You are a helpful and professional AI assistant for Smart Motor, a luxury automotive service center in UAE.

Your role is to:
- Help customers with booking services, pricing, and vehicle care information
- Provide technical advice on car maintenance (general guidance only, not professional diagnosis)
- Answer questions about Smart Motor's services, facilities, and expertise
- Be friendly, professional, and solution-focused
- Personalize responses based on the customer's history

Always:
- Be honest about limitations - refer complex technical questions to our technicians
- Maintain professional tone while being approachable
- Suggest booking or contacting us for specific solutions
- Respond naturally and conversationally when audio is used`
  }

  /**
   * Get token count
   */
  getTokenCount(): number {
    return this.tokenCount
  }

  /**
   * Reset token count
   */
  resetTokenCount(): void {
    this.tokenCount = 0
  }

  /**
   * Get collected audio parts (raw)
   */
  getAudioParts(): string[] {
    return this.audioParts
  }
}

/**
 * Create a new native audio session
 */
export function createNativeAudioSession(config: NativeAudioConfig): GeminiNativeAudioSession {
  return new GeminiNativeAudioSession(config)
}
