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
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-4 z-40 w-96 max-w-[calc(100vw-2rem)] h-[32rem] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#121212] to-[#1a1a1a] px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#E62329] rounded-full animate-pulse">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-wider">
                    Smart Assistant
                  </h3>
                  <p className="text-xs text-gray-400">
                    {liveMode ? '🔴 Live Mode' : '⚪ Standard'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAFAF9]">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('flex gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-[#E62329] flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}

                  <div
                    className={cn(
                      'max-w-xs px-3 py-2 rounded-2xl text-sm',
                      msg.role === 'user'
                        ? 'bg-[#121212] text-white'
                        : 'bg-white text-[#121212] border border-gray-200'
                    )}
                  >
                    <p className="break-words">{msg.content}</p>
                    {msg.isStreaming && (
                      <div className="flex gap-1 mt-1">
                        <span className="w-1.5 h-1.5 bg-[#E62329] rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-[#E62329] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-[#E62329] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && !liveMode && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#E62329] flex items-center justify-center">
                    <Loader2 className="w-3 h-3 text-white animate-spin" />
                  </div>
                  <div className="bg-white text-[#121212] px-3 py-2 rounded-2xl border border-gray-200 text-sm">
                    Thinking...
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 p-3 space-y-2">
              <div className="flex gap-1">
                <button
                  onClick={() => setLiveMode(true)}
                  className={cn(
                    'flex-1 py-1.5 px-2 rounded-full text-xs font-black uppercase tracking-widest transition-all',
                    liveMode
                      ? 'bg-[#E62329] text-white'
                      : 'bg-gray-100 text-[#121212] hover:bg-gray-200'
                  )}
                >
                  <Zap className="inline w-3 h-3 mr-1" />
                  Live
                </button>
                <button
                  onClick={() => setLiveMode(false)}
                  className={cn(
                    'flex-1 py-1.5 px-2 rounded-full text-xs font-black uppercase tracking-widest transition-all',
                    !liveMode
                      ? 'bg-[#121212] text-white'
                      : 'bg-gray-100 text-[#121212] hover:bg-gray-200'
                  )}
                >
                  <Sparkles className="inline w-3 h-3 mr-1" />
                  Normal
                </button>
              </div>

              <div className="flex gap-2">
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
                  placeholder="Ask anything..."
                  className="text-sm bg-gray-50"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="rounded-full bg-[#E62329] hover:bg-[#121212] w-9 h-9 p-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
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
