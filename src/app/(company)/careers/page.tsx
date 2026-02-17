'use client'

import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Briefcase, MapPin, Clock, ArrowRight, Star, Zap, Users, Send, CheckCircle2, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'

const jobs = [
    {
        title: 'Master Diagnostic Technician',
        category: 'Workshop',
        location: 'Musaffah M9, Abu Dhabi',
        type: 'Full-time',
        description: 'Lead diagnostic efforts for high-end European and luxury vehicles using advanced telemetry and factory-grade systems.'
    },
    {
        title: 'Service Advisor (Concierge)',
        category: 'Customer Experience',
        location: 'Abu Dhabi',
        type: 'Full-time',
        description: 'Liaise between elite clients and our technical team to ensure a bespoke service journey and technical clarity.'
    },
    {
        title: 'Luxury Car Detailer',
        category: 'Detailing',
        location: 'Abu Dhabi',
        type: 'Full-time',
        description: 'Apply high-end ceramic coatings and PPF with surgical precision on exotic supercars and performance vehicles.'
    }
]

function OpenApplicationModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const [formData, setFormData] = useState({ name: '', email: '', role: '', message: '' })
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.email || !formData.name || isLoading) return
        setIsLoading(true)
        try {
            await new Promise(r => setTimeout(r, 1200))
            setIsSuccess(true)
            toast.success('Application sent! We will be in touch.')
        } catch {
            toast.error('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={(e) => e.target === e.currentTarget && onClose()}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-[#121212] rounded-[2.5rem] p-8 md:p-12 w-full max-w-lg relative border border-white/10 carbon-fiber shadow-2xl"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                        <X size={18} />
                    </button>

                    {isSuccess ? (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 mx-auto mb-6">
                                <CheckCircle2 size={40} />
                            </div>
                            <h3 className="text-white font-black text-2xl uppercase tracking-tighter italic mb-3">Application Sent!</h3>
                            <p className="text-gray-400 font-medium">Our team will review your application and reach out within 3–5 business days.</p>
                            <button
                                onClick={onClose}
                                className="mt-8 bg-[#E62329] text-white rounded-full px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-[#121212] transition-all"
                                style={{ color: 'white' }}
                            >
                                Close
                            </button>
                        </div>
                    ) : (
                        <>
                            <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Open Application</span>
                            <h3 className="text-white font-black text-2xl uppercase tracking-tighter italic mb-8">Send Your CV</h3>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Your Full Name"
                                        value={formData.name}
                                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                                        required
                                        className="w-full h-12 px-5 bg-white/10 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 text-sm font-medium focus:outline-none focus:border-[#E62329]/50 transition-all"
                                        style={{ color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Your Email Address"
                                        value={formData.email}
                                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                                        required
                                        className="w-full h-12 px-5 bg-white/10 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 text-sm font-medium focus:outline-none focus:border-[#E62329]/50 transition-all"
                                        style={{ color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Desired Role / Department (Optional)"
                                        value={formData.role}
                                        onChange={e => setFormData(p => ({ ...p, role: e.target.value }))}
                                        className="w-full h-12 px-5 bg-white/10 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 text-sm font-medium focus:outline-none focus:border-[#E62329]/50 transition-all"
                                        style={{ color: 'white' }}
                                    />
                                </div>
                                <div>
                                    <textarea
                                        placeholder="Brief introduction about yourself..."
                                        value={formData.message}
                                        onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                                        rows={4}
                                        className="w-full px-5 py-4 bg-white/10 border border-white/10 rounded-2xl text-white placeholder:text-gray-500 text-sm font-medium focus:outline-none focus:border-[#E62329]/50 transition-all resize-none"
                                        style={{ color: 'white' }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-14 bg-[#E62329] text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-white transition-all shadow-xl"
                                    style={{ color: 'white' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#121212' }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'white' }}
                                >
                                    {isLoading ? <><Loader2 className="animate-spin" size={18} /><span>Sending...</span></> : <><span>Send Application</span><Send size={16} /></>}
                                </button>
                            </form>
                        </>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

export default function CareersPage() {
    const [isModalOpen, setIsModalOpen] = useState(false)

    return (
        <main className="min-h-screen bg-[#FAFAF9]">
            <Navbar />

            {/* Hero */}
            <section className="pt-40 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 micro-noise opacity-5 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E62329]/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
                    <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">
                        Precision Careers
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black text-[#121212] tracking-tighter uppercase leading-[0.85] italic mb-8">
                        JOIN THE <br />
                        <span className="silver-shine leading-none">TEAM</span>
                    </h1>
                    <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                        We are always looking for master technicians and automotive enthusiasts who share our passion for perfection and engineering integrity.
                    </p>
                </div>
            </section>

            {/* Perks */}
            <section className="py-24 bg-[#121212] carbon-fiber">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#E62329]/20 flex items-center justify-center text-[#E62329] flex-shrink-0">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black uppercase italic mb-2" style={{ color: 'white' }}>High Performance</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>Work with the world's most advanced automotive diagnostic technology.</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700] flex-shrink-0">
                                <Star size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black uppercase italic mb-2" style={{ color: 'white' }}>Elite Culture</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>A team dedicated to precision, integrity, and shared technical growth.</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0" style={{ color: 'white' }}>
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black uppercase italic mb-2" style={{ color: 'white' }}>Global Impact</h3>
                                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>Serve a global clientele who demand nothing but the best for their vehicles.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Job Listings */}
            <section className="py-24 max-w-5xl mx-auto px-6">
                <div className="space-y-8">
                    {jobs.map((job, idx) => (
                        <div key={idx} className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:border-[#E62329]/20">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 rounded-full bg-gray-100 text-[9px] font-black uppercase tracking-widest" style={{ color: '#555555' }}>
                                            {job.category}
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-red-50 text-[9px] font-black uppercase tracking-widest text-[#E62329]">
                                            {job.type}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black uppercase italic tracking-tight" style={{ color: '#121212' }}>{job.title}</h3>
                                    <p className="font-medium max-w-2xl text-sm leading-relaxed" style={{ color: '#555555' }}>{job.description}</p>
                                    <div className="flex flex-wrap gap-6 pt-2">
                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#888888' }}>
                                            <MapPin size={14} className="text-[#E62329]" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: '#888888' }}>
                                            <Clock size={14} className="text-[#E62329]" />
                                            Immediate Start
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="bg-[#121212] rounded-full px-10 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-[#E62329] transition-all flex items-center justify-center gap-3 whitespace-nowrap"
                                    style={{ color: 'white' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = 'white' }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = 'white' }}
                                >
                                    Apply Now
                                    <ArrowRight size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Open Application CTA */}
                <div className="mt-24 bg-[#121212] rounded-[3.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl carbon-fiber border border-white/5">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#E62329]/10 blur-[120px] rounded-full -mr-48 -mt-48" />
                    <div className="relative z-10">
                        <h3 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-6 italic" style={{ color: 'white' }}>
                            No fitting <span className="silver-shine">role?</span>
                        </h3>
                        <p className="text-lg font-medium mb-12 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
                            Send us your portfolio or CV anyway. We&apos;re always interested in meeting high-performers and engineering pioneers.
                        </p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center gap-3 bg-[#E62329] rounded-full px-12 py-6 text-xs font-black tracking-widest uppercase transition-all shadow-xl hover:scale-105 hover:shadow-[0_0_40px_rgba(230,35,41,0.4)]"
                            style={{ color: 'white', backgroundColor: '#E62329' }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'white'
                                ;(e.currentTarget as HTMLButtonElement).style.color = '#121212'
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#E62329'
                                ;(e.currentTarget as HTMLButtonElement).style.color = 'white'
                            }}
                        >
                            <Send size={16} />
                            Send Open Application
                        </button>
                    </div>
                </div>
            </section>

            <OpenApplicationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <Footer />
        </main>
    )
}
