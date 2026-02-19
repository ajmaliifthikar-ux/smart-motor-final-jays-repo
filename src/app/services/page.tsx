import type { Metadata } from 'next'
import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'
import { Services } from '@/components/v2/sections/services'
import { adminGetAllServices } from '@/lib/firebase-admin'
import { Service } from '@/types'

export const metadata: Metadata = {
    title: 'Car Services in Abu Dhabi | Mechanical, Electrical, PPF, Detailing – Smart Motor',
    description: 'Full automotive services in Abu Dhabi: engine repair, AC service, electrical diagnostics, PPF installation, ceramic coating, window tinting & detailing. Mon–Sat 8AM–7PM.',
    openGraph: {
        title: 'Car Services Abu Dhabi | Smart Motor Auto Repair',
        description: 'Engine repair, AC, PPF, ceramic coating, window tinting & detailing. Certified technicians for all brands in Musaffah, Abu Dhabi.',
        url: 'https://smartmotor.ae/services',
    },
    alternates: {
        canonical: 'https://smartmotor.ae/services',
        languages: {
            'en': 'https://smartmotor.ae/services',
            'ar': 'https://smartmotor.ae/ar/services',
            'x-default': 'https://smartmotor.ae/services',
        },
    },
}

export const revalidate = 3600

export default async function ServicesPage() {
    let servicesData: any[] = []
    try {
        servicesData = await adminGetAllServices()
    } catch (e) {
        console.error("DB Error", e);
    }

    const services: Service[] = servicesData.map(s => ({
        ...s,
        id: s.slug,
        descriptionAr: s.descriptionAr || '',
        category: (s.category as any) || 'mechanical',
        icon: s.icon || 'wrench',
        process: undefined,
        subServices: undefined,
        seo: undefined,
        detailedDescription: s.detailedDescription || undefined,
        image: s.image || undefined,
        iconImage: undefined
    }))

    return (
        <main className="min-h-screen bg-[#FAFAF9]">
            <Navbar />
            <div className="pt-32">
                <section className="py-24 text-center">
                    <div className="max-w-4xl mx-auto px-6">
                        <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">
                            Engineering Catalog
                        </span>
                        <h1 className="text-5xl md:text-8xl font-black text-[#121212] tracking-tighter uppercase leading-[0.85] italic mb-8">
                            MASTER <br />
                            <span className="silver-shine leading-none">SOLUTIONS</span>
                        </h1>
                        <p className="text-gray-500 text-lg md:text-xl font-medium leading-relaxed">
                            Discover our comprehensive range of high-performance automotive services, precision-engineered for the world's most elite vehicles.
                        </p>
                    </div>
                </section>
                <Services services={services} />
            </div>
            <Footer />
        </main>
    )
}
