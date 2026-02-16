'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Bot, User, Loader2, Sparkles, Zap, MessageCircle } from 'lucide-react'
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
  tokenCount?: number
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
      content: '🤖 Hello! I\'m your Smart Motor AI Assistant. How can I help you with your vehicle today? You can ask about our services, booking status, or technical advice.',
      timestamp: Date.now(),
    },
  ])

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [liveMode, setLiveMode] = useState(true)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

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
      tokenCount: 0,
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

      if (!response.ok || !response.body) {
        throw new Error('Failed to start stream')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

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
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === streamingId
                      ? {
                          ...msg,
                          content: msg.content + chunk.content,
                          tokenCount: chunk.tokenCount,
                        }
                      : msg
                  )
                )
              } else if (chunk.type === 'metadata' || chunk.type === 'done') {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === streamingId
                      ? { ...msg, isStreaming: false }
                      : msg
                  )
                )
                setStreamingMessageId(null)
              }
            } catch (e) {
              console.error('Parse error:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Stream error:', error)
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamingId
            ? { ...msg, isStreaming: false, content: 'Connection lost. Please try again.' }
            : msg
        )
      )
    } finally {
      setIsLoading(false)
      setStreamingMessageId(null)
    }
  }

  const handleRegularResponse = async (userMsg: Message) => {
    const convId = conversationId || `conv_${Date.now()}`
    setConversationId(convId)

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg.content,
          conversationId: convId,
        }),
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'Failed')

      setMessages((prev) => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        timestamp: Date.now(),
      }])
    } catch (error) {
      console.error(error)
      toast.error('AI response error')
    } finally {
      setIsLoading(false)
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

    if (liveMode) {
      await handleStreamingResponse(userMsg)
    } else {
      await handleRegularResponse(userMsg)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[105]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 z-[110] w-full md:w-[500px] h-full bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#121212] px-8 py-10 flex items-center justify-between border-b border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#E62329]/10 blur-[80px] rounded-full pointer-events-none" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-14 h-14 bg-[#E62329] rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-[#E62329]/20 transform rotate-3">
                  <Bot className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-black text-xl uppercase tracking-tighter">
                    Smart Assistant
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse" />
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      {liveMode ? 'Bi-Directional Live Mode' : 'Standard Intelligence'}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-white/10 rounded-full transition-colors text-white relative z-10"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#FAFAF9] subtle-scrollbar">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex flex-col', msg.role === 'user' ? 'items-end' : 'items-start')}
                >
                  <div
                    className={cn(
                      'max-w-[85%] px-7 py-5 rounded-[2.2rem] text-[15px] font-medium leading-relaxed shadow-sm',
                      msg.role === 'user'
                        ? 'bg-[#121212] text-white rounded-tr-none'
                        : 'bg-white text-[#121212] border border-gray-100 rounded-tl-none'
                    )}
                  >
                    <p className="break-words whitespace-pre-wrap">{msg.content}</p>
                    {msg.isStreaming && (
                      <div className="flex gap-1.5 mt-4">
                        <span className="w-2 h-2 bg-[#E62329] rounded-full animate-bounce"></span>
                        <span className="w-2 h-2 bg-[#E62329] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-2 h-2 bg-[#E62329] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-3 px-2 flex items-center gap-2">
                    {msg.role === 'user' ? (
                      <><User size={10} /> Customer</>
                    ) : (
                      <><Bot size={10} /> Smart Motor AI</>
                    )}
                    • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-numeric', minute: '2-numeric' })}
                  </span>
                </motion.div>
              ))}

              {isLoading && !liveMode && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-start">
                  <div className="bg-white text-[#121212] px-7 py-5 rounded-[2.2rem] rounded-tl-none border border-gray-100 text-sm font-medium shadow-sm flex items-center gap-4">
                    <Loader2 className="w-5 h-5 text-[#E62329] animate-spin" />
                    Analyzing your request...
                  </div>
                </motion.div>
              )}
            </div>

            {/* Control Panel & Input */}
            <div className="bg-white border-t border-gray-100 p-8 space-y-6 shadow-[0_-15px_50px_rgba(0,0,0,0.03)]">
              {/* Mode Switcher */}
              <div className="flex p-1.5 bg-gray-50 rounded-[1.5rem] border border-gray-100 gap-1.5">
                <button
                  onClick={() => setLiveMode(true)}
                  className={cn(
                    'flex-1 py-4 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3',
                    liveMode
                      ? 'bg-[#E62329] text-white shadow-lg shadow-[#E62329]/20 scale-[1.02]'
                      : 'text-gray-400 hover:text-[#121212]'
                  )}
                >
                  <Zap className={cn("w-4 h-4", liveMode ? "fill-white" : "")} />
                  Live Conversational Mode
                </button>
                <button
                  onClick={() => setLiveMode(false)}
                  className={cn(
                    'flex-1 py-4 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3',
                    !liveMode
                      ? 'bg-[#121212] text-white shadow-lg shadow-black/20 scale-[1.02]'
                      : 'text-gray-400 hover:text-[#121212]'
                  )}
                >
                  <Sparkles className="w-4 h-4" />
                  Standard Search
                </button>
              </div>

              <div className="flex gap-4 items-end">
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
                    placeholder="Describe your vehicle's issue..."
                    className="w-full text-sm font-bold bg-gray-50 border-0 rounded-[1.8rem] py-5 px-8 focus:ring-2 focus:ring-[#121212] transition-all resize-none min-h-[70px] max-h-[150px] subtle-scrollbar"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="rounded-[1.4rem] bg-[#121212] hover:bg-[#E62329] w-16 h-16 p-0 shadow-xl transition-all active:scale-95 flex-shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <Send className="w-6 h-6" />
                  )}
                </Button>
              </div>
              <div className="flex items-center justify-center gap-4 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                <span className="flex items-center gap-1"><ShieldCheck size={10} className="text-[#25D366]" /> 256-bit Encrypted</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span>Gemini 1.5 Pro Enabled</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span>Personal Memory Active</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function ShieldCheck({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
