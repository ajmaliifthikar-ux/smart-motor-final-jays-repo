'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Bot, User, Loader2, Sparkles, Zap } from 'lucide-react'
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

interface LiveChatPanelProps {
  isOpen: boolean
  onClose: () => void
  initialMessage?: string
}

export function LiveChatPanel({
  isOpen,
  onClose,
  initialMessage,
}: LiveChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! 👋 I am your Smart Motor AI assistant. I can help you with bookings, services, and vehicle care. Type your question or click "Live Mode" for real-time streaming.',
      timestamp: Date.now(),
    },
  ])

  const [input, setInput] = useState(initialMessage || '')
  const [isLoading, setIsLoading] = useState(false)
  const [liveMode, setLiveMode] = useState(true)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null
  )

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

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

  // Handle initial message
  useEffect(() => {
    if (initialMessage && isOpen) {
      setInput(initialMessage)
    }
  }, [initialMessage, isOpen])

  // Cleanup event source on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
    }
  }, [])

  const handleStreamingResponse = async (userMsg: Message) => {
    const convId = conversationId || `conv_${Date.now()}`
    setConversationId(convId)

    const streamingId = Date.now().toString()
    setStreamingMessageId(streamingId)

    // Create assistant message placeholder
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

        // Parse SSE events
        const lines = buffer.split('\n')
        buffer = lines[lines.length - 1]

        for (let i = 0; i < lines.length - 1; i++) {
          const line = lines[i]
          if (line.startsWith('data: ')) {
            try {
              const chunk = JSON.parse(line.slice(6))

              if (chunk.type === 'token') {
                // Append token to message
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
              } else if (chunk.type === 'metadata') {
                // Update with final metadata
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === streamingId
                      ? {
                          ...msg,
                          isStreaming: false,
                          tokenCount: chunk.tokenCount,
                        }
                      : msg
                  )
                )
              } else if (chunk.type === 'error') {
                toast.error(chunk.error || 'Stream error occurred')
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === streamingId
                      ? { ...msg, isStreaming: false, content: 'Error: ' + chunk.error }
                      : msg
                  )
                )
              } else if (chunk.type === 'done') {
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
      toast.error(error instanceof Error ? error.message : 'Connection failed')

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamingId
            ? {
                ...msg,
                isStreaming: false,
                content:
                  "I'm having trouble connecting. Please try again later.",
              }
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

      if (!response.ok) throw new Error(data.error || 'Failed to get response')

      const botMsg: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: data.response,
        timestamp: Date.now(),
      }

      setMessages((prev) => [...prev, botMsg])
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : 'Error occurred')
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] h-[32rem] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#121212] to-[#1a1a1a] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#E62329] rounded-full">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-black text-sm uppercase tracking-wider">
                  Smart Motor AI
                </h3>
                <p className="text-xs text-gray-400">
                  {liveMode ? '🔴 Live Mode' : '⚪ Standard Mode'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close chat"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FAFAF9]"
          >
            {messages.map((msg, idx) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'flex gap-3',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-[#E62329] flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={cn(
                    'max-w-xs px-4 py-3 rounded-2xl',
                    msg.role === 'user'
                      ? 'bg-[#121212] text-white'
                      : 'bg-white text-[#121212] border border-gray-200'
                  )}
                >
                  <p className="text-sm leading-relaxed break-words">
                    {msg.content}
                  </p>
                  {msg.isStreaming && (
                    <div className="flex gap-1 mt-2">
                      <span className="w-2 h-2 bg-[#E62329] rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-[#E62329] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-2 h-2 bg-[#E62329] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  )}
                  {msg.tokenCount && (
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Zap className="w-3 h-3" />
                      {msg.tokenCount} tokens
                    </p>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-[#E62329] flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))}

            {isLoading && !liveMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3 justify-start"
              >
                <div className="w-8 h-8 rounded-full bg-[#E62329] flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </div>
                <div className="bg-white text-[#121212] px-4 py-3 rounded-2xl border border-gray-200">
                  <p className="text-sm text-gray-600">Thinking...</p>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="bg-white border-t border-gray-200 p-4 space-y-3">
            {/* Mode Toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => setLiveMode(true)}
                className={cn(
                  'flex-1 py-2 px-3 rounded-full text-xs font-black uppercase tracking-widest transition-all',
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
                  'flex-1 py-2 px-3 rounded-full text-xs font-black uppercase tracking-widest transition-all',
                  !liveMode
                    ? 'bg-[#121212] text-white'
                    : 'bg-gray-100 text-[#121212] hover:bg-gray-200'
                )}
              >
                <Sparkles className="inline w-3 h-3 mr-1" />
                Normal
              </button>
            </div>

            {/* Input Field */}
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything..."
                className="flex-1 rounded-full border-gray-300 bg-gray-50 placeholder-gray-500 focus:bg-white focus:border-[#E62329]"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="rounded-full bg-[#E62329] hover:bg-[#121212] text-white p-0 w-10 h-10 flex items-center justify-center"
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
  )
}
