'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Bot, User, Loader2, Sparkles, Zap, Mic, Headphones, Volume2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  isStreaming?: boolean
}

interface AIChatPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function AIChatPanel({ isOpen, onClose }: AIChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '🤖 Hello! I\'m your Smart Motor AI Assistant. How can I help you with your vehicle today?',
      timestamp: Date.now(),
    },
  ])

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // Cleanup audio
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
      if (audioContextRef.current) audioContextRef.current.close()
    }
  }, [])

  const startVoiceMode = async () => {
    setIsVoiceMode(true)
    
    // Greet with voice
    const greeting = "Hello! I am ready to talk. How can I assist you with your car today?"
    const utterance = new SpeechSynthesisUtterance(greeting)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    window.speechSynthesis.speak(utterance)

    // Simulate audio visualization
    setupVisualizer()
  }

  const stopVoiceMode = () => {
    setIsVoiceMode(false)
    window.speechSynthesis.cancel()
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
  }

  const setupVisualizer = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 32
      source.connect(analyserRef.current)
      
      const draw = () => {
        if (!isVoiceMode) return
        animationFrameRef.current = requestAnimationFrame(draw)
      }
      draw()
    } catch (err) {
      console.error('Microphone access denied', err)
      toast.error('Microphone access needed for conversational mode')
      setIsVoiceMode(false)
    }
  }

  const handleStreamingResponse = async (userMsg: Message) => {
    const convId = conversationId || `conv_${Date.now()}`
    setConversationId(convId)

    const streamingId = Date.now().toString()
    setStreamingMessageId(streamingId)

    const assistantMsg: Message = {
      id: streamingId,
      role: 'assistant',
      content: '',
      timestamp: Date.now(),
      isStreaming: true,
    }

    setMessages((prev) => [...prev, assistantMsg])

    try {
      const response = await fetch('/api/ai/live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          conversationId: convId,
        }),
      })

      if (!response.ok || !response.body) throw new Error('Failed to start stream')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''
      let fullText = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines[lines.length - 1]

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i]
          if (line.startsWith('data: ')) {
            try {
              const chunk = JSON.parse(line.slice(6))
              if (chunk.type === 'token') {
                fullText += chunk.content
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === streamingId ? { ...msg, content: fullText } : msg
                  )
                )
              } else if (chunk.type === 'done') {
                setStreamingMessageId(null)
                if (isVoiceMode) {
                  const utterance = new SpeechSynthesisUtterance(fullText)
                  window.speechSynthesis.speak(utterance)
                }
              }
            } catch (e) {}
          }
        }
      }
    } catch (error) {
      console.error('Stream error:', error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamingId ? { ...msg, isStreaming: false, content: 'Connection lost.' } : msg
        )
      )
    } finally {
      setIsLoading(false)
      setStreamingMessageId(null)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)
    await handleStreamingResponse(userMsg)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-24 right-8 z-[110] w-[400px] h-[600px] bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#121212] px-8 py-6 flex items-center justify-between border-b border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E62329]/10 blur-3xl rounded-full" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 bg-[#E62329] rounded-2xl flex items-center justify-center transform rotate-3">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-white font-black text-lg uppercase tracking-tighter">Smart AI</h3>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white relative z-10">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAFAF9] subtle-scrollbar">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('flex flex-col', msg.role === 'user' ? 'items-end' : 'items-start')}
              >
                <div
                  className={cn(
                    'max-w-[85%] px-5 py-3.5 rounded-[1.8rem] text-sm font-medium leading-relaxed shadow-sm',
                    msg.role === 'user' ? 'bg-[#121212] text-white rounded-tr-none' : 'bg-white text-[#121212] border border-gray-100 rounded-tl-none'
                  )}
                >
                  <p className="break-words whitespace-pre-wrap">{msg.content}</p>
                  {msg.isStreaming && (
                    <div className="flex gap-1 mt-2">
                      <span className="w-1.5 h-1.5 bg-[#E62329] rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-[#E62329] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-[#E62329] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Audio Visualizer Overlay (Only in Voice Mode) */}
          <AnimatePresence>
            {isVoiceMode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="absolute inset-x-0 bottom-[100px] h-[150px] bg-white/80 backdrop-blur-md flex flex-col items-center justify-center z-20 px-8"
              >
                <div className="flex items-center gap-1.5 mb-4">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [10, Math.random() * 40 + 20, 10] }}
                      transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.05 }}
                      className={cn("w-1.5 rounded-full", i % 2 === 0 ? "bg-[#E62329]" : "bg-[#121212]")}
                    />
                  ))}
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]">Listening & Speaking...</p>
                <button 
                  onClick={stopVoiceMode}
                  className="mt-4 px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-[#E62329] transition-colors"
                >
                  Exit Voice
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input */}
          <div className="bg-white border-t border-gray-100 p-6 space-y-4">
            <div className="flex gap-3 items-end">
              <button
                onClick={isVoiceMode ? stopVoiceMode : startVoiceMode}
                className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-md flex-shrink-0",
                  isVoiceMode ? "bg-[#E62329] text-white animate-pulse" : "bg-gray-100 text-gray-500 hover:bg-[#121212] hover:text-white"
                )}
              >
                {isVoiceMode ? <Volume2 size={20} /> : <Headphones size={20} />}
              </button>
              
              <div className="flex-1 relative">
                <textarea
                  ref={inputRef as any}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSend()
                    }
                  }}
                  placeholder="Ask anything..."
                  className="w-full text-sm font-bold bg-gray-50 border-0 rounded-[1.5rem] py-3 px-5 focus:ring-2 focus:ring-[#121212] transition-all resize-none min-h-[48px] max-h-[120px] subtle-scrollbar"
                  disabled={isLoading || isVoiceMode}
                />
              </div>
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim() || isVoiceMode}
                className="rounded-2xl bg-[#121212] hover:bg-[#E62329] w-12 h-12 p-0 shadow-lg flex-shrink-0"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
