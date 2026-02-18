import type { Metadata } from 'next'
import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'
import { Hero } from '@/components/v2/sections/hero'
import { EmergencyFAB } from '@/components/ui/emergency-fab'
import dynamic from 'next/dynamic'
import { getAllServices, getAllBrands } from '@/lib/firebase-db'
import { Service } from '@/types'
import { ServicePackage } from '@/types/v2'

import { AdvancedLogoSlider } from '@/components/v2/sections/advanced-logo-slider'
import { AboutSnippet } from '@/components/v2/sections/about-snippet'
import { Services } from '@/components/v2/sections/services'
import { WhySmartMotor } from '@/components/v2/sections/why-smart-motor'
import { ServicePackages } from '@/components/v2/sections/service-packages'
import { Testimonials } from '@/components/v2/sections/testimonials'
import { BookingForm } from '@/components/v2/sections/booking-form'
import { FAQ } from '@/components/sections/faq'

export const metadata: Metadata = {
    title: 'Car Service & Repair Abu Dhabi | Smart Motor Auto Repair – Est. 2009',
    description: 'Smart Motor — Abu Dhabi\'s trusted car service & repair center in Musaffah. BMW, Mercedes, Toyota, Nissan & all brands. Engine repair, AC, PPF, ceramic coating, window tinting & detailing. 4.9★ Google rated. Mon–Sat 8AM–7PM. Call +971 2 555 5443.',
    alternates: {
        canonical: 'https://smartmotor.ae',
        languages: {
            'en': 'https://smartmotor.ae',
            'ar': 'https://smartmotor.ae/ar',
            'x-default': 'https://smartmotor.ae',
        },
    },
}

export const revalidate = 3600 // Revalidate every hour

export default async function Home() {
    let servicesData: any[] = []
    let packagesData: any[] = []
    let brandsData: any[] = []

    try {
        const [s, b] = await Promise.all([
            getAllServices(),
            getAllBrands()
        ])
        servicesData = s
        packagesData = [] // No service packages in Firebase yet
        brandsData = b
    } catch (e) {
        console.error("DB Error", e);
    }

    // Cast to Service type
    const services: Service[] = servicesData.map(s => ({
        ...s,
        id: s.slug, // Map slug to id
        descriptionAr: s.descriptionAr || '',
        category: (s.category as any) || 'mechanical',
        icon: s.icon || 'wrench',
        process: s.process as any,
        subServices: s.subServices as any,
        seo: s.seo as any,
        detailedDescription: s.detailedDescription || undefined,
        image: s.image || undefined,
        iconImage: s.iconImage || undefined
    }))

    const packages: ServicePackage[] = packagesData.map(p => ({
        ...p,
        bestFor: p.bestFor || 'General Use',
        isPromotional: p.isPromotional
    }))

    const brands = brandsData.map(b => ({
        id: b.id,
        name: b.name,
        src: b.logoUrl || '/bg-placeholder.jpg',
        slug: b.slug || b.id
    }))

    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <Hero />
            <div className="overflow-hidden">
                <AdvancedLogoSlider brands={brands} />
            </div>
            <AboutSnippet />
            <Services services={services} />
            <WhySmartMotor />
            <ServicePackages packages={packages} />
            <BookingForm />
            <Testimonials />
            <FAQ />
            <Footer />
            <EmergencyFAB />
        </main>
    )
}
