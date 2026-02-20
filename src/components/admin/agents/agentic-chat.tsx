'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader, AlertCircle, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface AgenticChatProps {
  title: string
  description: string
  placeholder?: string
  agentEndpoint: string
  icon?: React.ReactNode
  onMessageSent?: (message: string) => void
  initialMessage?: string
}

export function AgenticChat({
  title,
  description,
  placeholder = 'Ask me anything...',
  agentEndpoint,
  icon,
  onMessageSent,
  initialMessage
}: AgenticChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (initialMessage) {
      handleSendMessage(initialMessage)
    }
  }, [initialMessage])

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || input.trim()
    if (!text) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)
    setError(null)
    onMessageSent?.(text)

    try {
      const response = await fetch(agentEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: messages }),
      })

      if (!response.ok) {
        throw new Error(`Failed to get response: ${response.statusText}`)
      }

      const data = await response.json()

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || data.message || 'No response',
        timestamp: new Date(),
        metadata: data.metadata,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message')
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-[#FAFAF9] to-[#F5F5F3]">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-gray-200 bg-white shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center gap-3 mb-2">
            {icon && <div className="text-[#E62329]">{icon}</div>}
            <h1 className="text-2xl font-black text-[#121212]">{title}</h1>
          </div>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 rounded-2xl bg-[#E62329]/10 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-[#E62329]" />
            </div>
            <p className="text-gray-500 text-center max-w-sm">
              Start a conversation to get AI-powered insights and recommendations.
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  'flex gap-3',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-[#E62329]/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-[#E62329]" />
                  </div>
                )}

                <div
                  className={cn(
                    'max-w-2xl rounded-2xl px-4 py-3',
                    msg.role === 'user'
                      ? 'bg-[#121212] text-white'
                      : 'bg-white text-[#121212] border border-gray-200'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.metadata && (
                    <div className="mt-2 text-xs opacity-70">
                      {Object.entries(msg.metadata).map(([key, value]) => (
                        <div key={key}>
                          <strong>{key}:</strong> {JSON.stringify(value)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-[#E62329]/10 flex items-center justify-center">
                  <Loader className="w-4 h-4 text-[#E62329] animate-spin" />
                </div>
                <div className="bg-white text-[#121212] border border-gray-200 rounded-2xl px-4 py-3">
                  <p className="text-sm text-gray-500">Thinking...</p>
                </div>
              </div>
            )}
            {error && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                </div>
                <div className="bg-red-50 text-red-900 border border-red-200 rounded-2xl px-4 py-3">
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 border-t border-gray-200 bg-white p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex gap-3"
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholder}
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-[#121212] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E62329]/20 focus:bg-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className={cn(
              'px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-wider flex items-center gap-2 transition-all',
              loading || !input.trim()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#E62329] text-white hover:bg-[#c91e23] shadow-md'
            )}
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
