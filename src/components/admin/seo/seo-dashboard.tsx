'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Loader2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SEOOpportunities } from './seo-opportunities'

interface SEOReport {
    id: string
    url: string
    score: number
    technicalLogs: any
    onPageLogs: any
    contentLogs: any
    recommendations: string[]
    createdAt: string
}

export function SEODashboard() {
    const [url, setUrl] = useState('')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [report, setReport] = useState<SEOReport | null>(null)

    const runAnalysis = async () => {
        if (!url) return
        setIsAnalyzing(true)
        try {
            const res = await fetch('/api/admin/seo/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            })
            const data = await res.json()
            setReport(data)
        } catch (error) {
            console.error('Analysis failed:', error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <div className="space-y-12 pb-20">
            {/* Header / Input Area */}
            <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.03)]">
                <div className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#E62329] px-2">
                            Website Analysis Target
                        </label>
                        <div className="relative">
                            <input
                                type="url"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                placeholder="https://smartmotor.ae/new-home"
                                className="w-full h-16 bg-gray-50 border-none rounded-2xl px-6 text-sm font-medium focus:ring-2 focus:ring-[#121212] transition-all"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <Search size={20} />
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={runAnalysis}
                        disabled={isAnalyzing || !url}
                        className="h-16 px-10 bg-[#121212] text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#E62329] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-[#E62329]/20"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Sparkles size={18} />
                                Audit Page
                            </>
                        )}
                    </button>
                </div>
            </div>

            <SEOOpportunities />

            {report && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                    {/* Main Score Card */}
                    <div className="lg:col-span-1 bg-[#121212] rounded-[2.5rem] p-10 text-white flex flex-col items-center justify-center text-center">
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="88"
                                    stroke="rgba(255,255,255,0.05)"
                                    strokeWidth="12"
                                    fill="transparent"
                                />
                                <motion.circle
                                    cx="96"
                                    cy="96"
                                    r="88"
                                    stroke="#E62329"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={553}
                                    initial={{ strokeDashoffset: 553 }}
                                    animate={{ strokeDashoffset: 553 - (553 * report.score) / 100 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </svg>
                            <div className="absolute text-5xl font-black italic tracking-tighter">
                                {report.score}
                            </div>
                        </div>
                        <h3 className="mt-8 text-xl font-black uppercase tracking-widest">
                            SEO Performance
                        </h3>
                        <p className="mt-2 text-gray-400 text-sm font-medium">
                            Based on technical health and UAE market competition.
                        </p>
                    </div>

                    {/* Findings & Recommendations */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                <AlertCircle size={16} className="text-[#E62329]" />
                                AI Audit Findings
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {report.technicalLogs.issues.map((issue: string, i: number) => (
                                    <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <AlertCircle size={18} className="text-[#E62329] mt-1 shrink-0" />
                                        <p className="text-sm font-bold text-[#121212] leading-tight">{issue}</p>
                                    </div>
                                ))}
                                {report.technicalLogs.issues.length === 0 && (
                                    <div className="col-span-2 flex items-center gap-4 p-6 bg-green-50 rounded-2xl border border-green-100 text-green-700">
                                        <CheckCircle2 size={24} />
                                        <p className="font-black uppercase tracking-widest text-xs">No technical critical issues found</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center gap-2">
                                <Sparkles size={16} className="text-[#F0C225]" />
                                Strategic Recommendations
                            </h3>
                            <div className="space-y-4">
                                {report.recommendations.map((rec, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-4 p-5 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-[#121212] transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-[#121212] text-white flex items-center justify-center text-xs font-black shrink-0">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm font-medium text-[#121212]">{rec}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
