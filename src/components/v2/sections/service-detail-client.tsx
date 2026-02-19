'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'
import dynamic from 'next/dynamic'
import { Service } from '@/types'

const BookingForm = dynamic(() => import('@/components/sections/booking-form').then((mod) => mod.BookingForm), { ssr: false })

interface ServiceDetailClientProps {
    service: Service
}

export function ServiceDetailClient({ service }: ServiceDetailClientProps) {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[500px] flex items-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-black/60 z-10" />
                    <img
                        src={service.image || '/bg-placeholder.jpg'}
                        alt={service.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full pt-20">
                    <Link href="/#services" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors text-xs font-bold uppercase tracking-widest">
                        <ArrowLeft size={16} /> Back to Services
                    </Link>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md">
                            {service.duration} Service Time
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-6">
                            {service.name}
                        </h1>
                        <p className="text-xl text-gray-200 max-w-2xl font-medium leading-relaxed">
                            {service.description}
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Content Section */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16">

                    {/* Main Content */}
                    <div className="flex-1">
                        <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">Service <span className="text-[#E62329]">Overview</span></h2>
                        <p className="text-gray-600 leading-relaxed text-lg mb-12">
                            {service.detailedDescription || service.description}
                        </p>

                        {service.process && (
                            <div className="mb-12">
                                <h3 className="text-xl font-black uppercase tracking-widest mb-8 border-b border-gray-100 pb-4">Our Process</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {service.process.map((step, i) => (
                                        <div key={i} className="flex gap-4">
                                            <span className="text-4xl font-black text-gray-200 leading-none">{step.step}</span>
                                            <div>
                                                <h4 className="font-bold text-[#121212] uppercase tracking-wide mb-1">{step.title}</h4>
                                                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {service.subServices && service.subServices.length > 0 && (
                            <div className="mb-16">
                                <h3 className="text-xl font-black uppercase tracking-widest mb-8 border-b border-gray-100 pb-4">Specialized Services</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {service.subServices.map((sub, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 10 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="bg-white border border-gray-100 rounded-3xl p-8 hover:shadow-xl hover:border-[#E62329]/20 transition-all duration-300 group"
                                        >
                                            <h4 className="text-lg font-black uppercase tracking-tight mb-3 group-hover:text-[#E62329] transition-colors">{sub.title}</h4>
                                            <p className="text-sm text-gray-500 font-medium mb-6 leading-relaxed">{sub.description}</p>

                                            <ul className="space-y-3">
                                                {sub.features.map((feature, fIdx) => (
                                                    <li key={fIdx} className="flex items-start gap-3 text-xs font-bold text-gray-700">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-[#E62329] mt-1.5 flex-shrink-0" />
                                                        <span className="leading-snug">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-gray-50 rounded-[2rem] p-10 border border-gray-100">
                            <h3 className="text-xl font-black uppercase tracking-widest mb-6">Why Choose Us?</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    "Factory Approved Methods",
                                    "Generic Parts Option",
                                    "OEM Parts Option",
                                    "Warranty on Repairs",
                                    "Certified Technicians",
                                    "Detailed Report"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-700">
                                        <CheckCircle2 size={18} className="text-[#E62329]" /> {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Sidebar CTA */}
                    <div className="w-full lg:w-1/3">
                        <div className="sticky top-32 bg-[#121212] text-white rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E62329]/20 blur-[80px] rounded-full pointer-events-none" />

                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 relative z-10">Ready to Book?</h3>
                            <p className="text-gray-400 text-sm mb-8 relative z-10">Schedule your {service.name.toLowerCase()} today.</p>

                            <Button
                                className="w-full bg-white text-[#121212] font-black uppercase tracking-widest py-6 hover:bg-[#E62329] hover:text-white transition-all mb-4 relative z-10"
                                onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Book Appointment
                            </Button>

                            <div className="text-center relative z-10">
                                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Or Call Us Directly</p>
                                <a href="tel:+97126666789" className="text-xl font-black text-white hover:text-[#E62329] transition-colors">
                                    +971 2 555 5443
                                </a>
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
