'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Award, Settings, Shield } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'
import dynamic from 'next/dynamic'
import { Brand } from '@/types/v2'

const BookingForm = dynamic(() => import('@/components/sections/booking-form').then((mod) => mod.BookingForm), { ssr: false })

interface BrandDetailClientProps {
    brand: Brand
    categoryName?: string
}

export function BrandDetailClient({ brand, categoryName }: BrandDetailClientProps) {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Brand Hero */}
            <section className="relative h-[65vh] min-h-[550px] flex items-center overflow-hidden bg-[#0a0a0a]">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10" />
                    {/* Use brand hero image or fallback */}
                    <div className="absolute inset-0 bg-[url('/bg-placeholder.jpg')] bg-cover bg-center opacity-60" />
                    {brand.heroImage && (
                        <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url(${brand.heroImage})` }} />
                    )}
                </div>

                <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full pt-16">
                    <div className="flex items-center gap-4 mb-8">
                        <Link href="/brands" className="text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <ArrowLeft size={14} /> Brands
                        </Link>
                        <span className="text-white/40">/</span>
                        <span className="text-[#E62329] text-xs font-bold uppercase tracking-widest">{categoryName}</span>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-3xl"
                    >
                        <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-6">
                            {brand.name} <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-500 to-white text-4xl block mt-2">Specialists</span>
                        </h1>
                        <p className="text-xl text-gray-300 font-medium leading-relaxed mb-10 border-l-4 border-[#E62329] pl-6">
                            {brand.description}
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <Button
                                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-[#E62329] hover:bg-[#c41e23] text-white px-8 py-6 rounded-full font-black uppercase tracking-widest text-xs"
                            >
                                Book {brand.name} Service
                            </Button>
                            <Link href="/#packages">
                                <Button
                                    variant="outline"
                                    className="bg-transparent border-white/20 text-white hover:bg-white hover:text-black px-8 py-6 rounded-full font-black uppercase tracking-widest text-xs"
                                >
                                    View Packages
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Brand Specific Content */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-12">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
                        <div>
                            <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">{brand.name} <span className="text-[#E62329]">Excellence</span></h2>
                            <p className="text-gray-600 leading-relaxed text-lg mb-8">
                                Our certified technicians undergo specialized training for {brand.name} vehicles, ensuring every repair meets factory standards. From complex engine diagnostics to routine maintenance, we speak your car's language.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {brand.specialties.map((spec, i) => (
                                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                        <Award className="text-[#E62329] flex-shrink-0" size={24} />
                                        <div>
                                            <h4 className="font-bold text-sm uppercase tracking-wide mb-1">{spec}</h4>
                                            <p className="text-xs text-gray-500">Expertise</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#121212] rounded-[2.5rem] p-10 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E62329]/20 blur-[80px] rounded-full pointer-events-none" />
                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 relative z-10">Why Choose Smart Motor for {brand.name}?</h3>
                            <ul className="space-y-6 relative z-10">
                                {[
                                    "Manufacturer-Specific Diagnostics",
                                    "OEM Parts Availability",
                                    "Brand Certified Technicians",
                                    "Warranty Preservation",
                                    "Software Updates & Coding"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 group">
                                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#E62329] transition-colors">
                                            <CheckCircle2 size={16} />
                                        </div>
                                        <span className="font-bold tracking-wide">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Specific Services */}
                    <div className="mb-24">
                        <div className="text-center mb-12">
                            <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                                Our Capabilities
                            </span>
                            <h2 className="text-4xl font-black uppercase tracking-tighter">
                                Specific Services for {brand.name}
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {brand.services.map((service, i) => (
                                <div key={i} className="p-8 rounded-[2rem] border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all group bg-white">
                                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-[#121212] mb-6 group-hover:bg-[#E62329] group-hover:text-white transition-colors">
                                        <Settings size={24} />
                                    </div>
                                    <h4 className="text-xl font-black uppercase tracking-tight mb-3">{service}</h4>
                                    <p className="text-sm text-gray-500">
                                        Professional execution using brand-specific tools and protocols.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Models Supported */}
                    <div className="bg-gray-50 rounded-[3rem] p-12 text-center">
                        <h3 className="text-2xl font-black uppercase tracking-tighter mb-10">Supported Models</h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            {brand.models.map((model, i) => (
                                <span key={i} className="px-6 py-3 bg-white rounded-full shadow-sm text-sm font-bold border border-gray-100 text-gray-600 uppercase tracking-wider">
                                    {model}
                                </span>
                            ))}
                        </div>
                    </div>

                </div>
            </section>

            <BookingForm />
            <Footer />
        </main>
    )
}
