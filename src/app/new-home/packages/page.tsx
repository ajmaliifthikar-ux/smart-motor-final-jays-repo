import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'
import { prisma } from '@/lib/prisma'
import { ServicePackage } from '@/types/v2'
import { PackagesList } from '@/components/v2/sections/packages-list'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Value Service Packages | Smart Motor Abu Dhabi',
    description: 'Exclusive auto service packages for Mercedes, BMW, Audi, and more. Transparent pricing and premium care in Musaffah.',
}

export const revalidate = 3600

export default async function PackagesPage() {
    let packagesData: any[] = []
    try {
        packagesData = await prisma.servicePackage.findMany({
            orderBy: { createdAt: 'asc' }
        })
    } catch (e) {
        console.error("DB Error", e);
    }

    // Cast to ServicePackage type
    const packages: ServicePackage[] = packagesData.map(p => ({
        ...p,
        bestFor: p.bestFor || 'General Use',
        isPromotional: p.isPromotional
    }))

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <section className="pt-40 pb-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9] mb-8">
                        Exclusive <span className="text-[#E62329]">Offers</span>
                    </h1>
                    <p className="text-gray-500 text-xl font-medium">
                        Premium service packages designed to save you money while maintaining your vehicle's peak performance.
                    </p>
                </div>
            </section>

            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <PackagesList packages={packages} />
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-[#E62329] text-white">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">Need a Custom Package?</h2>
                    <p className="text-xl font-medium mb-10">
                        We understand every driver is unique. Contact us to create a service plan tailored to your specific vehicle and driving habits.
                    </p>
                    <a href="#contact" className="bg-white text-[#E62329] px-12 py-5 rounded-full font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-xl inline-block">
                        Contact Us
                    </a>
                    {/* Note: In original code, onClick scrolled to 'contact'. 
                        Server component button with interactivity needs client wrapper or simple link.
                        For simplicity, I'll use a Link or assume this button might be static for now? 
                        Wait, original had onClick. 
                        I should probably make this button a client component or use a Link with hash. 
                    */}
                </div>
            </section>

            <Footer />
        </main>
    )
}
