import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'
import { FAQ as FAQComponent } from '@/components/sections/faq'
import { prisma } from '@/lib/prisma'
import { HelpCircle, Shield, Clock, Wrench } from 'lucide-react'

export const revalidate = 3600

export default async function FAQPage() {
    let faqs: any[] = []
    try {
        faqs = await prisma.fAQ.findMany({
            orderBy: { createdAt: 'asc' }
        })
    } catch (e) {
        console.error(e)
    }

    return (
        <main className="min-h-screen bg-[#FAFAF9]">
            <Navbar />
            
            <section className="pt-40 pb-16 relative overflow-hidden">
                <div className="absolute inset-0 micro-noise opacity-5 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 text-center">
                    <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">
                        Knowledge Base
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black text-[#121212] tracking-tighter uppercase leading-[0.85] italic mb-8">
                        ELITE <br />
                        <span className="silver-shine leading-none">INSIGHTS</span>
                    </h1>
                    <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                        Answers to the most common engineering and service inquiries from our global clientele.
                    </p>
                </div>
            </section>

            <div className="pb-24">
                <FAQComponent initialFaqs={faqs} />
            </div>
            
            <section className="pb-32 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-precision">
                        <div className="w-12 h-12 rounded-2xl bg-[#E62329]/10 flex items-center justify-center text-[#E62329] mb-6">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-xl font-black text-[#121212] uppercase tracking-tight mb-4 italic">Global Warranty</h3>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium">
                            Our standard 6-month warranty on labor ensures your peace of mind across all Abu Dhabi regions.
                        </p>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-precision">
                        <div className="w-12 h-12 rounded-2xl bg-[#121212] flex items-center justify-center text-white mb-6">
                            <Wrench size={24} />
                        </div>
                        <h3 className="text-xl font-black text-[#121212] uppercase tracking-tight mb-4 italic">OEM Only</h3>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium">
                            Zero compromise on quality. We use only 100% genuine parts for luxury and performance vehicles.
                        </p>
                    </div>
                    <div className="bg-white rounded-[2.5rem] p-10 border border-gray-100 shadow-precision">
                        <div className="w-12 h-12 rounded-2xl bg-[#FFD700]/10 flex items-center justify-center text-[#FFD700] mb-6">
                            <Clock size={24} />
                        </div>
                        <h3 className="text-xl font-black text-[#121212] uppercase tracking-tight mb-4 italic">Rapid Turnaround</h3>
                        <p className="text-gray-500 text-sm leading-relaxed font-medium">
                            Most minor services are completed within 2-3 hours using our synchronized workshop orchestration.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
