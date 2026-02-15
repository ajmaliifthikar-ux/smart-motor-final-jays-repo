'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Bot, User, Loader2, Sparkles, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
// import { useLanguage } from '@/lib/language-context' // Temporarily disabled if context issues arise

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: number
}

interface AIChatPanelProps {
    isOpen: boolean
    onClose: () => void
}

export function AIChatPanel({ isOpen, onClose }: AIChatPanelProps) {
    // const { t, isRTL } = useLanguage()
    const isRTL = false // Default for now

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'welcome',
            role: 'assistant',
            content: 'Hello! I am your Smart Motor assistant. How can I help you with your vehicle today?',
            timestamp: Date.now()
        }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
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

    const handleSend = async () => {
        if (!input.trim() || isLoading) return

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: Date.now()
        }

        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsLoading(true)

        try {
            const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg.content,
                    userId: 'guest-user', // Should be dynamic in real auth
                    sessionId: 'session-' + Date.now() // Simple session ID
                })
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || 'Failed to get response')

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: typeof data.response === 'string' ? data.response : JSON.stringify(data.response),
                timestamp: Date.now()
            }

            setMessages(prev => [...prev, botMsg])
        } catch (error) {
            console.error(error)
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: "I'm having trouble connecting right now. Please try again later.",
                timestamp: Date.now()
            }])
        } finally {
            setIsLoading(false)
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
                <>
                    {/* Backdrop for mobile */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[105] md:hidden"
                    />

                    {/* Chat Panel */}
                    <motion.div
                        initial={{ x: '100%', opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: '100%', opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className={cn(
                            "fixed top-0 right-0 h-full w-full md:w-[450px] bg-white z-[110] shadow-2xl border-l border-gray-100 flex flex-col",
                            isRTL ? "left-0 right-auto border-l-0 border-r" : "right-0"
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white/80 backdrop-blur-md">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-[#121212] rounded-full flex items-center justify-center relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#E62329] to-[#121212] opacity-20" />
                                    <Sparkles size={20} className="text-[#E62329]" />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-[#121212]">Smart Assistant</h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <span className="w-2 h-2 bg-[#25D366] rounded-full animate-pulse" />
                                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Online</span>
                                    </div>
                                </div>
                            </div>
                            <Button variant="ghost" onClick={onClose} className="rounded-full hover:bg-gray-100 w-10 h-10 p-0 flex items-center justify-center">
                                <X size={20} />
                            </Button>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/50">
                            {messages.map((msg) => (
                                <motion.div
                                    key={msg.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn(
                                        "flex gap-4 max-w-[85%]",
                                        msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                                        msg.role === 'user'
                                            ? "bg-white border-gray-100 text-gray-600"
                                            : "bg-[#121212] border-transparent text-white"
                                    )}>
                                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                    </div>

                                    <div className={cn(
                                        "p-4 rounded-2xl text-sm leading-relaxed shadow-sm",
                                        msg.role === 'user'
                                            ? "bg-[#121212] text-white rounded-tr-none text-left"
                                            : "bg-white border border-gray-100 text-gray-700 rounded-tl-none text-left"
                                    )}>
                                        {/* Simple Markdown Parsing */}
                                        <div dangerouslySetInnerHTML={{
                                            __html: msg.content
                                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                .replace(/\n/g, '<br/>')
                                                .replace(/^\* (.*?)(<br\/>|$)/gm, '• $1$2')
                                        }} />
                                    </div>
                                </motion.div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-4 max-w-[85%]">
                                    <div className="w-8 h-8 rounded-full bg-[#121212] flex items-center justify-center shrink-0">
                                        <Bot size={14} className="text-white" />
                                    </div>
                                    <div className="bg-white border border-gray-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-2 text-gray-400">
                                        <Loader2 size={16} className="animate-spin" />
                                        <span className="text-xs font-bold uppercase tracking-wider">Thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input Area */}
                        <div className="p-6 bg-white border-t border-gray-100">
                            <div className="relative flex items-center gap-2">
                                <Input
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask anything about your car..."
                                    className="pr-12 h-14 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-gray-200 transition-all font-medium"
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isLoading}
                                    className={cn(
                                        "absolute right-2 w-10 h-10 rounded-xl transition-all duration-300",
                                        input.trim()
                                            ? "bg-[#E62329] text-white hover:bg-[#121212]"
                                            : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                                    )}
                                >
                                    <div className={cn("transition-transform", input.trim() ? "translate-x-0.5" : "")}>
                                        <Send size={18} />
                                    </div>
                                </Button>
                            </div>
                            <div className="flex justify-center mt-3">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                                    Powered by Gemini AI <Sparkles size={8} />
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
