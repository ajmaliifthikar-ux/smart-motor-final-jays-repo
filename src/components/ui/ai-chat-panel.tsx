'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Bot, Loader2, Headphones, Volume2, Mic, Sparkles, Check, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { AIChatVisualizer } from './ai-chat-visualizer'
import { useGeminiLive } from '@/hooks/use-gemini-live'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  isStreaming?: boolean
  widget?: {
    type: 'phone' | 'email' | 'confirmation' | 'date'
    placeholder?: string
  }
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
      content: "Welcome to Smart Motor. How can I assist with your vehicle today?",
      timestamp: Date.now(),
    },
  ])

  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [conversationId] = useState(() => `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`)
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { connect, disconnect, isConnected, isSpeaking } = useGeminiLive((toolMsg: any) => {
      // Callback from hook to inject widget messages
      setMessages(prev => [...prev, {
          id: `widget_${Date.now()}`,
          role: 'assistant',
          content: toolMsg.content,
          timestamp: Date.now(),
          widget: toolMsg.widget
      }])
  })

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  const startVoiceMode = async () => {
    setIsVoiceMode(true)
    await connect()
  }

  const stopVoiceMode = () => {
    setIsVoiceMode(false)
    disconnect()
  }

  const handleSend = async (overrideText?: string) => {
    const text = overrideText || input
    if (!text.trim() || isLoading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
    }

    setMessages((prev) => [...prev, userMsg])
    if (!overrideText) setInput('')
    setIsLoading(true)
    
    try {
        const response = await fetch('/api/ai/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: userMsg.content,
                conversationId: conversationId,
            }),
        })

        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Technical connectivity issue')
        
        const assistantMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: data.response || "I've processed your request. How else can I help?",
            timestamp: Date.now(),
        }

        setMessages((prev) => [...prev, assistantMsg])
    } catch (err) {
        console.error(err)
        toast.error("Connectivity issue. Please try again.")
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(10px)' }}
          className={cn(
              "fixed z-[110] bg-white/95 backdrop-blur-3xl shadow-2xl border border-white/20 flex flex-col overflow-hidden",
              "bottom-0 right-0 w-full h-full md:bottom-28 md:right-8 md:w-[380px] md:h-[600px] md:rounded-[2.5rem]"
          )}
        >
          {/* Header */}
          <div className="bg-[#121212] px-6 py-6 flex items-center justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#E62329]/10 blur-3xl rounded-full" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 bg-[#E62329] rounded-xl flex items-center justify-center transform -rotate-6 shadow-lg">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-black text-sm uppercase tracking-widest italic leading-none">Smart <span className="silver-shine">Specialist</span></h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Active Connection</span>
                </div>
              </div>
            </div>
            <button
                onClick={onClose}
                aria-label="Close chat"
                className="p-2.5 bg-white/5 hover:bg-[#E62329] rounded-full transition-all text-white/40 hover:text-white relative z-10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FAFAF9]/30 subtle-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                <motion.div
                    initial={{ opacity: 0, x: msg.role === 'user' ? 5 : -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn('flex flex-col', msg.role === 'user' ? 'items-end' : 'items-start')}
                >
                    <div
                    className={cn(
                        'max-w-[85%] px-5 py-4 rounded-[1.8rem] text-[12px] font-bold leading-relaxed shadow-sm relative overflow-hidden',
                        msg.role === 'user' 
                            ? 'bg-[#121212] text-white rounded-tr-none' 
                            : 'bg-white text-[#121212] border border-gray-100 rounded-tl-none'
                    )}
                    >
                    {msg.role === 'assistant' && <div className="absolute top-0 left-0 w-1 h-full bg-[#E62329]" />}
                    <p className="break-words whitespace-pre-wrap">{msg.content}</p>
                    </div>
                </motion.div>

                {/* Inline Widgets */}
                {msg.widget && (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="ml-2 mr-2 bg-gray-50/80 rounded-2xl p-4 border border-gray-100 space-y-3 shadow-inner"
                    >
                        {msg.widget.type === 'confirmation' ? (
                            <div className="flex gap-2">
                                <Button 
                                    className="flex-1 rounded-xl bg-[#121212] text-white text-[10px] uppercase font-black tracking-widest h-10"
                                    onClick={() => handleSend('Yes, please proceed.')}
                                >
                                    Approve
                                </Button>
                                <Button 
                                    variant="outline"
                                    className="flex-1 rounded-xl border-gray-200 text-gray-400 text-[10px] uppercase font-black tracking-widest h-10"
                                    onClick={() => handleSend('No, let me change something.')}
                                >
                                    Modify
                                </Button>
                            </div>
                        ) : (
                            <div className="relative flex items-center">
                                <input 
                                    autoFocus
                                    placeholder={msg.widget.placeholder || `Enter ${msg.widget.type}...`}
                                    className="w-full bg-white border-gray-200 rounded-xl px-4 py-3 text-xs font-bold focus:ring-2 focus:ring-[#E62329] transition-all"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSend((e.target as HTMLInputElement).value)
                                    }}
                                />
                                <button 
                                    className="absolute right-2 w-8 h-8 bg-[#121212] text-white rounded-lg flex items-center justify-center hover:bg-[#E62329] transition-colors"
                                    onClick={(e) => {
                                        const val = (e.currentTarget.previousSibling as HTMLInputElement).value
                                        if (val) handleSend(val)
                                    }}
                                >
                                    <Check size={14} />
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
              </div>
            ))}
            {isLoading && (
                <div className="flex gap-2 p-2">
                    <Loader2 className="w-3 h-3 animate-spin text-[#E62329]" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 italic">Processing...</span>
                </div>
            )}
          </div>

          {/* Audio Visualization Overlay */}
          <AnimatePresence>
            {isVoiceMode && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: '160px' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-[#121212] flex flex-col items-center justify-center z-20 px-6 relative overflow-hidden"
              >
                <div className="absolute inset-0 carbon-fiber opacity-10" />
                
                <AIChatVisualizer 
                  isSpeaking={isSpeaking} 
                  isListening={!isSpeaking} 
                  className="mb-4"
                />

                <p className={cn(
                    "text-[8px] font-black uppercase tracking-[0.3em] transition-colors duration-500 relative z-10",
                    isSpeaking ? "text-[#E62329]" : "text-white"
                )}>
                  {isSpeaking ? "Agent Speaking" : "Listening..."}
                </p>
                <button 
                  onClick={stopVoiceMode}
                  className="mt-6 px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-[7px] font-black uppercase tracking-widest text-white/60 transition-all border border-white/5 relative z-10"
                >
                  Close Voice
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Input Area */}
          <div className="bg-white p-6 pb-10 md:pb-6 border-t border-gray-50 relative z-30">
            <div className="flex gap-2 items-center bg-gray-50 rounded-2xl px-4 py-2 border border-gray-100 shadow-inner">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSend()
                }}
                placeholder="Ask anything..."
                aria-label="Chat message"
                className="flex-1 text-xs font-bold bg-transparent border-0 py-2 focus:ring-0 placeholder:text-gray-300"
                disabled={isLoading || isVoiceMode}
              />
              
              <div className="flex items-center gap-1">
                <button
                    onClick={isVoiceMode ? stopVoiceMode : startVoiceMode}
                    aria-label="Toggle voice mode"
                    className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-500 group",
                    isVoiceMode 
                        ? "bg-[#E62329] text-white animate-pulse shadow-lg shadow-[#E62329]/30" 
                        : "text-gray-400 hover:bg-gray-200 hover:text-[#121212]"
                    )}
                >
                    {isVoiceMode ? <Volume2 size={18} /> : <Headphones size={18} />}
                </button>
                
                <Button
                    onClick={() => handleSend()}
                    aria-label="Send message"
                    disabled={isLoading || !input.trim() || isVoiceMode}
                    className="rounded-lg bg-[#121212] hover:bg-[#E62329] w-9 h-9 p-0 transition-all duration-500 shadow-xl"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
