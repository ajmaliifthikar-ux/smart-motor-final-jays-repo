'use client'

import { aboutContent, brandCategories } from '@/lib/v2-data'
import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'
import { AdvancedLogoSlider } from '@/components/v2/sections/advanced-logo-slider'
import { motion } from 'framer-motion'
import { CheckCircle2, Award, ArrowUpRight } from 'lucide-react'

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            {/* Hero */}
            <section className="pt-40 pb-20 bg-gray-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E62329]/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                            About Smart Motor
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9] mb-8">
                            Your Trusted <br /> Automotive Partner
                        </h1>
                        <p className="max-w-3xl mx-auto text-xl text-gray-500 font-medium leading-relaxed mb-12">
                            {aboutContent.story}
                        </p>
                    </motion.div>

                    {/* Centered Key Stats - "Years in Business" Highlight */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-b border-gray-200 py-12">
                        {aboutContent.stats.map((stat, i) => (
                            <div key={i} className="text-center group cursor-default">
                                <div className="text-4xl md:text-5xl font-black mb-2 text-[#121212] group-hover:text-[#E62329] transition-colors duration-300">
                                    {stat.value}
                                </div>
                                <div className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Values */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                        <div>
                            <span className="text-gray-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Our Philosophy</span>
                            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
                                Driven By <br /><span className="text-[#E62329]">Excellence.</span>
                            </h2>
                            <p className="text-xl text-gray-800 font-medium leading-relaxed mb-8 border-l-4 border-[#E62329] pl-6">
                                {aboutContent.mission}
                            </p>
                        </div>

                        <div className="bg-gray-50 rounded-[3rem] p-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E62329]/5 blur-[80px] rounded-full pointer-events-none" />
                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 relative z-10">Our Core Values</h3>
                            <div className="space-y-6 relative z-10">
                                {aboutContent.values.map((value, i) => (
                                    <motion.div
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        key={i}
                                        className="flex items-center gap-4 group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-white text-[#121212] group-hover:bg-[#E62329] group-hover:text-white transition-colors duration-300 flex items-center justify-center shadow-lg">
                                            <Award size={20} />
                                        </div>
                                        <span className="text-lg font-bold text-gray-700 group-hover:text-black transition-colors">{value}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Expertise - Magazine Style Layout */}
            <section className="py-24 bg-[#121212] text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('/bg-pattern.png')] opacity-5" />
                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                            Our Expertise
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6">Why Choose Us?</h2>
                        <p className="text-gray-400 text-lg">Excellence in every detail of our service, curated for luxury vehicle and performance enthusiasts.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Featured Large Card */}
                        <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-10 md:p-14 flex flex-col justify-end min-h-[400px] relative overflow-hidden group">
                            <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-700">
                                {/* Placeholder pattern or image */}
                                <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#000_10px,#000_20px)] opacity-20"></div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                            <div className="relative z-10">
                                <CheckCircle2 className="mb-6 text-[#E62329]" size={48} />
                                <h3 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-4">{aboutContent.features[0]}</h3>
                                <p className="text-gray-400 text-lg max-w-lg">We adhere strictly to manufacturer standards, ensuring every repair maintains the integrity and value of your vehicle.</p>
                            </div>
                        </div>

                        {/* Tall Card */}
                        <div className="bg-white text-black rounded-[3rem] p-10 flex flex-col relative overflow-hidden group hover:bg-[#E62329] hover:text-white transition-colors duration-500">
                            <h3 className="text-2xl font-black uppercase tracking-tighter mb-auto relative z-10">{aboutContent.features[1]}</h3>
                            <div className="relative z-10 mt-12">
                                <p className="font-bold opacity-70 mb-4">Advanced Diagnostics</p>
                                <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center">
                                    <ArrowUpRight size={24} />
                                </div>
                            </div>
                        </div>

                        {/* Standard Cards with Magazine typography */}
                        {aboutContent.features.slice(2).map((feature, i) => (
                            <div key={i} className="bg-gray-900/50 border border-white/10 rounded-[2.5rem] p-8 hover:bg-white hover:text-black transition-all duration-300 group flex flex-col h-full">
                                <div className="mb-6 opacity-30 group-hover:opacity-100 transition-opacity">
                                    <span className="text-4xl font-black tracking-tighter">0{i + 3}</span>
                                </div>
                                <h4 className="text-xl font-black uppercase tracking-wide leading-tight mt-auto group-hover:translate-x-2 transition-transform duration-300">{feature}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Collaborated Brands - New Section */}
            <section className="bg-white overflow-hidden pb-12">
                <AdvancedLogoSlider />
            </section>

            <Footer />
        </main>
    )
}
