/**
 * useNativeAudio Hook - CLIENT SIDE ONLY
 * Use 'use client' directive in component
 */

'use client'

import { useCallback, useState, useRef, useEffect } from 'react'
import {
  initializeNativeAudioSession,
  playAudio,
  type AudioStreamChunk,
  type NativeAudioConfig,
} from '@/lib/gemini-native-audio'

export function useNativeAudio(
  conversationId: string = `conv_${Date.now()}`,
  voiceName: string = 'Zephyr'
) {
  const [isStreaming, setIsStreaming] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [transcript, setTranscript] = useState('')
  const [audioChunks, setAudioChunks] = useState<string[]>([])

  const sessionRef = useRef<any>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Initialize session on mount
  useEffect(() => {
    const initSession = async () => {
      try {
        // Get API key from fetch to server endpoint (key is never exposed to client)
        const response = await fetch('/api/ai/get-key')
        const { key } = await response.json()

        const config: NativeAudioConfig = {
          userId: `user_${Date.now()}`,
          conversationId,
          voiceName,
          apiKey: key,
        }

        const session = await initializeNativeAudioSession(
          config,
          key,
          handleChunk
        )
        sessionRef.current = session
        setIsConnected(session.isConnected())
      } catch (err) {
        console.error('Session init error:', err)
        setError(err instanceof Error ? err.message : 'Failed to init session')
      }
    }

    initSession()

    return () => {
      sessionRef.current?.close()
    }
  }, [conversationId, voiceName])

  const handleChunk = useCallback((chunk: AudioStreamChunk) => {
    switch (chunk.type) {
      case 'text':
        setTranscript((prev) => prev + (chunk.content || ''))
        break
      case 'audio':
        if (chunk.audioData) {
          setAudioChunks((prev) => [...prev, chunk.audioData!])
        }
        break
      case 'error':
        setError(chunk.error || 'Unknown error')
        break
      case 'turn_complete':
      case 'done':
        setIsStreaming(false)
        break
      case 'metadata':
        if (chunk.content === 'connected') {
          setIsConnected(true)
        }
        break
    }
  }, [])

  const sendAudio = useCallback(async (audioBase64: string, mimeType: string = 'audio/pcm') => {
    if (!sessionRef.current) {
      setError('Session not initialized')
      return
    }

    setIsStreaming(true)
    setError(null)
    setTranscript('')
    setAudioChunks([])

    try {
      sessionRef.current.sendAudio(audioBase64, mimeType)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Send failed')
      setIsStreaming(false)
    }
  }, [])

  const sendText = useCallback(async (text: string) => {
    if (!sessionRef.current) {
      setError('Session not initialized')
      return
    }

    setIsStreaming(true)
    setError(null)
    setTranscript('')
    setAudioChunks([])

    try {
      sessionRef.current.sendText(text)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Send failed')
      setIsStreaming(false)
    }
  }, [])

  const startListening = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)()
      }

      audioChunksRef.current = []

      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm;codecs=opus',
        })
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
        err instanceof Error ? err.message : 'Microphone access denied'
      )
    }
  }, [sendAudio])

  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }, [])

  const playAudioResponse = useCallback(async () => {
    if (audioChunks.length === 0) {
      setError('No audio response available')
      return
    }

    try {
      // For now, play first chunk (ideally combine all chunks)
      await playAudio(audioChunks[0])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Playback failed')
    }
  }, [audioChunks])

  const reset = useCallback(() => {
    setIsStreaming(false)
    setError(null)
    setTranscript('')
    setAudioChunks([])
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
