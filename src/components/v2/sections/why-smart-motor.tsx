'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

const features = [
    { title: "Factory-Quality Standards", desc: "We maintain manufacturer specifications for all repairs." },
    { title: "State-of-the-Art Equipment", desc: "Advanced diagnostic tools and modern repair equipment." },
    { title: "Certified Technicians", desc: "Trained specialists with years of hands-on experience." },
    { title: "Transparent Pricing", desc: "No hidden charges - detailed estimates before work begins." },
    { title: "Comprehensive Services", desc: "From mechanical repairs to body shop to detailing." },
    { title: "Competitive Packages", desc: "Cost-effective service packages and promotional offers." },
    { title: "Convenient Location", desc: "Central Musaffah location with easy access from Abu Dhabi." }
]

const images = [
    { src: '/images/why-us/diagnostic.png', alt: 'Advanced Diagnostics', delay: 0 },
    { src: '/images/why-us/lounge.png', alt: 'Premium Lounge', delay: 0.1 },
    { src: '/images/why-us/team.png', alt: 'Expert Team', delay: 0.2 },
    { src: '/images/why-us/parts.png', alt: 'Genuine Parts', delay: 0.3 }
]

export function WhySmartMotor() {
    return (
        <section id="why-us" className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 items-center">
                {/* Left: Image Grid */}
                <div className="w-full lg:w-1/2">
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                        {images.map((img, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: img.delay, duration: 0.5 }}
                                className={`relative rounded-[2rem] overflow-hidden shadow-lg group aspect-square ${idx === 1 || idx === 3 ? 'mt-8 md:mt-12' : ''}`}
                            >
                                <img
                                    src={img.src}
                                    alt={img.alt}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                                <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                    <span className="text-white text-[10px] font-black uppercase tracking-widest bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 inline-block">
                                        {img.alt}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Right: Content */}
                <div className="w-full lg:w-1/2">
                    <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                        Why Smart Motor?
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-[#121212] tracking-tighter uppercase leading-[0.9] mb-10">
                        The Smart <span className="silver-shine">Definition</span>
                    </h2>

                    <div className="space-y-6">
                        {features.map((feature, index) => (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={index}
                                className="flex gap-4 items-start group"
                            >
                                <CheckCircle2 className="text-[#E62329] flex-shrink-0 mt-1 transition-transform group-hover:scale-110" size={20} />
                                <div>
                                    <h4 className="text-lg font-bold text-[#121212] group-hover:text-[#E62329] transition-colors">{feature.title}</h4>
                                    <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
