'use client'

import { motion } from 'framer-motion'
import { Wrench, Car, Shield, Sparkles, Sun, Truck, ChevronRight } from 'lucide-react'

import { useLanguage } from '@/lib/language-context'
import { cn, publicPath } from '@/lib/utils'
import { Service } from '@/types'
import { useTilt } from '@/lib/hooks/useTilt'
import Link from 'next/link'
import { Tooltip } from '@/components/ui/tooltip'

const iconMap: Record<string, typeof Wrench> = {
    wrench: Wrench,
    car: Car,
    shield: Shield,
    sparkles: Sparkles,
    sun: Sun,
    truck: Truck,
}

function ServiceCard({ service, index }: { service: Service; index: number }) {
    const { language, isRTL } = useLanguage()
    const Icon = iconMap[service.icon] || Wrench
    const tilt = useTilt({ maxDegrees: 5 })

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="h-[320px] md:h-[380px]"
        >
            <Link href={`/services/${service.id}`} className="relative group overflow-hidden rounded-[2rem] bg-[#121212] carbon-fiber border border-white/5 h-full transition-all duration-700 hover:shadow-[0_0_80px_rgba(230,35,41,0.15)] flex flex-col block">
                {/* Background Image */}
                <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
                    <picture>
                        <source srcSet={publicPath((service.image || '').replace(/\.png$/, '.webp'))} type="image/webp" />
                        <img
                            src={publicPath(service.image || '/bg-placeholder.jpg')}
                            alt={service.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    </picture>
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                </div>

                {/* Content Area */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
                    <div className="absolute top-5 left-5">
                        <Tooltip content={service.name} position="right">
                            <div className="w-16 h-16 bg-[#E62329]/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#E62329] border border-[#E62329]/20 group-hover:bg-[#E62329] group-hover:text-white transition-all duration-500 shadow-lg p-2">
                                {service.iconImage ? (
                                    <img
                                        src={publicPath(service.iconImage)}
                                        alt={service.name}
                                        className="w-full h-full object-contain drop-shadow-md group-hover:brightness-0 group-hover:invert transition-all"
                                    />
                                ) : (
                                    <Icon size={24} />
                                )}
                            </div>
                        </Tooltip>
                    </div>

                    <div className="relative z-20">
                        <Tooltip content="Estimated service duration" position="top">
                            <span className="text-[8px] font-black text-[#E62329] bg-[#E62329]/10 px-3 py-1 rounded-full uppercase tracking-[0.2em] backdrop-blur-md mb-2 inline-block border border-[#E62329]/10">
                                {service.duration}
                            </span>
                        </Tooltip>

                        <h3 className={cn(
                            "!text-white text-xl font-black mb-1.5 tracking-tighter uppercase italic leading-none group-hover:silver-shine transition-all duration-500",
                            isRTL && "font-arabic not-italic tracking-normal text-lg"
                        )}>
                            {language === 'ar' ? service.nameAr : service.name}
                        </h3>

                        <p className={cn(
                            "!text-white text-[10px] font-medium leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 text-balance mb-3",
                            isRTL && "font-arabic"
                        )}>
                            {language === 'ar' ? service.descriptionAr : service.description}
                        </p>

                        <div
                            style={tilt.tiltStyle}
                            onMouseMove={tilt.tiltHandlers.onMouseMove}
                            onMouseLeave={tilt.tiltHandlers.onMouseLeave}
                            className="w-full bg-white/5 backdrop-blur-xl text-white border border-white/10 rounded-xl py-2.5 font-black uppercase text-[9px] tracking-widest hover:bg-white hover:text-black transition-all duration-300 shadow-xl flex items-center justify-center gap-2 group/btn button-overlay"
                        >
                            {language === 'ar' ? 'المزيد' : 'Learn More'}
                            <ChevronRight size={12} className={cn("transition-transform", isRTL ? "group-hover/btn:-translate-x-1 rotate-180" : "group-hover/btn:translate-x-1")} />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

export function Services({ services }: { services: Service[] }) {
    const { language, isRTL } = useLanguage()

    return (
        <section id="services" className="py-24 bg-premium-gradient relative overflow-hidden technical-grid">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="max-w-2xl"
                    >
                        <span className="text-gray-800 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                            COMPREHENSIVE AUTOMOTIVE SOLUTIONS
                        </span>
                        <h2 className={cn(
                            "text-5xl md:text-7xl font-black text-[#121212] tracking-tighter uppercase leading-[0.85] italic",
                            isRTL && "font-arabic tracking-normal text-4xl md:text-6xl"
                        )}>
                            UNDER ONE <br />
                            <span className="silver-shine leading-none block">ROOF</span>
                        </h2>
                    </motion.div>

                    <button
                        className="bg-black text-white rounded-full px-8 py-4 text-xs font-black tracking-widest uppercase hover:bg-gray-800 transition-all shadow-xl"
                        onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        View Full Schedule
                    </button>
                </div>

                {/* 4 columns layout for Services to fit more */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <ServiceCard key={service.id} service={service} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}
