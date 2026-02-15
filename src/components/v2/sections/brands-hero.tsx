'use client'

import { motion } from 'framer-motion'

export function BrandsHero() {
    return (
        <section className="relative pt-32 pb-20 overflow-hidden bg-[#121212] text-white">
            <div className="absolute inset-0 bg-[url('/images/hero/brands-hero.jpg')] bg-cover bg-center opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                        Brand Expertise
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none mb-6">
                        Specialized Service<br />
                        <span className="text-gray-500">Across Global Brands</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
                        Trusted car repair services in Abu Dhabi for German, Japanese, Chinese, European, and American vehicles.
                        Engine, transmission, AC, and electric diagnostics by certified brand specialists.
                    </p>

                    <div className="flex justify-center gap-4">
                        <a href="#german" className="px-6 py-3 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all text-xs font-bold uppercase tracking-widest leading-none flex items-center">
                            German
                        </a>
                        <a href="#japanese" className="px-6 py-3 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all text-xs font-bold uppercase tracking-widest leading-none flex items-center">
                            Japanese
                        </a>
                        <a href="#chinese" className="px-6 py-3 rounded-full border border-white/10 hover:bg-white hover:text-black transition-all text-xs font-bold uppercase tracking-widest leading-none flex items-center">
                            Chinese
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
