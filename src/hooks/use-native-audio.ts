/**
 * Hook for interacting with Gemini Native Audio bidirectional streaming
 * Handles audio capture, streaming, and response playback
 */

'use client'

import { useCallback, useState, useRef } from 'react'

export interface AudioStreamEvent {
  type: 'audio' | 'text' | 'metadata' | 'error' | 'done' | 'turn_complete'
  content?: string
  audioData?: string
  mimeType?: string
  tokenCount?: number
  finishReason?: string
  error?: string
}

export interface UseNativeAudioReturn {
  isStreaming: boolean
  isConnected: boolean
  error: string | null
  transcript: string
  audioChunks: string[]
  sendAudio: (audioBase64: string, mimeType?: string) => Promise<void>
  sendText: (text: string) => Promise<void>
  startListening: () => Promise<void>
  stopListening: () => void
  playAudioResponse: () => Promise<void>
  reset: () => void
}

export function useNativeAudio(
  conversationId?: string,
  voiceName: string = 'Zephyr'
): UseNativeAudioReturn {
  const [isStreaming, setIsStreaming] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transcript, setTranscript] = useState('')
  const [audioChunks, setAudioChunks] = useState<string[]>([])

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const abortControllerRef = useRef<AbortController | null>(null)

  /**
   * Send audio data to the native audio API
   */
  const sendAudio = useCallback(
    async (audioBase64: string, mimeType: string = 'audio/pcm') => {
      setIsStreaming(true)
      setError(null)
      setTranscript('')
      setAudioChunks([])
      abortControllerRef.current = new AbortController()

      try {
        const response = await fetch('/api/ai/native-audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            audioBase64,
            mimeType,
            conversationId: conversationId || `conv_${Date.now()}`,
            voiceName,
          }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const reader = response.body?.getReader()
        if (!reader) throw new Error('No response body')

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          // Process SSE events
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const event: AudioStreamEvent = JSON.parse(line.slice(6))

                switch (event.type) {
                  case 'text':
                    setTranscript((prev) => prev + (event.content || ''))
                    break
                  case 'audio':
                    setAudioChunks((prev) => [...prev, event.audioData || ''])
                    break
                  case 'error':
                    setError(event.error || 'Unknown error')
                    break
                  case 'turn_complete':
                  case 'done':
                    setIsConnected(true)
                    break
                }
              } catch (e) {
                console.error('Failed to parse SSE event:', e)
              }
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
          console.error('Native audio error:', err)
        }
      } finally {
        setIsStreaming(false)
      }
    },
    [conversationId, voiceName]
  )

  /**
   * Send text input instead of audio
   */
  const sendText = useCallback(
    async (text: string) => {
      setIsStreaming(true)
      setError(null)
      setTranscript('')
      setAudioChunks([])
      abortControllerRef.current = new AbortController()

      try {
        const response = await fetch('/api/ai/native-audio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            textInput: text,
            conversationId: conversationId || `conv_${Date.now()}`,
            voiceName,
          }),
          signal: abortControllerRef.current.signal,
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const reader = response.body?.getReader()
        if (!reader) throw new Error('No response body')

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })

          // Process SSE events
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const event: AudioStreamEvent = JSON.parse(line.slice(6))

                switch (event.type) {
                  case 'text':
                    setTranscript((prev) => prev + (event.content || ''))
                    break
                  case 'audio':
                    setAudioChunks((prev) => [...prev, event.audioData || ''])
                    break
                  case 'error':
                    setError(event.error || 'Unknown error')
                    break
                  case 'turn_complete':
                  case 'done':
                    setIsConnected(true)
                    break
                }
              } catch (e) {
                console.error('Failed to parse SSE event:', e)
              }
            }
          }
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message)
          console.error('Native audio error:', err)
        }
      } finally {
        setIsStreaming(false)
      }
    },
    [conversationId, voiceName]
  )

  /**
   * Start capturing audio from microphone
   */
  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Initialize audio context if needed
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }

      audioChunksRef.current = []

      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const reader = new FileReader()

        reader.onloadend = async () => {
          const base64 = (reader.result as string).split(',')[1]
          await sendAudio(base64, 'audio/webm;codecs=opus')
        }

        reader.readAsDataURL(audioBlob)
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to access microphone'
      )
    }
  }, [sendAudio])

  /**
   * Stop capturing audio
   */
  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }, [])

  /**
   * Play the audio response
   */
  const playAudioResponse = useCallback(async () => {
    if (audioChunks.length === 0) {
      setError('No audio response available')
      return
    }

    try {
      // Combine audio chunks and create a playable blob
      const audioData = audioChunks
        .map((chunk) => Buffer.from(chunk, 'base64'))
        .reduce((acc, buf) => Buffer.concat([acc, buf]), Buffer.alloc(0))

      const audioBlob = new Blob([audioData], { type: 'audio/wav' })
      const audioUrl = URL.createObjectURL(audioBlob)

      const audio = new Audio(audioUrl)
      await audio.play()

      // Cleanup
      setTimeout(() => URL.revokeObjectURL(audioUrl), 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to play audio')
    }
  }, [audioChunks])

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setIsStreaming(false)
    setIsConnected(false)
    setError(null)
    setTranscript('')
    setAudioChunks([])
    abortControllerRef.current?.abort()
  }, [])

  return {
    isStreaming,
    isConnected,
    error,
    transcript,
    audioChunks,
    sendAudio,
    sendText,
    startListening,
    stopListening,
    playAudioResponse,
    reset,
  }
}
