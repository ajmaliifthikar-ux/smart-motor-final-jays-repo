'use client'

import { motion } from 'framer-motion'
import { Tag, Zap, Check } from 'lucide-react'
import { ServicePackage } from '@/types/v2'

export function PackagesList({ packages }: { packages: ServicePackage[] }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {packages.map((pkg, i) => {
                // Ensure features is an array of strings
                let featuresList: string[] = []
                if (typeof pkg.features === 'string') {
                    try {
                        featuresList = JSON.parse(pkg.features)
                    } catch (e) {
                        featuresList = (pkg.features as string).split(',')
                    }
                } else if (Array.isArray(pkg.features)) {
                    featuresList = pkg.features
                }

                return (
                <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`relative rounded-[3rem] p-12 overflow-hidden group ${pkg.id === 'current-promotion'
                        ? 'bg-[#121212] text-white shadow-2xl shadow-black/30'
                        : 'bg-white border border-gray-100 shadow-xl'
                        }`}
                >
                    {pkg.isPromotional && (
                        <div className="absolute top-0 right-0 bg-[#E62329] text-white px-10 py-4 rounded-bl-[2.5rem] font-black uppercase tracking-widest text-xs z-20 shadow-lg">
                            Limited Time
                        </div>
                    )}

                    {/* Decorational Background Elements */}
                    {pkg.id === 'current-promotion' && (
                        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E62329]/10 blur-[80px] rounded-full pointer-events-none -mr-20 -mt-20" />
                    )}

                    <div className={`relative z-10 w-20 h-20 rounded-2xl flex items-center justify-center mb-10 shadow-lg ${pkg.id === 'current-promotion' ? 'bg-white/10 text-white border border-white/10' : 'bg-[#E62329] text-white shadow-[#E62329]/30'}`}>
                        {pkg.id === 'current-promotion' ? <Zap size={36} strokeWidth={1.5} /> : <Tag size={36} strokeWidth={1.5} />}
                    </div>

                    <div className="relative z-10">
                        <div className={`text-xs font-black uppercase tracking-[0.2em] mb-4 ${pkg.id === 'current-promotion' ? 'text-[#E62329]' : 'text-gray-400'}`}>{pkg.subtitle}</div>
                        <h2 className={`text-5xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-[0.9] ${pkg.id === 'current-promotion' ? 'text-white' : 'text-[#121212]'}`}>{pkg.title}</h2>

                        <div className="h-px w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-20 mb-10" />

                        <ul className="space-y-6 mb-12">
                            {featuresList.map((feature, f) => (
                                <li key={f} className="flex items-start gap-5">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${pkg.id === 'current-promotion' ? 'bg-[#E62329] text-white' : 'bg-black text-white'}`}>
                                        <Check size={12} strokeWidth={4} />
                                    </div>
                                    <span className={`text-xl font-bold tracking-tight ${pkg.id === 'current-promotion' ? 'text-white' : 'text-gray-800'}`}>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col sm:flex-row items-center gap-6 justify-between pt-8 border-t border-dashed border-gray-500/20">
                            <div>
                                <div className={`text-[10px] font-black uppercase tracking-widest opacity-60 mb-1 ${pkg.id === 'current-promotion' ? 'text-white' : 'text-gray-600'}`}>Recommended For</div>
                                <div className={`font-bold text-lg ${pkg.id === 'current-promotion' ? 'text-white' : 'text-[#121212]'}`}>{pkg.bestFor}</div>
                            </div>
                            <button onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })} className={`px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs transition-all shadow-xl hover:scale-105 active:scale-95 ${pkg.id === 'current-promotion'
                                ? 'bg-white text-black hover:bg-[#E62329] hover:text-white'
                                : 'bg-[#121212] text-white hover:bg-[#E62329]'
                                }`}>
                                Claim Offer
                            </button>
                        </div>
                    </div>
                </motion.div>
            )})}
        </div>
    )
}
