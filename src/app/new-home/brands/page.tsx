import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'
import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import { adminGetAllBrands } from '@/lib/firebase-admin'
import { BrandsHero } from '@/components/v2/sections/brands-hero'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Car Brands We Service | Smart Motor Abu Dhabi',
    description: 'Expert repair for Mercedes, BMW, Audi, Toyota, Nissan, Chinese EVs, and American cars. Certified specialists for every brand.',
}

export const revalidate = 3600

const CATEGORIES = [
    {
        id: 'german',
        name: 'German Engineering',
        description: 'Premium service for high-performance German vehicles. Expert diagnostics and repairs for BMW, Mercedes, Audi, Porsche, and Volkswagen using manufacturer specifications.'
    },
    {
        id: 'japanese',
        name: 'Japanese Reliability',
        description: 'Comprehensive maintenance for Japanese brands. From routine service to complex repairs, we ensure your Toyota, Nissan, Lexus, and Infiniti run perfectly.'
    },
    {
        id: 'chinese',
        name: 'Chinese Brands',
        description: 'Specialized care for the new generation of Chinese luxury and electric vehicles. Expertise in BYD, MG, Geely, Hongqi, and more.'
    },
    {
        id: 'american',
        name: 'American Performance',
        description: 'Dedicated service for American muscle and SUVs. Ford, Chevrolet, GMC, Jeep, Dodge, and Cadillac specialists.'
    },
    {
        id: 'european',
        name: 'European Luxury',
        description: 'Expert care for British and Italian luxury brands including Range Rover, Jaguar, Bentley, and Rolls Royce.'
    }
]

export default async function BrandsPage() {
    let brandsData: any[] = []
    try {
        const allBrands = await adminGetAllBrands()
        brandsData = allBrands.map(b => ({
            id: b.id,
            name: b.name,
            logoUrl: b.logoUrl,
            description: b.description,
            specialties: undefined,
            category: undefined,
            slug: b.slug
        })).sort((a, b) => a.name.localeCompare(b.name))
    } catch (e) {
        console.error("DB Error", e);
    }

    const categoriesWithBrands = CATEGORIES.map(cat => ({
        ...cat,
        brands: brandsData.filter(b => {
            if (b.category === cat.id) return true
            return false
        })
    })).filter(cat => cat.brands.length > 0)

    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <BrandsHero />

            {/* Brand Categories */}
            <div className="py-20 space-y-32">
                {categoriesWithBrands.map((category) => (
                    <section id={category.id} key={category.id} className="scroll-mt-32">
                        <div className="max-w-7xl mx-auto px-6 md:px-12">
                            <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-gray-100 pb-8">
                                <div>
                                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-4 text-[#121212]">{category.name}</h2>
                                    <p className="text-gray-500 max-w-xl">{category.description}</p>
                                </div>
                                <div className="hidden md:block text-[#E62329]">
                                    <ShieldCheck size={40} strokeWidth={1.5} />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.brands.map((brand) => {
                                    // SAFELY HANDLE SPECIALTIES
                                    // In SQLite, JSON might be returned as string if not using proper adapter, or as Prisma JsonValue
                                    // Let's assume it might be a comma-separated string OR a JSON array
                                    let specialtiesList: string[] = []
                                    if (typeof brand.specialties === 'string') {
                                        if (brand.specialties.startsWith('[')) {
                                            try {
                                                specialtiesList = JSON.parse(brand.specialties)
                                            } catch (e) {
                                                specialtiesList = []
                                            }
                                        } else {
                                            specialtiesList = brand.specialties.split(',')
                                        }
                                    } else if (Array.isArray(brand.specialties)) {
                                        specialtiesList = brand.specialties as string[]
                                    }

                                    return (
                                    <Link href={`/new-home/brands/${brand.slug || brand.id}`} key={brand.id} className="group block h-full">
                                        <div className="bg-white rounded-[2rem] p-8 transition-all duration-500 h-full flex flex-col border border-gray-100 hover:border-[#E62329]/30 relative overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-[#E62329]/10 group-hover:-translate-y-2">
                                            {/* Hover Gradient Background (CSS driven) */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-white opacity-100 group-hover:opacity-0 transition-opacity duration-500" />
                                            <div className="absolute inset-0 bg-gradient-to-br from-[#121212] to-black opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                            <div className="relative z-10 flex flex-col h-full">
                                                <div className="flex justify-between items-start mb-8">
                                                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-gray-50 group-hover:scale-110 transition-transform duration-500 p-2">
                                                        {/* Logo Placeholder */}
                                                        {brand.logoUrl ? (
                                                            <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain" />
                                                        ) : (
                                                            <span className="text-[#121212] font-black text-xs uppercase text-center leading-none">{brand.name}</span>
                                                        )}
                                                    </div>
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-[#E62329] flex items-center justify-center transition-colors duration-300">
                                                        <ArrowRight className="text-gray-400 group-hover:text-white transition-colors" size={18} />
                                                    </div>
                                                </div>

                                                <h3 className="text-3xl font-black uppercase tracking-tighter mb-4 text-[#121212] group-hover:text-white transition-colors">{brand.name}</h3>
                                                <p className="text-sm text-gray-500 font-medium leading-relaxed group-hover:text-gray-400 mb-8 line-clamp-3">
                                                    {brand.description}
                                                </p>

                                                <div className="mt-auto pt-6 border-t border-gray-100 group-hover:border-white/10">
                                                    <div className="flex flex-wrap gap-2">
                                                        {specialtiesList.slice(0, 3).map((spec, s) => (
                                                            <span key={s} className="text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 bg-gray-100/80 text-gray-600 group-hover:bg-white/10 group-hover:text-white/80 rounded-lg group-hover:backdrop-blur-sm transition-colors">
                                                                {spec}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                )})}
                            </div>
                        </div>
                    </section>
                ))}
            </div>

            <Footer />
        </main>
    )
}
