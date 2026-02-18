'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle2, Loader2, Mail, PartyPopper } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export function NewsletterSection() {
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email || isLoading) return

        setIsLoading(true)

        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Failed to subscribe')

            setIsSuccess(true)
            toast.success(data.message)
            setEmail('')
            // Track successful newsletter subscription
            fetch('/api/analytics/track-click', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ href: '/api/newsletter/subscribe', source: 'newsletter-section', medium: 'email-capture', campaign: 'newsletter-signup', label: 'newsletter-subscribe' }), keepalive: true }).catch(()=>{})
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || 'Something went wrong')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <section className="py-24 relative overflow-hidden bg-[#121212]">
            {/* Background Effects */}
            <div className="absolute inset-0 micro-noise opacity-10 pointer-events-none" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E62329]/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-4xl mx-auto bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-12 text-center md:text-left">

                    {/* Content */}
                    <div className="flex-1 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E62329]/20 text-[#E62329] text-[10px] font-black uppercase tracking-widest">
                            <Mail size={14} />
                            <span>Stay Connected</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none italic">
                            <span className="text-white/40">Join the</span> <br />
                            <span className="text-[#E62329] drop-shadow-[0_0_15px_rgba(230,35,41,0.3)]">Elite Club</span>
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed max-w-md mx-auto md:mx-0">
                            Get exclusive offers, maintenance tips, and early access to seasonal campaigns delivered to your inbox.
                        </p>
                    </div>

                    {/* Form */}
                    <div className="w-full md:w-auto md:min-w-[400px] relative">
                        <AnimatePresence>
                            {isSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                                    className="absolute inset-0 z-50 bg-[#121212] border border-[#FFD700]/20 p-8 rounded-[2rem] flex flex-col items-center justify-center text-center gap-4 shadow-2xl backdrop-blur-xl"
                                >
                                    <div className="w-20 h-20 rounded-full bg-[#FFD700]/10 flex items-center justify-center text-[#FFD700] mb-2 relative">
                                        <PartyPopper size={40} />
                                        <motion.div 
                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }} 
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute inset-0 rounded-full bg-[#FFD700]/20 blur-xl" 
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-black text-2xl uppercase tracking-tighter italic">Welcome to the Club!</h3>
                                        <p className="text-gray-400 text-sm mt-2 font-medium">Check your inbox for a special welcome gift.</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        onClick={() => setIsSuccess(false)}
                                        className="text-gray-500 hover:text-white mt-4 text-[10px] font-black uppercase tracking-widest"
                                    >
                                        Done
                                    </Button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <form onSubmit={handleSubscribe} className="space-y-4">
                            <div className="relative group">
                                <Input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="h-14 pl-6 pr-4 bg-white/10 border-white/10 text-white placeholder:text-gray-500 rounded-2xl focus:bg-white/15 focus:border-[#E62329]/50 transition-all font-medium text-base w-full"
                                    required
                                />
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#E62329]/0 via-[#E62329]/0 to-[#E62329]/0 group-hover:via-[#E62329]/10 transition-all pointer-events-none" />
                            </div>
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 bg-[#E62329] hover:bg-white hover:text-[#E62329] text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 group shadow-xl shadow-[#E62329]/20"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        <span>Subscribing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Subscribe Now</span>
                                        <Send size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </Button>
                            <p className="text-[10px] text-gray-500 text-center uppercase tracking-wider font-medium">
                                No spam. Unsubscribe anytime.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
