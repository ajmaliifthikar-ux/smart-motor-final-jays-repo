'use client'

import { motion } from 'framer-motion'
import { ArrowRightIcon } from 'lucide-react'

export function AboutSnippet() {
    return (
        <section id="about" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-12 items-center">
                <div className="w-full md:w-1/2">
                    <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                        Who We Are
                    </span>
                    <h2 className="text-4xl font-black text-[#121212] tracking-tighter uppercase leading-[0.9] mb-8">
                        Your Trusted <br /> Automotive Partner <br /> <span className="text-gray-500">In Abu Dhabi</span>
                    </h2>

                    <p className="text-gray-500 font-medium leading-relaxed mb-6">
                        Smart Motor Auto Repair is a professional automotive service center dedicated to delivering top-notch solutions for all your vehicle needs. Located in the heart of Musaffah (M9), we specialize in luxury, sports, and European vehicles with expertise across German, Japanese, and Chinese brands.
                    </p>

                    <p className="text-gray-500 font-medium leading-relaxed mb-8">
                        Whether you need routine maintenance, complex repairs, body shop services, or premium detailing, we are your one-stop solution for complete automotive care.
                    </p>

                    <button className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#121212] hover:text-[#E62329] transition-colors">
                        Learn More About Us <ArrowRightIcon size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
                    {[
                        { val: "15+", label: "Years Experience" },
                        { val: "1k+", label: "Happy Customers" },
                        { val: "50+", label: "Brand Specialists" },
                        { val: "7-Day", label: "Service Guarantee" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-[#121212] hover:text-white transition-colors group cursor-default">
                            <span className="text-3xl font-black mb-2 text-[#121212] group-hover:text-white transition-colors">{stat.val}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-white/60 transition-colors">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
