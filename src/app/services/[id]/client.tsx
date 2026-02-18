'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Service } from '@/types'
import { brandSocials } from '@/lib/data'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import {
    Instagram,
    Facebook,
    ChevronLeft,
    ArrowRight,
    Clock,
    ShieldCheck,
    Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'

interface ServicePageClientProps {
    service: Service
}

export function ServicePageClient({ service }: ServicePageClientProps) {
    const router = useRouter()

    return (
        <main className="min-h-screen bg-white selection:bg-[#E62329] selection:text-white">
            <Navbar />

            {/* SEO Metadata Override (Conceptual for Client Component) */}
            {/* In a real Next.js app, this would be handled in a Server Component metadata export */}

            <section className="pt-32 pb-24 overflow-hidden technical-grid">
                <div className="max-w-7xl mx-auto px-6 relative">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black transition-colors mb-12 group"
                    >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Services
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">
                                Service Code: SRV-{service.id.toUpperCase()}
                            </span>
                            <h1 className="text-6xl md:text-8xl font-black text-black tracking-tighter uppercase leading-none mb-8 italic">
                                {service.name.split(' ')[0]} <br />
                                <span className="text-gray-400">{service.name.split(' ').slice(1).join(' ')}</span>
                            </h1>
                            <p className="text-xl text-gray-500 font-medium leading-relaxed mb-12 max-w-xl">
                                {service.detailedDescription || service.description}
                            </p>

                            <div className="flex flex-wrap gap-10 mb-12">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#E62329]">
                                        <Clock size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Duration</p>
                                        <p className="font-black text-sm">{service.duration}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-[#FFCC00]">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Protection</p>
                                        <p className="font-black text-sm">Full Warranty</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <Button
                                    className="bg-black text-white rounded-full px-12 py-8 text-xs font-black tracking-widest uppercase hover:bg-[#E62329] transition-all shadow-2xl group"
                                    onClick={() => router.push('/#booking')}
                                >
                                    Book This Program <ArrowRight className="ml-4 group-hover:translate-x-1 transition-transform" size={16} />
                                </Button>
                                <div className="flex flex-col">
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Starting Investment</p>
                                    <p className="text-2xl font-black tracking-tighter">
                                        {service.basePrice ? formatPrice(service.basePrice) : 'Contact Us'}
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative aspect-square bg-gray-50 rounded-[4rem] group overflow-hidden micro-noise"
                        >
                            {service.image ? (
                                <picture>
                                    <source srcSet={service.image.replace(/\.png$/, '.webp')} type="image/webp" />
                                    <img
                                        src={service.image}
                                        alt={service.name}
                                        className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                    />
                                </picture>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Zap size={80} className="text-[#E62329]/20" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Technical Process Section */}
            <section className="py-24 bg-[#121212] text-white relative overflow-hidden micro-noise italic">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#E62329]/10 blur-[150px] rounded-full" />
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="mb-20 precision-line">
                        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">
                            Technical <span className="text-gray-500">Protocol</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {(service.process || [
                            { step: '01', title: 'Inspection', desc: 'Comprehensive technical baseline assessment.' },
                            { step: '02', title: 'Preparation', desc: 'Surface decontamination and engineering setup.' },
                            { step: '03', title: 'Execution', desc: 'Master technician implementation with OEM standards.' }
                        ]).map((item, i) => (
                            <div key={i} className="group cursor-default">
                                <span className="text-[#E62329] font-black text-6xl tracking-tighter opacity-20 block mb-6 group-hover:opacity-100 transition-opacity">
                                    {item.step}
                                </span>
                                <h3 className="text-xl font-black uppercase tracking-tight mb-4">{item.title}</h3>
                                <p className="text-gray-400 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Brand Advocacy & SEO Content */}
            <section className="py-24 bg-white technical-grid">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                        <div className="lg:col-span-4">
                            <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 mb-8 underline decoration-[#E62329] decoration-2 underline-offset-8">
                                Trusted Brand Partners
                            </h3>
                            <div className="flex flex-wrap gap-8 items-center mb-12">
                                {Object.entries(brandSocials).slice(0, 4).map(([brand, links]) => (
                                    <div key={brand} className="group">
                                        <p className="text-[10px] font-black uppercase text-gray-500 mb-3 tracking-widest">{brand}</p>
                                        <div className="flex gap-3">
                                            <a href={links.instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-[#E62329] hover:bg-white transition-all">
                                                <Instagram size={16} />
                                            </a>
                                            <a href={links.facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-gray-50 rounded-lg text-gray-400 hover:text-[#0165E1] hover:bg-white transition-all">
                                                <Facebook size={16} />
                                            </a>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-8">
                            <div className="prose prose-gray max-w-none">
                                <h3 className="text-2xl font-black uppercase tracking-tight text-black mb-6">Expertise Overview</h3>
                                <div className="space-y-6 text-gray-500 font-medium leading-relaxed">
                                    <p>
                                        At Smart Motor Performance, our specialized equipment and factory-certified technicians ensure that {service.name}
                                        is performed to the most exacting tolerances in the industry. As a leading specialized performance center
                                        serving Abu Dhabi and the wider UAE, we focus exclusively on high-luxury European manufacturers.
                                    </p>
                                    <p>
                                        Our commitment to excellence means utilizing only the highest grade materials—from XPEL protection films
                                        to Gtechniq nanoceramic coatings. We understand the engineering behind your vehicle, allowing us
                                        to maintain the structural and aesthetic integrity while enhancing performance and durability.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
