'use client'

export const dynamic = 'force-dynamic'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Send, Bot, User, Plus, Trash2, ChevronDown,
    MessageCircle, Sparkles, Clock, RotateCcw, Loader2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
}

interface Thread {
    id: string
    title: string
    messages: Message[]
    createdAt: Date
    updatedAt: Date
}

// ─── Thread storage (localStorage) ───────────────────────────────────────────

const STORAGE_KEY = 'sm_leyla_threads'

function loadThreads(): Thread[] {
    if (typeof window === 'undefined') return []
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        const parsed = JSON.parse(raw)
        return parsed.map((t: any) => ({
            ...t,
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt),
            messages: t.messages.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) })),
        }))
    } catch {
        return []
    }
}

function saveThreads(threads: Thread[]) {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(threads))
}

function newThread(): Thread {
    return {
        id: crypto.randomUUID(),
        title: 'New Conversation',
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
    }
}

function firstUserMessage(thread: Thread): string {
    const first = thread.messages.find(m => m.role === 'user')
    return first ? first.content.slice(0, 40) + (first.content.length > 40 ? '…' : '') : 'New Conversation'
}

function formatTime(d: Date): string {
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    if (diff < 60000) return 'just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return d.toLocaleDateString('en-AE', { day: '2-digit', month: 'short' })
}

// ─── Quick prompt chips ───────────────────────────────────────────────────────

const QUICK_PROMPTS = [
    'Book an oil change',
    'When is my next service?',
    'How much does AC service cost?',
    'What services do you offer for BMW?',
    'Check my loyalty points',
    'I need a tire check',
]

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MessagesPage() {
    const [threads, setThreads] = useState<Thread[]>([])
    const [activeId, setActiveId] = useState<string | null>(null)
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [historyOpen, setHistoryOpen] = useState(false)
    const [sessionId] = useState(() => crypto.randomUUID())
    const bottomRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLTextAreaElement>(null)

    // Load threads from localStorage
    useEffect(() => {
        const loaded = loadThreads()
        setThreads(loaded)
        if (loaded.length > 0) {
            setActiveId(loaded[0].id)
        } else {
            const t = newThread()
            setThreads([t])
            setActiveId(t.id)
            saveThreads([t])
        }
    }, [])

    const activeThread = threads.find(t => t.id === activeId) ?? null

    // Auto-scroll to bottom
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [activeThread?.messages.length, loading])

    const updateThreads = useCallback((updated: Thread[]) => {
        setThreads(updated)
        saveThreads(updated)
    }, [])

    const startNewThread = () => {
        const t = newThread()
        const updated = [t, ...threads]
        updateThreads(updated)
        setActiveId(t.id)
        setHistoryOpen(false)
        setTimeout(() => inputRef.current?.focus(), 100)
    }

    const deleteThread = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        const updated = threads.filter(t => t.id !== id)
        if (updated.length === 0) {
            const t = newThread()
            updateThreads([t])
            setActiveId(t.id)
        } else {
            updateThreads(updated)
            if (activeId === id) setActiveId(updated[0].id)
        }
    }

    const sendMessage = async (text: string) => {
        if (!text.trim() || loading || !activeId) return
        setInput('')

        const userMsg: Message = { role: 'user', content: text.trim(), timestamp: new Date() }

        // Add user message immediately
        const updatedThreads = threads.map(t => {
            if (t.id !== activeId) return t
            const msgs = [...t.messages, userMsg]
            return {
                ...t,
                messages: msgs,
                title: msgs.length === 1 ? text.trim().slice(0, 40) : t.title,
                updatedAt: new Date(),
            }
        })
        updateThreads(updatedThreads)

        setLoading(true)

        try {
            const currentThread = updatedThreads.find(t => t.id === activeId)!
            const history = currentThread.messages.slice(0, -1).map(m => ({
                role: m.role,
                content: m.content,
            }))

            const res = await fetch('/api/agent/leyla/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text.trim(), messageHistory: history, sessionId }),
            })

            const data = await res.json()
            const reply = data.response || data.message || "I'm here to help! How can I assist you today?"

            const assistantMsg: Message = { role: 'assistant', content: reply, timestamp: new Date() }
            const withReply = updatedThreads.map(t => {
                if (t.id !== activeId) return t
                return { ...t, messages: [...t.messages, assistantMsg], updatedAt: new Date() }
            })
            updateThreads(withReply)
        } catch {
            toast.error('Could not reach Leyla. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage(input)
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] -m-4 md:-m-8 overflow-hidden">

            {/* ── Top bar ─────────────────────────────────────────────────── */}
            <div className="bg-[#121212] text-white flex items-center justify-between px-5 py-4 border-b border-white/5 flex-shrink-0">
                <div className="flex items-center gap-3">
                    {/* Leyla avatar */}
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#E62329] to-[#a01820] flex items-center justify-center shadow-lg">
                        <Bot size={18} className="text-white" />
                    </div>
                    <div>
                        <p className="text-sm font-black uppercase tracking-tighter">Leyla</p>
                        <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Smart Motor AI · Always Online</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* History toggle */}
                    <button
                        onClick={() => setHistoryOpen(v => !v)}
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border',
                            historyOpen ? 'bg-white/10 border-white/20 text-white' : 'border-white/10 text-white/50 hover:text-white hover:border-white/20'
                        )}
                    >
                        <Clock size={12} />
                        History
                        <ChevronDown size={12} className={cn('transition-transform', historyOpen && 'rotate-180')} />
                    </button>
                    {/* New thread */}
                    <button
                        onClick={startNewThread}
                        className="flex items-center gap-1.5 px-3 py-2 bg-[#E62329] hover:bg-[#c41e24] text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                        <Plus size={12} /> New Chat
                    </button>
                </div>
            </div>

            {/* ── History drawer ───────────────────────────────────────────── */}
            <AnimatePresence>
                {historyOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="bg-[#0A0A0A] border-b border-white/5 overflow-hidden flex-shrink-0"
                    >
                        <div className="flex gap-2 p-3 overflow-x-auto scrollbar-none">
                            {threads.length === 0 ? (
                                <p className="text-white/30 text-xs py-2 px-3">No threads yet</p>
                            ) : (
                                threads.map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => { setActiveId(t.id); setHistoryOpen(false) }}
                                        className={cn(
                                            'flex-shrink-0 group relative flex flex-col items-start gap-1 px-4 py-3 rounded-xl border transition-all min-w-[160px] max-w-[200px] text-left',
                                            activeId === t.id
                                                ? 'bg-[#E62329]/20 border-[#E62329]/40 text-white'
                                                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:text-white'
                                        )}
                                    >
                                        <p className="text-[10px] font-black uppercase tracking-wider truncate w-full">
                                            {firstUserMessage(t)}
                                        </p>
                                        <p className="text-[9px] text-white/30">{formatTime(t.updatedAt)}</p>
                                        <button
                                            onClick={(e) => deleteThread(t.id, e)}
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all"
                                        >
                                            <Trash2 size={10} />
                                        </button>
                                    </button>
                                ))
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Messages area ────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4">

                {/* Empty state — show quick prompts */}
                {!activeThread?.messages.length && (
                    <div className="flex flex-col items-center justify-center h-full text-center gap-6 py-10">
                        <div className="w-20 h-20 rounded-[2rem] bg-gradient-to-br from-[#E62329] to-[#a01820] flex items-center justify-center shadow-2xl">
                            <Sparkles size={32} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-[#121212] italic mb-2">
                                Hi, I'm Leyla
                            </h2>
                            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
                                Your Smart Motor AI assistant. Ask me anything about your car, book a service, or check your appointments.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                            {QUICK_PROMPTS.map(prompt => (
                                <button
                                    key={prompt}
                                    onClick={() => sendMessage(prompt)}
                                    className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-gray-600 hover:border-[#E62329] hover:text-[#E62329] transition-all shadow-sm"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Messages */}
                {activeThread?.messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className={cn('flex gap-3', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
                    >
                        {/* Avatar */}
                        <div className={cn(
                            'w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5',
                            msg.role === 'user'
                                ? 'bg-[#121212] text-white'
                                : 'bg-gradient-to-br from-[#E62329] to-[#a01820] text-white'
                        )}>
                            {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                        </div>

                        {/* Bubble */}
                        <div className={cn(
                            'max-w-[75%] md:max-w-[60%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                            msg.role === 'user'
                                ? 'bg-[#121212] text-white rounded-tr-sm'
                                : 'bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-sm'
                        )}>
                            <p className="whitespace-pre-wrap">{msg.content}</p>
                            <p className={cn(
                                'text-[9px] font-bold mt-1.5',
                                msg.role === 'user' ? 'text-white/30 text-right' : 'text-gray-300'
                            )}>
                                {msg.timestamp.toLocaleTimeString('en-AE', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </motion.div>
                ))}

                {/* Loading dots */}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-3"
                    >
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#E62329] to-[#a01820] flex items-center justify-center flex-shrink-0">
                            <Bot size={14} className="text-white" />
                        </div>
                        <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-1.5">
                            {[0, 1, 2].map(i => (
                                <motion.div
                                    key={i}
                                    className="w-2 h-2 bg-[#E62329] rounded-full"
                                    animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                <div ref={bottomRef} />
            </div>

            {/* ── Input area ───────────────────────────────────────────────── */}
            <div className="border-t border-gray-100 bg-white/80 backdrop-blur-xl px-4 md:px-8 py-4 flex-shrink-0">
                <div className="max-w-4xl mx-auto flex items-end gap-3">
                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask Leyla anything about your car or services…"
                            rows={1}
                            className="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50/50 px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E62329]/30 focus:border-[#E62329] transition-all pr-12 max-h-32 overflow-y-auto"
                            style={{ lineHeight: '1.5' }}
                            onInput={e => {
                                const t = e.currentTarget
                                t.style.height = 'auto'
                                t.style.height = Math.min(t.scrollHeight, 128) + 'px'
                            }}
                        />
                    </div>
                    <button
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim() || loading}
                        className={cn(
                            'w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 flex-shrink-0',
                            input.trim() && !loading
                                ? 'bg-[#E62329] hover:bg-[#c41e24] text-white shadow-lg shadow-red-900/20 scale-100'
                                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        )}
                    >
                        {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                </div>
                <p className="text-center text-[9px] text-gray-300 font-bold uppercase tracking-widest mt-2">
                    Leyla · Smart Motor AI · Press Enter to send
                </p>
            </div>
        </div>
    )
}
