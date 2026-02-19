'use client'

import { motion } from 'framer-motion'

const features = [
    {
        title: 'Factory-Quality Standards',
        desc: 'OEM-grade repairs that maintain manufacturer specifications — so your warranty stays intact.',
        icon: '/Automotive-Icons/Approval iOS 17 Glyph.png',
    },
    {
        title: 'State-of-the-Art Equipment',
        desc: 'Advanced diagnostic tools from Autel, Snap-on & Bosch for precise car repair in Abu Dhabi.',
        icon: '/Automotive-Icons/Car Service iOS 17 Glyph.png',
    },
    {
        title: 'Factory-Certified Technicians',
        desc: '50+ brand-trained specialists for BMW, Mercedes, Toyota, Nissan & all major car brands.',
        icon: '/Automotive-Icons/Automotive iOS 17 Glyph.png',
    },
    {
        title: 'Transparent AED Pricing',
        desc: 'No hidden charges — get a full AED estimate before any work starts on your vehicle.',
        icon: '/Automotive-Icons/Car Insurance iOS 17 Glyph.png',
    },
    {
        title: 'Complete Automotive Services',
        desc: 'Engine repair, AC service, electrical, PPF, ceramic coating, window tinting & detailing — all under one roof.',
        icon: '/Automotive-Icons/Garage iOS 17 Glyph.png',
    },
    {
        title: 'Competitive Service Packages',
        desc: 'Affordable car service packages in Abu Dhabi with Tabby 0% installment payment options.',
        icon: '/Automotive-Icons/Car Badge Material Rounded.png',
    },
    {
        title: 'Musaffah, Abu Dhabi Location',
        desc: 'Easily accessible at M9, Musaffah Industrial Area — serving all of Abu Dhabi, Khalifa City & Al Reem Island.',
        icon: '/Automotive-Icons/Garage Material Sharp.png',
    },
]

const images = [
    { src: '/images/why-us/diagnostic.png', alt: 'Advanced Diagnostics', delay: 0 },
    { src: '/images/why-us/lounge.png',     alt: 'Premium Lounge',       delay: 0.1 },
    { src: '/images/why-us/team.png',       alt: 'Expert Team',          delay: 0.2 },
    { src: '/images/why-us/parts.png',      alt: 'Genuine Parts',        delay: 0.3 },
]

// CSS filter to tint any PNG to the brand red #E62329
const RED_FILTER = 'brightness(0) saturate(100%) invert(18%) sepia(96%) saturate(4000%) hue-rotate(349deg) brightness(88%) contrast(108%)'

export function WhySmartMotor() {
    return (
        <section id="why-us" className="py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-16 items-center">

                {/* ── Left: 2×2 image grid ── */}
                <div className="w-full lg:w-1/2">
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                        {images.map((img, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: img.delay, duration: 0.5 }}
                                className={`relative rounded-[2rem] overflow-hidden shadow-lg group aspect-square${idx === 1 || idx === 3 ? ' mt-8 md:mt-12' : ''}`}
                            >
                                <img src={img.src} alt={img.alt} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
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

                {/* ── Right: feature list ── */}
                <div className="w-full lg:w-1/2">
                    <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                        Why Smart Motor?
                    </span>
                    <h2 className="text-4xl md:text-5xl font-black text-[#121212] tracking-tighter uppercase leading-[0.9] mb-10">
                        The Smart <span className="silver-shine">Definition</span>
                    </h2>

                    <div className="space-y-5">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.4 }}
                                className="flex gap-4 items-start group"
                            >
                                {/* Icon */}
                                <div className="w-9 h-9 flex-shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                                    <img
                                        src={feature.icon}
                                        alt={feature.title}
                                        className="w-full h-full object-contain"
                                        style={{ filter: RED_FILTER }}
                                        onError={e => {
                                            // fallback: red dot
                                            const el = e.currentTarget.parentElement
                                            if (el) el.innerHTML = '<div style="width:10px;height:10px;background:#E62329;border-radius:50%;margin:8px 0 0 4px"></div>'
                                        }}
                                    />
                                </div>

                                <div>
                                    <h4 className="text-[15px] font-bold text-[#121212] group-hover:text-[#E62329] transition-colors leading-snug mb-0.5">
                                        {feature.title}
                                    </h4>
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
