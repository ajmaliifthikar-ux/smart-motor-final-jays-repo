'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Bot, User, Loader2, Sparkles, Zap, ChevronDown, MessageCircle } from 'lucide-react'
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

export function SmartAssistantFloating() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: '🤖 Hi! I\'m your Smart Motor AI. Ask me anything about our services, bookings, or vehicle care!',
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
            ? { ...msg, isStreaming: false, content: 'Connection error. Please try again.' }
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
      const response = await fetch('/api/ai', {
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
      toast.error('Error occurred')
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
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 z-50 w-full md:w-[450px] h-full bg-white shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden"
            >
              {/* Header */}
              <div className="bg-[#121212] px-8 py-8 flex items-center justify-between border-b border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E62329]/10 blur-3xl rounded-full" />
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 bg-[#E62329] rounded-2xl flex items-center justify-center shadow-lg shadow-[#E62329]/20">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-lg uppercase tracking-tighter">
                      Smart Assistant
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        {liveMode ? 'Gemini Live Active' : 'Online & Ready'}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-3 hover:bg-white/10 rounded-full transition-colors text-white relative z-10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Messages Area */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#FAFAF9] subtle-scrollbar">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn('flex flex-col', msg.role === 'user' ? 'items-end' : 'items-start')}
                  >
                    <div
                      className={cn(
                        'max-w-[85%] px-6 py-4 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm',
                        msg.role === 'user'
                          ? 'bg-[#121212] text-white rounded-tr-none'
                          : 'bg-white text-[#121212] border border-gray-100 rounded-tl-none'
                      )}
                    >
                      <p className="break-words whitespace-pre-wrap">{msg.content}</p>
                      {msg.isStreaming && (
                        <div className="flex gap-1.5 mt-3">
                          <span className="w-1.5 h-1.5 bg-[#E62329] rounded-full animate-bounce"></span>
                          <span className="w-1.5 h-1.5 bg-[#E62329] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                          <span className="w-1.5 h-1.5 bg-[#E62329] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                      )}
                    </div>
                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest mt-2 px-2">
                      {msg.role === 'user' ? 'Customer' : 'Smart Motor AI'} • {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </motion.div>
                ))}

                {isLoading && !liveMode && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-start">
                    <div className="bg-white text-[#121212] px-6 py-4 rounded-[2rem] rounded-tl-none border border-gray-100 text-sm font-medium shadow-sm flex items-center gap-3">
                      <Loader2 className="w-4 h-4 text-[#E62329] animate-spin" />
                      Processing Engine...
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Control Panel & Input */}
              <div className="bg-white border-t border-gray-100 p-8 space-y-6 shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                {/* Mode Switcher */}
                <div className="flex p-1.5 bg-gray-50 rounded-2xl border border-gray-100 gap-1.5">
                  <button
                    onClick={() => setLiveMode(true)}
                    className={cn(
                      'flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2',
                      liveMode
                        ? 'bg-[#E62329] text-white shadow-lg shadow-[#E62329]/20'
                        : 'text-gray-400 hover:text-[#121212]'
                    )}
                  >
                    <Zap className={cn("w-3 h-3", liveMode ? "fill-white" : "")} />
                    Live Mode
                  </button>
                  <button
                    onClick={() => setLiveMode(false)}
                    className={cn(
                      'flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2',
                      !liveMode
                        ? 'bg-[#121212] text-white shadow-lg shadow-black/20'
                        : 'text-gray-400 hover:text-[#121212]'
                    )}
                  >
                    <Sparkles className="w-3 h-3" />
                    Standard
                  </button>
                </div>

                <div className="flex gap-3 items-end">
                  <div className="flex-1 relative">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSend()
                        }
                      }}
                      placeholder="Type your message..."
                      className="text-sm bg-gray-50 border-0 rounded-[1.5rem] py-6 px-6 focus:ring-2 focus:ring-[#121212] transition-all pr-12 min-h-[60px]"
                      disabled={isLoading}
                    />
                  </div>
                  <Button
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="rounded-[1.2rem] bg-[#121212] hover:bg-[#E62329] w-14 h-14 p-0 shadow-xl transition-all active:scale-95 flex-shrink-0"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                  </Button>
                </div>
                <p className="text-[9px] text-center text-gray-400 font-bold uppercase tracking-widest">
                  Powered by Gemini 1.5 Pro • Memory Config Active
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 z-40 w-14 h-14 rounded-full bg-[#E62329] text-white shadow-2xl flex items-center justify-center hover:bg-[#121212] transition-colors"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div key="close" initial={{ opacity: 0, rotate: -180 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 180 }} transition={{ duration: 0.2 }}>
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ opacity: 0, rotate: 180 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -180 }} transition={{ duration: 0.2 }}>
              <Bot className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  )
}
