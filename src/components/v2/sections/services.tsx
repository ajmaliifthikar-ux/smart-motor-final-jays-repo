'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wrench, Car, Shield, Sparkles, Sun, Truck, ChevronRight, Zap, Hammer, Droplets, ChevronDown } from 'lucide-react'

import { useLanguage } from '@/lib/language-context'
import { cn, publicPath } from '@/lib/utils'
import { Service } from '@/types'
import { useTilt } from '@/lib/hooks/useTilt'
import Link from 'next/link'
import { Tooltip } from '@/components/ui/tooltip'

// ─── Constants ────────────────────────────────────────────────────────────────

// 4 columns grid → 2 rows = 8 cards visible by default
const COLS = 4
const DEFAULT_ROWS = 2
const DEFAULT_VISIBLE = COLS * DEFAULT_ROWS // 8

const iconMap: Record<string, typeof Wrench> = {
    wrench: Wrench, car: Car, shield: Shield, sparkles: Sparkles,
    sun: Sun, truck: Truck, zap: Zap,
}

const CATEGORY_MAP: Record<string, string> = {
    mechanical: 'mechanical',
    electrical: 'electrical',
    bodyshop: 'bodyshop',
    body: 'bodyshop',
    ppf: 'carcare',
    ceramic: 'carcare',
    tinting: 'carcare',
    detailing: 'carcare',
    towing: 'carcare',
    carcare: 'carcare',
    general: 'carcare',
}

type Tab = 'all' | 'mechanical' | 'electrical' | 'bodyshop' | 'carcare'

const TABS: { id: Tab; label: string; labelAr: string; Icon: React.ComponentType<{ size?: number }> }[] = [
    { id: 'all',        label: 'All',       labelAr: 'الكل',              Icon: Sparkles  },
    { id: 'mechanical', label: 'Mechanical',labelAr: 'الميكانيكا',        Icon: Wrench    },
    { id: 'electrical', label: 'Electrical',labelAr: 'الكهرباء',          Icon: Zap       },
    { id: 'bodyshop',   label: 'Body Shop', labelAr: 'ورشة الهيكل',       Icon: Hammer    },
    { id: 'carcare',    label: 'Car Care',  labelAr: 'العناية بالسيارة',  Icon: Droplets  },
]

function getTab(service: Service): string {
    return CATEGORY_MAP[(service.category || '').toLowerCase()] || 'carcare'
}

function getCategoryImage(service: Service): string {
    const fallbacks: Record<string, string> = {
        mechanical: '/images/services/Gemini_Generated_Image_c58t4gc58t4gc58t.webp',
        electrical: '/images/services/Gemini_Generated_Image_acgzrhacgzrhacgz.webp',
        bodyshop:   '/images/services/Gemini_Generated_Image_3r4sql3r4sql3r4s.webp',
        carcare:    '/images/services/Gemini_Generated_Image_7vknrq7vknrq7vkn.webp',
    }
    return service.image || fallbacks[getTab(service)] || fallbacks.mechanical
}

// ─── Service Card ─────────────────────────────────────────────────────────────

function ServiceCard({ service, index }: { service: Service; index: number }) {
    const { language, isRTL } = useLanguage()
    const Icon = iconMap[service.icon] || Wrench
    const tilt = useTilt({ maxDegrees: 5 })

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, delay: Math.min(index * 0.06, 0.4) }}
            className="h-[300px] md:h-[350px]"
        >
            <Link
                href={`/services/${service.id}`}
                className="relative group overflow-hidden rounded-[2rem] bg-[#121212] carbon-fiber border border-white/5 h-full transition-all duration-700 hover:shadow-[0_0_80px_rgba(230,35,41,0.15)] flex flex-col block"
            >
                {/* BG image */}
                <div className="absolute inset-0 z-0 opacity-40 group-hover:opacity-60 transition-opacity duration-700">
                    <img
                        src={getCategoryImage(service)}
                        alt={service.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={e => { (e.currentTarget as HTMLImageElement).src = '/images/services/Gemini_Generated_Image_c58t4gc58t4gc58t.webp' }}
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />
                </div>

                {/* Content */}
                <div className="absolute inset-0 z-10 flex flex-col justify-end p-6">
                    <div className="absolute top-5 left-5">
                        <Tooltip content={service.name} position="right">
                            <div className="w-13 h-13 w-12 h-12 bg-[#E62329]/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-[#E62329] border border-[#E62329]/20 group-hover:bg-[#E62329] group-hover:text-white transition-all duration-500 shadow-lg p-2">
                                {service.iconImage
                                    ? <img src={publicPath(service.iconImage)} alt={service.name} className="w-full h-full object-contain drop-shadow-md group-hover:brightness-0 group-hover:invert transition-all" />
                                    : <Icon size={20} />}
                            </div>
                        </Tooltip>
                    </div>

                    <div className="relative z-20">
                        <span className="text-[8px] font-black text-[#E62329] bg-[#E62329]/10 px-3 py-1 rounded-full uppercase tracking-[0.2em] backdrop-blur-md mb-2 inline-block border border-[#E62329]/10">
                            {service.duration}
                        </span>
                        <h3 className={cn(
                            '!text-white text-lg font-black mb-1.5 tracking-tighter uppercase italic leading-none group-hover:silver-shine transition-all duration-500',
                            isRTL && 'font-arabic not-italic tracking-normal text-base'
                        )}>
                            {language === 'ar' ? service.nameAr : service.name}
                        </h3>
                        <p className={cn(
                            '!text-white text-[10px] font-medium leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 text-balance mb-3',
                            isRTL && 'font-arabic'
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
                            <ChevronRight size={12} className={cn('transition-transform', isRTL ? 'group-hover/btn:-translate-x-1 rotate-180' : 'group-hover/btn:translate-x-1')} />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}

// ─── Main Section ─────────────────────────────────────────────────────────────

export function Services({ services }: { services: Service[] }) {
    const { language, isRTL } = useLanguage()
    const [activeTab, setActiveTab] = useState<Tab>('all')
    const [expanded, setExpanded] = useState(false)

    // Reset expand state when tab changes
    const handleTabChange = (tab: Tab) => {
        setActiveTab(tab)
        setExpanded(false)
    }

    const filtered = activeTab === 'all'
        ? services
        : services.filter(s => getTab(s) === activeTab)

    const visible = expanded ? filtered : filtered.slice(0, DEFAULT_VISIBLE)
    const hiddenCount = filtered.length - DEFAULT_VISIBLE

    return (
        <section id="services" className="py-24 bg-premium-gradient relative overflow-hidden technical-grid">
            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">

                {/* ── Header ── */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-8">
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
                            'text-5xl md:text-7xl font-black text-[#121212] tracking-tighter uppercase leading-[0.85] italic',
                            isRTL && 'font-arabic tracking-normal text-4xl md:text-6xl'
                        )}>
                            UNDER ONE <br />
                            <span className="silver-shine leading-none block">ROOF</span>
                        </h2>
                    </motion.div>

                    <button
                        className="bg-black text-white rounded-full px-8 py-4 text-xs font-black tracking-widest uppercase hover:bg-[#E62329] transition-all shadow-xl shrink-0"
                        onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        Book a Service
                    </button>
                </div>

                {/* ── Category Tabs ── */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="flex flex-wrap gap-2 mb-10"
                >
                    {TABS.map(tab => {
                        const count = tab.id === 'all' ? services.length : services.filter(s => getTab(s) === tab.id).length
                        if (count === 0 && tab.id !== 'all') return null
                        const { Icon } = tab
                        return (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={cn(
                                    'flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border',
                                    activeTab === tab.id
                                        ? 'bg-[#E62329] text-white border-[#E62329] shadow-lg shadow-red-900/20'
                                        : 'bg-white/80 text-gray-600 border-gray-200 hover:border-[#E62329] hover:text-[#E62329] backdrop-blur-sm'
                                )}
                            >
                                <Icon size={12} />
                                {language === 'ar' ? tab.labelAr : tab.label}
                                <span className={cn(
                                    'text-[9px] font-black px-1.5 py-0.5 rounded-full',
                                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                                )}>
                                    {count}
                                </span>
                            </button>
                        )
                    })}
                </motion.div>

                {/* ── Grid ── */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
                    >
                        <AnimatePresence>
                            {visible.map((service, index) => (
                                <ServiceCard key={service.id} service={service} index={index} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                </AnimatePresence>

                {/* ── Show More / Show Less ── */}
                {filtered.length > DEFAULT_VISIBLE && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center mt-10"
                    >
                        <button
                            onClick={() => setExpanded(e => !e)}
                            className="flex items-center gap-2.5 text-sm font-black uppercase tracking-widest text-gray-500 hover:text-[#E62329] transition-colors duration-300 group"
                        >
                            {expanded ? (
                                <>
                                    Show Less
                                    <ChevronDown size={16} className="rotate-180 transition-transform duration-300" />
                                </>
                            ) : (
                                <>
                                    Show More
                                    <span className="inline-flex items-center justify-center bg-[#E62329] text-white text-[10px] font-black rounded-full w-6 h-6 leading-none">
                                        +{hiddenCount}
                                    </span>
                                    <ChevronDown size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" />
                                </>
                            )}
                        </button>
                    </motion.div>
                )}

                {/* ── Empty state ── */}
                {filtered.length === 0 && (
                    <div className="text-center py-20 text-gray-400">
                        <Sparkles size={40} className="mx-auto mb-4 opacity-30" />
                        <p className="font-black uppercase tracking-widest text-sm">No services in this category yet</p>
                    </div>
                )}
            </div>
        </section>
    )
}
