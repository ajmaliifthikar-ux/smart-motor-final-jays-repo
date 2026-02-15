'use client'

import { motion } from 'framer-motion'

export function SmartTipsHero() {
    return (
        <section className="relative h-[50vh] min-h-[400px] flex items-center overflow-hidden bg-[#121212]">
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <div className="absolute inset-0 bg-[url('/bg-placeholder.jpg')] bg-cover bg-center opacity-40" />
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-6 md:px-12 w-full pt-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-3xl"
                >
                    <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                        Expert Advice
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9] mb-6">
                        Smart <span className="silver-shine">Tips</span>
                    </h1>
                    <p className="text-xl text-gray-300 font-medium leading-relaxed max-w-2xl">
                        Latest automotive insights, maintenance guides, and expert advice from Abu Dhabi's premier auto repair specialists.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
