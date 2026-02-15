import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function TermsPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="pt-32 pb-24 max-w-4xl mx-auto px-6">
                <h1 className="text-5xl font-black uppercase tracking-tighter mb-12">Terms of Service</h1>

                <div className="prose prose-lg max-w-none space-y-12 text-gray-600 font-medium">
                    <section>
                        <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-4">1. Agreement to Terms</h2>
                        <p>
                            By accessing the Smart Motor platform, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you are prohibited from using the site and our services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-4">2. Service Bookings</h2>
                        <p>
                            Bookings are subject to availability and technical review. Smart Motor reserves the right to refuse service for vehicles that fall outside our mechanical specialization or safety standards.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-4">3. Emergency Towing</h2>
                        <p>
                            Emergency towing services are provided through our partner network. While we strive for accuracy in ETAs and location tracking, Smart Motor is not liable for delays caused by traffic, weather, or operational constraints of third-party recovery units.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-4">4. Payment & Fees</h2>
                        <p>
                            Prices listed on the platform are estimates. Final pricing is determined after a physical diagnostic. Payments made through the platform are processed securely, and receipts will be issued upon completion of service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-4">5. Intellectual Property</h2>
                        <p>
                            The logos, designs, and content on this platform are the exclusive property of Smart Motor Auto Repair. Unauthorized reproduction or use of these materials is strictly prohibited.
                        </p>
                    </section>
                </div>
            </div>
            <Footer />
        </main>
    )
}
