import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'
import { getAllBrands } from '@/lib/firebase-db'
import { notFound } from 'next/navigation'
import { Shield, Wrench, CheckCircle2, ChevronRight, Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const allBrands = await getAllBrands()
    const brand = allBrands.find(b => b.slug === slug)

    if (!brand) {
        notFound()
    }

    const models = brand.description ? brand.description.split(',') : []
    const specialties: string[] = [] // Specialties not available in Firebase brand model

    return (
        <main className="min-h-screen bg-[#FAFAF9]">
            <Navbar />
            
            {/* Hero Section */}
            <section className="relative pt-40 pb-24 overflow-hidden bg-black text-white rounded-b-[4rem]">
                <div className="absolute inset-0 micro-noise opacity-10" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E62329]/10 blur-[120px] rounded-full -mr-64 -mt-64" />
                
                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="w-32 h-32 md:w-48 md:h-48 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 flex items-center justify-center shadow-2xl">
                            <img 
                                src={brand.logoUrl || '/bg-placeholder.jpg'} 
                                alt={brand.name} 
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <span className="text-[#E62329] font-black text-xs uppercase tracking-[0.4em] mb-4 block">
                                Specialized Heritage
                            </span>
                            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.85] mb-6">
                                {brand.name} <br /> <span className="silver-shine">Certified</span>
                            </h1>
                            <p className="text-gray-400 text-lg max-w-2xl font-medium leading-relaxed">
                                {brand.description || 'Premium automotive service'}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Specialties & Models */}
            <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Specialties */}
                    <div className="lg:col-span-2 space-y-12">
                        <div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E62329] mb-8">Engineering Specialties</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {specialties.map((spec, i) => (
                                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex items-start gap-5 group hover:shadow-xl transition-all duration-500">
                                        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#121212] group-hover:bg-[#E62329] group-hover:text-white transition-colors duration-500">
                                            <Wrench size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-[#121212] uppercase tracking-tighter text-lg mb-1">{spec}</h4>
                                            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Precision Calibration</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Models Grid */}
                        <div>
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#E62329] mb-8">Performance Models Serviced</h2>
                            <div className="flex flex-wrap gap-3">
                                {models.map((model, i) => (
                                    <div key={i} className="px-8 py-4 bg-white rounded-full border border-gray-100 text-xs font-black uppercase tracking-widest text-[#121212] shadow-sm hover:border-[#E62329] transition-colors cursor-default">
                                        {model}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Booking Sidebar */}
                    <div className="space-y-8">
                        <div className="bg-[#121212] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl italic">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E62329]/10 blur-3xl rounded-full" />
                            <Shield className="text-[#E62329] mb-6" size={40} />
                            <h3 className="text-3xl font-black uppercase tracking-tighter leading-none mb-4">Elite <br /> Service</h3>
                            <p className="text-gray-400 text-sm mb-10 not-italic">Our master technicians are factory-trained specifically for {brand.name} platforms.</p>
                            <Link 
                                href="/#booking" 
                                className="inline-flex items-center justify-center w-full bg-white text-black rounded-full py-5 text-[10px] font-black uppercase tracking-widest hover:bg-[#E62329] hover:text-white transition-all shadow-xl"
                            >
                                Schedule Inspection
                            </Link>
                        </div>

                        <div className="bg-[#FAFAF9] rounded-[3rem] p-10 border-2 border-dashed border-gray-200">
                            <div className="flex items-center gap-2 mb-6 text-[#121212]">
                                <Star className="fill-[#FFCC00] text-[#FFCC00]" size={16} />
                                <span className="text-xs font-black uppercase tracking-widest">Client Reviews</span>
                            </div>
                            <p className="text-sm font-medium text-gray-500 leading-relaxed mb-6 italic">"The only place in Abu Dhabi I trust with my {models[0] || brand.name}. Precision and transparency at every step."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Verified Owner</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
