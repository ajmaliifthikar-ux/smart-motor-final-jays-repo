'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { GoogleGenAI, LiveServerMessage, Modality, MediaResolution, Session, Tool } from '@google/genai'
import { toast } from 'sonner'
import { parseMimeType, createWavHeader } from '@/lib/wav-utils'
import { LAYLA_TOOLS, GET_SYSTEM_INSTRUCTION } from '@/lib/ai/layla-config'
import { getBrandsWithModels, getServices, getAvailableSlots, searchCustomer } from '@/app/actions'

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || ''
const MODEL = 'models/gemini-2.0-flash-exp' // Reverting to stable live model for maximum compatibility

export function useGeminiLive(onWidgetRequest?: (msg: any) => void) {
  const [isConnected, setIsConnected] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const sessionRef = useRef<Session | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const workletNodeRef = useRef<AudioWorkletNode | null>(null)
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null)
  
  const disconnect = useCallback(() => {
    console.log('🔌 Disconnecting Layla...')
    if (sessionRef.current) {
      sessionRef.current.close()
      sessionRef.current = null
    }
    if (sourceNodeRef.current) {
      sourceNodeRef.current.disconnect()
      sourceNodeRef.current = null
    }
    if (workletNodeRef.current) {
      workletNodeRef.current.disconnect()
      workletNodeRef.current = null
    }
    setIsConnected(false)
    setIsSpeaking(false)
  }, [])

  const playAudioChunk = async (inlineData: { mimeType: string, data: string }) => {
    if (!audioContextRef.current) return
    try {
        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume()
        }
        
        const binaryString = window.atob(inlineData.data)
        const bytes = new Uint8Array(binaryString.length)
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i)
        }
        
        const audioData = new Int16Array(bytes.buffer)
        const audioBuffer = audioContextRef.current.createBuffer(1, audioData.length, 24000)
        const channelData = audioBuffer.getChannelData(0)
        for (let i = 0; i < audioData.length; i++) {
            channelData[i] = audioData[i] / 32768.0
        }
        
        const source = audioContextRef.current.createBufferSource()
        source.buffer = audioBuffer
        source.connect(audioContextRef.current.destination)
        source.start()
    } catch (e) {
        console.error('Playback Error:', e)
    }
  }

  const connect = useCallback(async () => {
    if (!API_KEY) {
      toast.error('AI Configuration Missing')
      return
    }

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 })
      }

      const [brands, services, geo] = await Promise.all([
        getBrandsWithModels().catch(() => []),
        getServices().catch(() => []),
        fetch('https://ipapi.co/json/').then(res => res.json()).catch(() => ({}))
      ])

      const systemInstruction = GET_SYSTEM_INSTRUCTION({
        currentTime: new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai', dateStyle: 'full', timeStyle: 'short' }),
        userLocation: `${geo.city || 'Unknown'}, ${geo.country_name || 'UAE'}`,
        brands: brands.map(b => b.name).join(', '),
        services: services.map(s => `${s.name} (ID: ${s.id})`).join(', ')
      })

      const ai = new GoogleGenAI({ apiKey: API_KEY })
      
      const session = await ai.live.connect({
        model: MODEL,
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          systemInstruction: { parts: [{ text: systemInstruction }] },
          tools: LAYLA_TOOLS,
        },
        callbacks: {
          onopen: () => {
            setIsConnected(true)
            toast.success('Layla connected')
            session.sendClientContent({
                turns: [{ parts: [{ text: "Hello! I am Layla. How can I assist you today?" }] }]
            })
          },
          onmessage: async (msg: LiveServerMessage) => {
            if (msg.serverContent?.modelTurn?.parts?.[0]?.inlineData) {
              const inlineData = msg.serverContent.modelTurn.parts[0].inlineData
              if (inlineData.data) {
                  setIsSpeaking(true)
                  await playAudioChunk({
                      mimeType: inlineData.mimeType || 'audio/pcm;rate=24000',
                      data: inlineData.data
                  })
              }
            }
            if (msg.serverContent?.turnComplete) {
              setIsSpeaking(false)
            }

            if (msg.toolCall) {
                const functionCalls = msg.toolCall.functionCalls || []
                const toolResponses = []

                for (const call of functionCalls) {
                    try {
                        let result: any = { success: false }
                        
                        if (call.name === 'create_booking') {
                            const response = await fetch('/api/bookings', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(call.args)
                            })
                            const json = await response.json()
                            result = { success: json.success, id: json.bookingId }
                        } 
                        else if (call.name === 'check_availability') {
                            const slots = await getAvailableSlots((call.args as any).date)
                            result = { slots }
                        }
                        else if (call.name === 'search_customer') {
                            const history = await searchCustomer((call.args as any).query)
                            result = { history }
                        }
                        else if (call.name === 'request_user_input') {
                            if (onWidgetRequest) {
                                onWidgetRequest({
                                    content: (call.args as any).prompt,
                                    widget: { type: (call.args as any).type }
                                })
                            }
                            result = { status: 'displayed' }
                        }

                        toolResponses.push({
                            id: call.id,
                            name: call.name,
                            response: { result }
                        })
                    } catch (e: any) {
                        toolResponses.push({ id: call.id, name: call.name, response: { error: e.message } })
                    }
                }
                session.sendToolResponse({ functionResponses: toolResponses })
            }
          },
          onerror: (err) => {
            console.error('❌ WebSocket Error:', err)
            disconnect()
          },
          onclose: () => {
            setIsConnected(false)
          }
        }
      })

      sessionRef.current = session
      // Start Microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      await audioContextRef.current.audioWorklet.addModule('/worklets/audio-processor.js')
      const source = audioContextRef.current.createMediaStreamSource(stream)
      const worklet = new AudioWorkletNode(audioContextRef.current, 'audio-processor')
      worklet.port.onmessage = (event) => {
        const pcm16 = float32ToInt16(event.data)
        const base64 = arrayBufferToBase64(pcm16.buffer)
        if (sessionRef.current) {
            sessionRef.current.sendClientContent({
              turns: [{ parts: [{ inlineData: { mimeType: 'audio/pcm;rate=16000', data: base64 } }] }]
            })
        }
      }
      source.connect(worklet)
      sourceNodeRef.current = source
      workletNodeRef.current = worklet

    } catch (err: any) {
      console.error('❌ Connection Failed:', err)
      toast.error('Failed to wake up Layla.')
    }
  }, [onWidgetRequest, disconnect])

  return { connect, disconnect, isConnected, isSpeaking, error }
}

function float32ToInt16(float32: Float32Array) {
  const int16 = new Int16Array(float32.length)
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]))
    int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF
  }
  return int16
}

function arrayBufferToBase64(buffer: ArrayBuffer) {
  let binary = ''
  const bytes = new Uint8Array(buffer)
  const len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
}
