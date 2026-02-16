import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-[#FAFAF9]">
            <Navbar />
            
            <section className="pt-40 pb-32 max-w-4xl mx-auto px-6">
                <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">Legal Standards</span>
                <h1 className="text-5xl md:text-7xl font-black text-[#121212] tracking-tighter uppercase italic mb-16 leading-none">
                    PRIVACY <br />
                    <span className="silver-shine leading-none">PROTOCOL</span>
                </h1>

                <div className="bg-white rounded-[3rem] p-10 md:p-16 border border-gray-100 shadow-precision space-y-12 text-[#121212]/80 leading-relaxed font-medium">
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight text-[#121212] mb-4 italic">01. Data Collection</h2>
                        <p>We collect only the essential information required to provide elite automotive services, including vehicle telemetry, contact details for service updates, and diagnostic history.</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight text-[#121212] mb-4 italic">02. Encryption & Security</h2>
                        <p>All client data is encrypted using military-grade protocols. We maintain a "Privacy First" engineering standard, ensuring your vehicle's history and your personal details are never shared with third-party marketers.</p>
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase tracking-tight text-[#121212] mb-4 italic">03. Telemetry Usage</h2>
                        <p>Vehicle diagnostic data is used exclusively to optimize your service journey and provide predictive maintenance alerts via our AI Specialist system.</p>
                    </div>
                    <div className="pt-8 border-t border-gray-100 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                        Last Updated: February 2026
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    )
}
