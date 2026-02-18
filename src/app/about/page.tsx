import type { Metadata } from 'next'
import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'
import { CheckCircle2, Award, ArrowUpRight, Shield, Zap } from 'lucide-react'
import { AdvancedLogoSlider } from '@/components/v2/sections/advanced-logo-slider'
import { getAllBrands } from '@/lib/firebase-db'

export const metadata: Metadata = {
    title: 'About Us – Smart Motor Auto Repair | Est. 2009, Abu Dhabi',
    description: 'Learn about Smart Motor Auto Repair — Abu Dhabi\'s trusted workshop since 2009. 50+ certified technicians, 1,000+ satisfied clients, 6-month labour warranty. Located in Musaffah.',
    openGraph: {
        title: 'About Smart Motor Auto Repair Abu Dhabi',
        description: 'Abu Dhabi\'s premier automotive service center since 2009. 50+ factory-certified technicians, all brands serviced.',
        url: 'https://smartmotor.ae/about',
    },
    alternates: {
        canonical: 'https://smartmotor.ae/about',
        languages: {
            'en': 'https://smartmotor.ae/about',
            'ar': 'https://smartmotor.ae/ar/about',
            'x-default': 'https://smartmotor.ae/about',
        },
    },
}

export default async function AboutPage() {
    let brandsData: any[] = []
    try {
        const allBrands = await getAllBrands()
        brandsData = allBrands.slice(0, 20)
    } catch (e) {}

    const brands = brandsData.map(b => ({
        id: b.id,
        name: b.name,
        src: b.logoUrl || '/bg-placeholder.jpg',
        slug: b.slug || b.id
    }))

    return (
        <main className="min-h-screen bg-[#FAFAF9]">
            <Navbar />

            {/* Hero Section */}
            <section className="pt-40 pb-24 relative overflow-hidden">
                <div className="absolute inset-0 micro-noise opacity-5 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#E62329]/5 blur-[120px] rounded-full pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
                    <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">
                        Our Engineering Story
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black text-[#121212] tracking-tighter uppercase leading-[0.85] italic mb-8">
                        PRECISION <br />
                        <span className="silver-shine leading-none">HERITAGE</span>
                    </h1>
                    <p className="text-gray-500 text-lg md:text-2xl max-w-3xl mx-auto font-medium leading-relaxed">
                        Since 2009, Smart Motor has been the epicenter of luxury automotive care in Abu Dhabi, blending German engineering standards with bespoke concierge service.
                    </p>
                </div>
            </section>

            {/* Core Pillars */}
            <section className="py-24 bg-[#121212] text-white relative overflow-hidden carbon-fiber">
                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="space-y-6 group">
                            <div className="w-16 h-16 rounded-2xl bg-[#E62329]/10 border border-[#E62329]/20 flex items-center justify-center text-[#E62329] group-hover:bg-[#E62329] group-hover:text-white transition-all duration-500">
                                <Zap size={32} />
                            </div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tight">Rapid Diagnostics</h3>
                            <p className="text-gray-400 leading-relaxed font-medium">Using factory-grade telemetry to pinpoint issues with surgical accuracy, reducing downtime for your vehicle.</p>
                        </div>
                        <div className="space-y-6 group">
                            <div className="w-16 h-16 rounded-2xl bg-[#E62329]/10 border border-[#E62329]/20 flex items-center justify-center text-[#E62329] group-hover:bg-[#E62329] group-hover:text-white transition-all duration-500">
                                <Shield size={32} />
                            </div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tight">OEM Integrity</h3>
                            <p className="text-gray-400 leading-relaxed font-medium">We exclusively source 100% genuine parts, ensuring your vehicle's warranty and performance remain uncompromised.</p>
                        </div>
                        <div className="space-y-6 group">
                            <div className="w-16 h-16 rounded-2xl bg-[#E62329]/10 border border-[#E62329]/20 flex items-center justify-center text-[#E62329] group-hover:bg-[#E62329] group-hover:text-white transition-all duration-500">
                                <Award size={32} />
                            </div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tight">Master Craftsmanship</h3>
                            <p className="text-gray-400 leading-relaxed font-medium">Our technicians are brand-certified specialists with over 15 years of experience in exotic and European engineering.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Experience Section */}
            <section className="py-32">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="bg-white rounded-[4rem] p-12 md:p-24 shadow-precision border border-gray-100 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E62329]/5 blur-[100px] rounded-full" />
                        <div className="flex-1 space-y-8">
                            <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] block">The Customer Journey</span>
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#121212] leading-[0.9]">Bespoke <br /> Concierge <br /> <span className="text-gray-400">Service.</span></h2>
                            <p className="text-gray-500 text-lg font-medium leading-relaxed">
                                At Smart Motor, we don't just repair cars; we manage your automotive lifestyle. From complimentary pickup and delivery to real-time telemetry updates, every step is designed for your convenience.
                            </p>
                            <div className="flex gap-4">
                                <div className="text-center p-6 bg-gray-50 rounded-3xl min-w-[120px]">
                                    <p className="text-3xl font-black text-[#121212]">15+</p>
                                    <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mt-1">Years Experience</p>
                                </div>
                                <div className="text-center p-6 bg-gray-50 rounded-3xl min-w-[120px]">
                                    <p className="text-3xl font-black text-[#121212]">1K+</p>
                                    <p className="text-[8px] font-black uppercase text-gray-400 tracking-widest mt-1">Elite Clients</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl relative group">
                            <img src="/images/ui/workshop-hero.webp" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="Workshop" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-10 left-10 text-white">
                                <p className="text-xs font-black uppercase tracking-widest mb-2 text-[#E62329]">Live Operations</p>
                                <h4 className="text-2xl font-black uppercase italic tracking-tighter">Musaffah M9 Hub</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="pb-24 overflow-hidden">
                <AdvancedLogoSlider brands={brands} />
            </div>

            <Footer />
        </main>
    )
}
