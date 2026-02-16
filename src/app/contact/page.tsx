import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'
import { motion } from 'framer-motion'
import { Phone, MapPin, Clock, Mail, MessageCircle, Navigation, ChevronRight } from 'lucide-react'
import { BookingForm } from '@/components/v2/sections/booking-form'

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-[#FAFAF9]">
            <Navbar />

            {/* Hero */}
            <section className="pt-40 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 micro-noise opacity-5 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
                    <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">
                        Get In Touch
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black text-[#121212] tracking-tighter uppercase leading-[0.85] italic mb-8">
                        DIRECT <br />
                        <span className="silver-shine leading-none">CHANNELS</span>
                    </h1>
                    <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                        Connect with our engineering advisors for immediate technical assistance or bespoke service inquiries.
                    </p>
                </div>
            </section>

            {/* Contact Grid */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
                    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-precision hover:shadow-xl transition-all group text-center flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#E62329]/10 border border-[#E62329]/20 flex items-center justify-center text-[#E62329] mb-8 group-hover:bg-[#E62329] group-hover:text-white transition-all duration-500">
                            <Phone size={28} />
                        </div>
                        <h3 className="text-xl font-black text-[#121212] uppercase italic tracking-tight mb-4">Voice Support</h3>
                        <p className="text-gray-400 text-sm font-medium mb-6">Direct line to our engineering team for rapid response.</p>
                        <a href="tel:+97125555443" className="text-2xl font-black text-[#121212] hover:text-[#E62329] transition-colors tracking-tight">+971 2 555 5443</a>
                        <p className="text-[10px] font-black uppercase text-gray-300 mt-4 tracking-widest">Toll Free: 800 SMART</p>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-precision hover:shadow-xl transition-all group text-center flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 flex items-center justify-center text-[#25D366] mb-8 group-hover:bg-[#25D366] group-hover:text-white transition-all duration-500">
                            <MessageCircle size={28} />
                        </div>
                        <h3 className="text-xl font-black text-[#121212] uppercase italic tracking-tight mb-4">Live WhatsApp</h3>
                        <p className="text-gray-400 text-sm font-medium mb-6">Send images or videos of your vehicle concerns directly.</p>
                        <a href="https://wa.me/97125555443" className="bg-[#121212] text-white px-10 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#25D366] transition-all">Start Conversation</a>
                    </div>

                    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-precision hover:shadow-xl transition-all group text-center flex flex-col items-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#121212] flex items-center justify-center text-white mb-8 group-hover:bg-[#E62329] transition-all duration-500">
                            <MapPin size={28} />
                        </div>
                        <h3 className="text-xl font-black text-[#121212] uppercase italic tracking-tight mb-4">Visit Workshop</h3>
                        <p className="text-gray-400 text-sm font-medium mb-6">M9, Musaffah Industrial Area, Abu Dhabi, UAE.</p>
                        <a href="https://maps.google.com/?q=Smart+Motor+Abu+Dhabi" target="_blank" className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#121212] hover:text-[#E62329] transition-colors">
                            Open in Maps <Navigation size={14} />
                        </a>
                    </div>
                </div>

                <div className="bg-[#121212] rounded-[4rem] overflow-hidden min-h-[500px] relative shadow-2xl carbon-fiber border border-white/5">
                    <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3634.56789!2d54.5!3d24.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDE4JzAwLjAiTiA1NMKwMzAnMDAuMCJF!5e0!3m2!1sen!2sae!4v1234567890" 
                        className="absolute inset-0 w-full h-full grayscale opacity-60 invert"
                        loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-12 left-12 right-12 z-10 flex flex-col md:flex-row justify-between items-end gap-8">
                        <div className="text-white space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[8px] font-black uppercase tracking-widest">Global HQ</div>
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">Musaffah M9 <br /> Engineering Hub</h2>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 text-white min-w-[300px]">
                            <h4 className="text-xs font-black uppercase tracking-widest mb-6">Working Hours</h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Mon - Sat</span>
                                    <span className="font-black">08:00 - 19:00</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-[#E62329] font-bold uppercase tracking-widest text-[10px]">Sunday</span>
                                    <span className="font-black">Closed</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <BookingForm />

            <Footer />
        </main>
    )
}
