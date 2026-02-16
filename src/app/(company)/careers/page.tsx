import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'
import { motion } from 'framer-motion'
import { Briefcase, MapPin, Clock, ArrowRight, Star, Zap, Users } from 'lucide-react'

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

export default function CareersPage() {
    return (
        <main className="min-h-screen bg-[#FAFAF9]">
            <Navbar />
            
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
                    <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                        We are always looking for master technicians and automotive enthusiasts who share our passion for perfection and engineering integrity.
                    </p>
                </div>
            </section>

            {/* Perks */}
            <section className="py-24 bg-[#121212] text-white carbon-fiber">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#E62329]/20 flex items-center justify-center text-[#E62329] flex-shrink-0">
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black uppercase italic mb-2">High Performance</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">Work with the world's most advanced automotive diagnostic technology.</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-[#FFD700]/20 flex items-center justify-center text-[#FFD700] flex-shrink-0">
                                <Star size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black uppercase italic mb-2">Elite Culture</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">A team dedicated to precision, integrity, and shared technical growth.</p>
                            </div>
                        </div>
                        <div className="flex gap-6">
                            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white flex-shrink-0">
                                <Users size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black uppercase italic mb-2">Global Impact</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">Serve a global clientele who demand nothing but the best for their vehicles.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-24 max-w-5xl mx-auto px-6">
                <div className="space-y-8">
                    {jobs.map((job, idx) => (
                        <div key={idx} className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-precision hover:shadow-xl transition-all group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="px-3 py-1 rounded-full bg-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-500">
                                            {job.category}
                                        </span>
                                        <span className="px-3 py-1 rounded-full bg-red-50 text-[9px] font-black uppercase tracking-widest text-[#E62329]">
                                            {job.type}
                                        </span>
                                    </div>
                                    <h3 className="text-2xl font-black text-[#121212] uppercase italic tracking-tight">{job.title}</h3>
                                    <p className="text-gray-500 font-medium max-w-2xl text-sm leading-relaxed">{job.description}</p>
                                    <div className="flex flex-wrap gap-6 pt-2">
                                        <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                            <MapPin size={14} className="text-[#E62329]" />
                                            {job.location}
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                                            <Clock size={14} className="text-[#E62329]" />
                                            Immediate Start
                                        </div>
                                    </div>
                                </div>
                                <button className="bg-[#121212] text-white rounded-full px-10 py-5 text-[10px] font-black uppercase tracking-widest hover:bg-[#E62329] transition-all flex items-center justify-center gap-3 group/btn whitespace-nowrap">
                                    Apply Now
                                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-24 bg-[#121212] rounded-[3.5rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl carbon-fiber border border-white/5">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#E62329]/10 blur-[120px] rounded-full -mr-48 -mt-48" />
                    <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase mb-6 italic">No fitting <span className="silver-shine">role?</span></h3>
                    <p className="text-white/60 text-lg font-medium mb-12 max-w-2xl mx-auto">
                        Send us your portfolio or CV anyway. We're always interested in meeting high-performers and engineering pioneers.
                    </p>
                    <a href="mailto:careers@smartmotor.ae" className="bg-[#E62329] text-white rounded-full px-12 py-6 text-xs font-black tracking-widest uppercase hover:bg-white hover:text-[#121212] transition-all shadow-xl hover:scale-105">
                        Send Open Application
                    </a>
                </div>
            </section>

            <Footer />
        </main>
    )
}
