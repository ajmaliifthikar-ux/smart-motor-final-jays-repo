'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronRight, ChevronLeft } from 'lucide-react'
import { testimonials } from '@/lib/data'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/language-context'
import { Tooltip } from '@/components/ui/tooltip'

export function Testimonials() {
    const [cards, setCards] = useState(testimonials)
    const [isAnimating, setIsAnimating] = useState(false)
    const { language, isRTL } = useLanguage()

    const handleNext = () => {
        if (isAnimating) return
        setIsAnimating(true)

        setCards((prev) => {
            const newCards = [...prev]
            const firstCard = newCards.shift()!
            newCards.push(firstCard)
            return newCards
        })

        setTimeout(() => setIsAnimating(false), 600)
    }

    const handlePrev = () => {
        if (isAnimating) return
        setIsAnimating(true)

        setCards((prev) => {
            const newCards = [...prev]
            const lastCard = newCards.pop()!
            newCards.unshift(lastCard)
            return newCards
        })

        setTimeout(() => setIsAnimating(false), 600)
    }

    return (
        <section id="testimonials" className="py-32 bg-[#FAFAF9] overflow-hidden technical-grid">
            <div className="absolute inset-0 micro-noise opacity-5" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">

                    {/* Left Side: Copy */}
                    <div className="lg:col-span-5">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="space-y-8"
                        >
                            <div>
                                <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                                    {language === 'ar' ? 'أصوات التميز' : 'Voice of Excellence'}
                                </span>
                                <h2 className={cn(
                                    "text-5xl md:text-7xl font-black text-[#121212] tracking-tighter uppercase leading-[0.9] italic",
                                    isRTL && "font-arabic not-italic tracking-normal text-6xl"
                                )}>
                                    {language === 'ar' ? 'ثقة' : 'TRUST THE'} <br />
                                    <span className="silver-shine leading-none block">{language === 'ar' ? 'المحترفين' : 'PROFESSIONALS'}</span>
                                </h2>
                            </div>

                            {/* Google Reviews Card - Updated to #121212 */}
                            <div className="p-8 bg-[#121212] rounded-[2.5rem] text-white italic shadow-2xl relative overflow-hidden micro-noise border border-white/5">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#E62329]/10 blur-3xl opacity-50" />
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FFCC00]">
                                        <Star size={24} fill="currentColor" />
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest">Google Reviews</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">4.9/5 Elite Rating</p>
                                    </div>
                                </div>
                                <p className="text-gray-400 font-medium leading-relaxed">
                                    {language === 'ar'
                                        ? 'اكتشف لماذا تختار النخبة من أصحاب السيارات في الإمارات "سمارت موتور" للعناية بأصولهم الأكثر قيمة.'
                                        : 'Discover why UAE\'s elite car owners trust Smart Motor Performance with their most valuable automotive assets.'}
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <Tooltip content="Previous review" position="bottom">
                                    <button
                                        onClick={handlePrev}
                                        className="w-14 h-14 rounded-2xl border border-gray-200 flex items-center justify-center hover:bg-[#121212] hover:text-white transition-all group"
                                    >
                                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                                    </button>
                                </Tooltip>
                                <Tooltip content="Next review" position="bottom">
                                    <button
                                        onClick={handleNext}
                                        className="w-14 h-14 rounded-2xl border border-gray-200 flex items-center justify-center hover:bg-[#121212] hover:text-white transition-all group"
                                    >
                                        <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Tooltip>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Side: Stacked Animated Cards */}
                    <div className="lg:col-span-7 relative h-[500px] flex items-center justify-center lg:justify-end">
                        <div className="relative w-full max-w-[500px] h-full">
                            <AnimatePresence mode="popLayout">
                                {cards.slice(0, 3).map((testimonial, index) => (
                                    <motion.div
                                        key={testimonial.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{
                                            opacity: 1 - index * 0.2,
                                            scale: 1 - index * 0.05,
                                            y: -index * 40,
                                            zIndex: 10 - index,
                                            rotate: index === 0 ? 0 : index === 1 ? -2 : 2
                                        }}
                                        exit={{
                                            x: 300,
                                            opacity: 0,
                                            scale: 0.8,
                                            rotate: 15,
                                            transition: { duration: 0.5 }
                                        }}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        className="absolute inset-0"
                                    >
                                        <div className="w-full h-full relative overflow-hidden rounded-[3.5rem] shadow-precision">
                                            <div className="absolute inset-0 silver-shine rounded-[3.5rem] z-0" />
                                            <div className="relative z-10 p-10 h-full flex flex-col justify-between carbon-fiber rounded-[2.5rem] border border-white/5 shadow-2xl">
                                                <div>
                                                    <div className="flex gap-1 mb-8">
                                                        {[...Array(testimonial.rating)].map((_, i) => (
                                                            <Star key={i} size={14} className="fill-[#E62329] text-[#E62329]" />
                                                        ))}
                                                    </div>
                                                    <p className="text-xl md:text-2xl font-medium text-white/90 leading-relaxed tracking-tight">
                                                        &quot;{testimonial.comment}&quot;
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-6 pt-10 border-t border-white/10">
                                                    <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-white p-1">
                                                        <div className="w-full h-full rounded-2xl bg-white/10 flex items-center justify-center font-black text-lg">
                                                            {testimonial.name.charAt(0)}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className={cn("text-xl font-black text-white uppercase tracking-tighter", isRTL && "font-arabic")}>
                                                            {testimonial.name}
                                                        </h4>
                                                        <span className="text-[10px] font-black text-[#E62329] uppercase tracking-widest bg-[#E62329]/5 px-3 py-1 rounded-full border border-[#E62329]/10">
                                                            {testimonial.carBrand} Patron
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
