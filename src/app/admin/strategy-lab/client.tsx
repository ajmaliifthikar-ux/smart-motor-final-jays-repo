'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Bot, LineChart, Target, Zap, Loader2, Sparkles, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export function StrategyLabClient({ initialStats }: { initialStats: any }) {
    const [query, setQuery] = useState('')
    const [analysis, setHistory] = useState<{ query: string, response: string }[]>([])
    const [isPending, setIsPending] = useState(false)

    const handleSubmit = async () => {
        if (!query.trim()) return
        setIsPending(true)
        
        try {
            const response = await fetch('/api/admin/strategy', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            })
            const data = await response.json()
            setHistory(prev => [{ query, response: data.response }, ...prev])
            setQuery('')
        } catch (err) {
            console.error(err)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Control Center */}
            <div className="lg:col-span-1 space-y-8">
                <Card className="p-8 rounded-[2.5rem] bg-[#121212] text-white border-none shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#E62329]/10 blur-3xl rounded-full" />
                    <Bot className="text-[#E62329] mb-6" size={40} />
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-4 italic">Agent Terminal</h3>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-relaxed mb-8">
                        Enter strategic inquiries regarding market positioning, unit economics, or competitive landscape.
                    </p>
                    
                    <div className="space-y-6">
                        <Textarea 
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="e.g. Conduct a SWOT analysis of our current service offering vs QuickFit..."
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 rounded-2xl min-h-[150px] p-6 italic"
                        />
                        <Button 
                            onClick={handleSubmit}
                            disabled={isPending || !query.trim()}
                            className="w-full h-14 bg-[#E62329] text-white rounded-full font-black uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-all shadow-xl flex items-center gap-3"
                        >
                            {isPending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                            Execute Analysis
                        </Button>
                    </div>
                </Card>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                    {initialStats.map((stat: any) => (
                        <div key={stat.status} className="p-6 rounded-[2rem] bg-white border border-gray-100 shadow-sm">
                            <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.status}</p>
                            <p className="text-2xl font-black text-[#121212]">{stat._count}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Insight Feed */}
            <div className="lg:col-span-2 space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">Strategic Work-Products</h2>
                    <div className="flex gap-2">
                        <div className="w-2 h-2 bg-[#E62329] rounded-full animate-pulse" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Live Agent Sync</span>
                    </div>
                </div>

                <div className="space-y-8 h-[700px] overflow-y-auto pr-4 subtle-scrollbar">
                    <AnimatePresence>
                        {analysis.map((item, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <Sparkles size={120} />
                                </div>
                                <div className="flex items-start gap-6 mb-8 border-b border-gray-50 pb-8">
                                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#121212] shrink-0">
                                        <Target size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#E62329] mb-1">Inquiry</p>
                                        <h4 className="text-lg font-black text-[#121212] uppercase tracking-tighter italic">{item.query}</h4>
                                    </div>
                                </div>
                                <div className="prose prose-sm max-w-none">
                                    <div className="text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">
                                        {item.response}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {analysis.length === 0 && !isPending && (
                        <div className="h-full flex flex-col items-center justify-center text-center p-20 bg-gray-50/50 rounded-[4rem] border-2 border-dashed border-gray-200">
                            <LineChart size={64} className="text-gray-200 mb-6" />
                            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Awaiting strategic directive...</p>
                        </div>
                    )}
                    {isPending && (
                        <div className="p-10 bg-white rounded-[3rem] border border-gray-100 animate-pulse">
                            <div className="h-4 w-1/4 bg-gray-100 rounded mb-4" />
                            <div className="h-8 w-3/4 bg-gray-100 rounded mb-8" />
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-50 rounded w-full" />
                                <div className="h-4 bg-gray-50 rounded w-5/6" />
                                <div className="h-4 bg-gray-50 rounded w-4/6" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
