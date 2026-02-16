'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send,
  X,
  Bot,
  User,
  Loader2,
  Sparkles,
  Zap,
  ChevronDown,
  MessageCircle,
  Mic,
  MicOff,
  Volume2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { useNativeAudio } from '@/hooks/use-native-audio'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  isStreaming?: boolean
  tokenCount?: number
  audioChunks?: string[]
  inputType?: 'text' | 'audio'
}

export function SmartAssistantWithAudio() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        '🤖 Hi! I\'m your Smart Motor AI. Ask me anything via text or voice! 🎤',
      timestamp: Date.now(),
    },
  ])

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null)
  const [audioMode, setAudioMode] = useState(false)
  const [isListening, setIsListening] = useState(false)

  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Native audio hook
  const {
    sendText,
    sendAudio,
    transcript,
    audioChunks,
    isStreaming: isAudioStreaming,
    isConnected,
    error: audioError,
    startListening,
    stopListening,
    playAudioResponse,
    reset: resetAudio,
  } = useNativeAudio(conversationId || `chat_${Date.now()}`, 'Zephyr')

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current && !audioMode) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen, audioMode])

  // Handle text-based streaming
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
      inputType: 'text',
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

      if (!response.ok) throw new Error('Failed to get response')

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event = JSON.parse(line.slice(6))

              if (event.type === 'token' && event.content) {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === streamingId
                      ? {
                          ...msg,
                          content: msg.content + event.content,
                          tokenCount: event.tokenCount || msg.tokenCount,
                        }
                      : msg
                  )
                )
              }
            } catch (e) {
              console.error('Parse error:', e)
            }
          }
        }
      }
    } catch (error) {
      console.error('Streaming error:', error)
      toast.error('Failed to get response')
    } finally {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamingId ? { ...msg, isStreaming: false } : msg
        )
      )
      setStreamingMessageId(null)
    }
  }

  // Handle text chat submit
  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
      inputType: 'text',
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      await handleStreamingResponse(userMsg)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle voice input
  const handleStartVoice = async () => {
    if (!isConnected) {
      toast.error('Audio connection not ready. Please wait...')
      return
    }

    setIsListening(true)
    try {
      await startListening()
    } catch (error) {
      toast.error('Microphone access denied')
      setIsListening(false)
    }
  }

  const handleStopVoice = () => {
    setIsListening(false)
    stopListening()

    // Show user message (will get transcript from audio)
    if (transcript.trim()) {
      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: transcript,
        timestamp: Date.now(),
        inputType: 'audio',
      }
      setMessages((prev) => [...prev, userMsg])

      // Add assistant response with audio
      const streamingId = (Date.now() + 1).toString()
      const assistantMsg: Message = {
        id: streamingId,
        role: 'assistant',
        content: transcript, // Will be replaced with actual response
        timestamp: Date.now(),
        isStreaming: true,
        audioChunks: audioChunks,
        inputType: 'audio',
      }
      setMessages((prev) => [...prev, assistantMsg])
      setStreamingMessageId(streamingId)

      // Audio response will auto-populate via callbacks
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === streamingId ? { ...msg, isStreaming: false } : msg
          )
        )
      }, 2000)
    }

    resetAudio()
  }

  // Handle playing audio response
  const handlePlayAudio = async (audioChunks: string[] | undefined) => {
    if (!audioChunks || audioChunks.length === 0) {
      toast.error('No audio response available')
      return
    }

    try {
      await playAudioResponse()
      toast.success('Playing audio...')
    } catch (error) {
      toast.error('Failed to play audio')
    }
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              className="flex items-center justify-center"
            >
              <MessageCircle size={24} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-40 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot size={20} />
                  <div>
                    <h3 className="font-semibold">Smart Motor AI</h3>
                    <p className="text-xs text-blue-100">
                      {isConnected ? '🟢 Online' : '⚪ Connecting...'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mode Toggle */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setAudioMode(false)}
                  className={`flex-1 py-1 px-3 rounded text-sm font-medium transition ${
                    !audioMode
                      ? 'bg-white text-blue-600'
                      : 'bg-blue-500/30 text-white hover:bg-blue-500/50'
                  }`}
                >
                  💬 Text
                </button>
                <button
                  onClick={() => setAudioMode(true)}
                  className={`flex-1 py-1 px-3 rounded text-sm font-medium transition ${
                    audioMode
                      ? 'bg-white text-blue-600'
                      : 'bg-blue-500/30 text-white hover:bg-blue-500/50'
                  }`}
                >
                  🎤 Voice
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50"
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>

                    {/* Audio Playback Button */}
                    {msg.audioChunks && msg.audioChunks.length > 0 && (
                      <button
                        onClick={() => handlePlayAudio(msg.audioChunks)}
                        className="mt-2 flex items-center gap-1 text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                      >
                        <Volume2 size={14} />
                        Play Audio
                      </button>
                    )}

                    {msg.isStreaming && (
                      <div className="flex gap-1 mt-2">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.1s' }}
                        />
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: '0.2s' }}
                        />
                      </div>
                    )}

                    {msg.tokenCount && (
                      <p className="text-xs text-gray-500 mt-1">
                        {msg.tokenCount} tokens
                      </p>
                    )}

                    {msg.inputType && (
                      <p className="text-xs text-gray-400 mt-1">
                        {msg.inputType === 'audio' ? '🎤 Voice' : '💬 Text'}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input Area */}
            <div className="border-t p-4 bg-white rounded-b-2xl">
              {audioError && (
                <div className="text-xs text-red-600 mb-2">{audioError}</div>
              )}

              {!audioMode ? (
                // Text Input
                <form onSubmit={handleSendText} className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="bg-blue-600 hover:bg-blue-700 h-10 px-4"
                  >
                    {isLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                  </Button>
                </form>
              ) : (
                // Voice Input
                <div className="space-y-2">
                  <button
                    onClick={
                      isListening ? handleStopVoice : handleStartVoice
                    }
                    disabled={!isConnected || isAudioStreaming}
                    className={`w-full py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                      isListening
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400'
                    }`}
                  >
                    {isListening ? (
                      <>
                        <MicOff size={18} />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic size={18} />
                        Start Recording
                      </>
                    )}
                  </button>

                  {isAudioStreaming && (
                    <p className="text-xs text-gray-600 text-center">
                      Processing your audio...
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
