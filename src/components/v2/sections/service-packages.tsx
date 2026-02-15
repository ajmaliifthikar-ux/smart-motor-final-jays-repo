'use client'

import { motion } from 'framer-motion'
import { TagIcon, ZapIcon } from 'lucide-react'
import { ServicePackage } from '@/types/v2'
import { cn } from '@/lib/utils'
import { Tooltip } from '@/components/ui/tooltip'


export function ServicePackages({ packages }: { packages: ServicePackage[] }) {
    return (
        <section id="packages" className="py-24 bg-gray-50 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="text-center mb-16">
                    <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                        Exclusive Offers
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black text-[#121212] tracking-tighter uppercase leading-[0.9]">
                        Cost-Effective <span className="silver-shine">Packages</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {packages.map((pkg, index) => {
                        const isPrimary = index === 1 // Making the second package the "Dark/Premium" one layout-wise

                        return (
                            <motion.div
                                key={pkg.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={cn(
                                    "rounded-[2.5rem] p-10 shadow-xl border transition-all group relative overflow-hidden flex flex-col",
                                    isPrimary
                                        ? "bg-[#121212] text-white border-gray-800 hover:border-[#E62329]"
                                        : "bg-white text-[#121212] border-gray-100 hover:border-[#E62329]"
                                )}
                            >
                                <div className={cn(
                                    "absolute top-0 right-0 px-6 py-2 rounded-bl-2xl font-black text-xs uppercase tracking-widest",
                                    isPrimary ? "bg-[#E62329] text-white animate-pulse" : "bg-[#121212] text-white"
                                )}>
                                    {isPrimary ? 'Limited Time' : 'Best Value'}
                                </div>

                                {isPrimary && (
                                    <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#E62329]/20 blur-[80px] rounded-full pointer-events-none" />
                                )}

                                <Tooltip content={isPrimary ? "Premium package" : "Value package"} position="right">
                                    <div className={cn(
                                        "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-colors backdrop-blur-md",
                                        isPrimary
                                            ? "bg-white/10 text-white group-hover:bg-[#E62329]"
                                            : "bg-gray-100 text-[#121212] group-hover:bg-[#E62329] group-hover:text-white"
                                    )}>
                                        {isPrimary ? <ZapIcon size={24} /> : <TagIcon size={24} />}
                                    </div>
                                </Tooltip>

                                <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">{pkg.title}</h3>
                                <p className="text-[#E62329] font-bold uppercase tracking-widest text-xs mb-6">{pkg.subtitle}</p>

                                <ul className="space-y-4 mb-8 relative z-10 flex-grow">
                                    {pkg.features.map((feature, i) => (
                                        <li key={i} className={cn(
                                            "flex items-center gap-3 font-medium",
                                            isPrimary ? "text-gray-300" : "text-gray-600",
                                            // Highlight first two features of primary package
                                            isPrimary && i < 2 && "text-white text-lg font-bold"
                                        )}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#E62329] flex-shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
                                    className={cn(
                                        "w-full rounded-full py-4 text-xs font-black tracking-widest uppercase transition-all relative z-10",
                                        isPrimary
                                            ? "bg-white text-[#121212] hover:bg-[#E62329] hover:text-white"
                                            : "bg-[#121212] text-white hover:bg-[#E62329]"
                                    )}
                                >
                                    {isPrimary ? 'Claim Offer' : 'Get Quote'}
                                </button>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
