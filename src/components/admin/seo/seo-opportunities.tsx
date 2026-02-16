'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShieldAlert, TrendingUp, Zap, Check, ChevronRight, Loader2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface Proposal {
    id: string
    type: 'content' | 'technical' | 'local'
    title: string
    description: string
    impact: 'HIGH' | 'MEDIUM' | 'LOW'
    status: 'PENDING' | 'EXECUTING' | 'COMPLETED'
}

export function SEOOpportunities() {
    const [proposals, setProposals] = useState<Proposal[]>([
        { id: '1', type: 'technical', title: 'Optimize Hero Meta Tags', description: 'Update meta description to include "Luxury Car Service Abu Dhabi" for better CTR.', impact: 'HIGH', status: 'PENDING' },
        { id: '2', type: 'content', title: 'Internal Linking: 911 Turbo', description: 'Add 3 internal links from high-authority brand pages to the specialized 911 service page.', impact: 'MEDIUM', status: 'PENDING' },
        { id: '3', type: 'local', title: 'Respond to 5-Star Review', description: 'Autonomous agent has drafted a response for Ahmed Al Mansouri.', impact: 'LOW', status: 'PENDING' }
    ])

    const handleApprove = async (id: string) => {
        setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'EXECUTING' } : p))
        
        // Simulate Agent Execution
        setTimeout(() => {
            setProposals(prev => prev.map(p => p.id === id ? { ...p, status: 'COMPLETED' } : p))
            toast.success("SEO Optimization Executed")
        }, 2000)
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-400">Autonomous Proposals</h3>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#E62329]/5 rounded-full border border-[#E62329]/10">
                    <Sparkles size={14} className="text-[#E62329]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#E62329]">Agent Swarm Active</span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <AnimatePresence>
                    {proposals.map((prop) => (
                        <motion.div
                            key={prop.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={cn(
                                "p-8 rounded-[2.5rem] bg-white border transition-all duration-500 flex flex-col md:flex-row items-center gap-8 group",
                                prop.status === 'COMPLETED' ? "border-green-100 bg-green-50/20 opacity-60" : "border-gray-100 hover:shadow-2xl"
                            )}
                        >
                            <div className={cn(
                                "w-16 h-16 rounded-[1.5rem] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 duration-500",
                                prop.type === 'technical' ? "bg-blue-50 text-blue-500" : 
                                prop.type === 'content' ? "bg-[#E62329]/5 text-[#E62329]" : "bg-orange-50 text-orange-500"
                            )}>
                                {prop.type === 'technical' ? <ShieldAlert size={28} /> : 
                                 prop.type === 'content' ? <TrendingUp size={28} /> : <Zap size={28} />}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={cn(
                                        "text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full",
                                        prop.impact === 'HIGH' ? "bg-red-500 text-white" : "bg-gray-100 text-gray-500"
                                    )}>
                                        {prop.impact} Impact
                                    </span>
                                    <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest italic">SEO-AGENT-{prop.id}</span>
                                </div>
                                <h4 className="text-lg font-black text-[#121212] uppercase tracking-tighter italic">{prop.title}</h4>
                                <p className="text-xs font-medium text-gray-500 mt-2 leading-relaxed">{prop.description}</p>
                            </div>

                            <div className="shrink-0">
                                {prop.status === 'PENDING' ? (
                                    <Button 
                                        onClick={() => handleApprove(prop.id)}
                                        className="bg-[#121212] text-white rounded-full px-8 h-14 text-[10px] font-black uppercase tracking-widest hover:bg-[#E62329] transition-all flex items-center gap-3 shadow-xl"
                                    >
                                        Execute Optimization
                                        <ChevronRight size={14} />
                                    </Button>
                                ) : prop.status === 'EXECUTING' ? (
                                    <div className="flex items-center gap-3 px-8 text-gray-400">
                                        <Loader2 className="animate-spin" size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Applying...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-green-500 px-8">
                                        <Check size={18} />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Implemented</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    )
}
