'use client'

import { motion } from 'framer-motion'
import { ArrowRightIcon } from 'lucide-react'

interface AboutSnippetProps {
    cmsData?: {
        title?: string
        subtitle?: string
        body?: string
        imageUrl?: string
        ctaLabel?: string
        ctaLink?: string
    }
}

export function AboutSnippet({ cmsData }: AboutSnippetProps) {
    const title = cmsData?.title || "Your Trusted <br /> Automotive Partner <br /> <span className=\"text-gray-500\">In Abu Dhabi</span>"
    const subtitle = cmsData?.subtitle || "Who We Are"
    const body = cmsData?.body || "Smart Motor Auto Repair is Abu Dhabi's trusted car service center — located at M9, Musaffah Industrial Area. Since 2009, our factory-certified technicians have specialized in luxury, sports, and European car repair, with proven expertise across German, Japanese, American, and Chinese brands.\n\nFrom routine oil changes and engine diagnostics to PPF installation, ceramic coating, body shop, and full car detailing — we are your one-stop automotive care destination in Abu Dhabi. 6-month labour warranty on all repairs."
    const ctaLabel = cmsData?.ctaLabel || "Learn More About Us"
    const isVisible = cmsData?.isVisible !== false
    const theme = cmsData?.theme || 'light'

    if (!isVisible) return null

    return (
        <section id="about" className={cn(
            "py-24 relative transition-colors duration-700",
            theme === 'dark' ? "bg-[#121212] text-white" : "bg-white text-[#121212]",
            theme === 'glass' && "bg-white/10 backdrop-blur-md"
        )}>
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row gap-12 items-center">
                <div className="w-full md:w-1/2">
                    <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">
                        {subtitle}
                    </span>
                    <h2 
                        className={cn(
                            "text-4xl font-black tracking-tighter uppercase leading-[0.9] mb-8",
                            theme === 'dark' ? "text-white" : "text-[#121212]"
                        )}
                        dangerouslySetInnerHTML={{ __html: title }}
                    />

                    <div className={cn(
                        "space-y-6 mb-8 font-medium leading-relaxed",
                        theme === 'dark' ? "text-white/60" : "text-gray-500"
                    )}>
                        {body.split('\n\n').map((paragraph, i) => (
                            <p key={i}>{paragraph}</p>
                        ))}
                    </div>

                    <button className={cn(
                        "group flex items-center gap-2 text-sm font-black uppercase tracking-widest transition-colors",
                        theme === 'dark' ? "text-white hover:text-[#E62329]" : "text-[#121212] hover:text-[#E62329]"
                    )}>
                        {ctaLabel} <ArrowRightIcon size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
                    {[
                        { val: "15+", label: "Years Experience" },
                        { val: "1k+", label: "Happy Customers" },
                        { val: "50+", label: "Brand Specialists" },
                        { val: "7-Day", label: "Service Guarantee" }
                    ].map((stat, i) => (
                        <div 
                            key={i} 
                            className={cn(
                                "rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors group cursor-default",
                                theme === 'dark' 
                                    ? "bg-white/5 hover:bg-white/10" 
                                    : "bg-gray-50 hover:bg-[#121212]"
                            )}
                        >
                            <span className={cn(
                                "text-3xl font-black mb-2 transition-colors",
                                theme === 'dark' ? "text-white" : "text-[#121212]",
                                theme !== 'dark' && "group-hover:text-white"
                            )}>
                                {stat.val}
                            </span>
                            <span className={cn(
                                "text-[10px] font-bold uppercase tracking-widest transition-colors",
                                theme === 'dark' ? "text-white/40" : "text-gray-500",
                                theme !== 'dark' && "group-hover:text-white/60"
                            )}>
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
