import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'
import { Hero } from '@/components/v2/sections/hero'
import { EmergencyFAB } from '@/components/ui/emergency-fab'
import { getAllServices, getAllBrands } from '@/lib/firebase-db'
import { Service } from '@/types'
import { ServicePackage } from '@/types/v2'

import { AdvancedLogoSlider } from '@/components/v2/sections/advanced-logo-slider'
import { AboutSnippet } from '@/components/v2/sections/about-snippet'
import { Services } from '@/components/v2/sections/services'
import { WhySmartMotor } from '@/components/v2/sections/why-smart-motor'
import { ServicePackages } from '@/components/v2/sections/service-packages'
import { BookingForm } from '@/components/v2/sections/booking-form'
import { NewsletterSection } from '@/components/v2/sections/newsletter'
import { ReviewsCarousel } from '@/components/v2/sections/reviews-carousel'
import { FAQ } from '@/components/sections/faq'

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
        process: undefined,
        subServices: undefined,
        seo: undefined,
        detailedDescription: s.detailedDescription || undefined,
        image: s.image || undefined,
        iconImage: undefined
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
            <ReviewsCarousel />
            <NewsletterSection />
            <FAQ />
            <Footer />
            <EmergencyFAB />
        </main>
    )
}
