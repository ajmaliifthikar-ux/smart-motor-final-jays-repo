import type { Metadata } from 'next'
import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'
import { FAQ as FAQComponent } from '@/components/sections/faq'
import { getAllPublishedContent } from '@/lib/firebase-db'
import { HelpCircle, Shield, Clock, Wrench } from 'lucide-react'

export const revalidate = 3600

export const metadata: Metadata = {
    title: 'FAQ – Car Service Questions Answered | Smart Motor Abu Dhabi',
    description: 'Answers to common questions about car repair, PPF, ceramic coating, operating hours, warranties and booking at Smart Motor Auto Repair in Musaffah, Abu Dhabi.',
    openGraph: {
        title: 'FAQ | Smart Motor Auto Repair Abu Dhabi',
        description: 'Find answers to frequently asked questions about our automotive services, hours, pricing, and warranties.',
        url: 'https://smartmotor.ae/faq',
    },
    alternates: {
        canonical: 'https://smartmotor.ae/faq',
        languages: {
            'en': 'https://smartmotor.ae/faq',
            'ar': 'https://smartmotor.ae/ar/faq',
            'x-default': 'https://smartmotor.ae/faq',
        },
    },
}

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
        { "@type": "Question", name: "What car brands do you service?", acceptedAnswer: { "@type": "Answer", text: "We service all brands — BMW, Mercedes-Benz, Audi, Porsche, Toyota, Nissan, Honda, Lexus, Range Rover, Bentley and more. Our factory-certified technicians cover all makes." } },
        { "@type": "Question", name: "What are your operating hours?", acceptedAnswer: { "@type": "Answer", text: "We are open Monday to Saturday, 8:00 AM to 7:00 PM. Closed on Sundays. Emergency towing is available 24/7." } },
        { "@type": "Question", name: "Where are you located?", acceptedAnswer: { "@type": "Answer", text: "M9, Musaffah Industrial Area, Abu Dhabi, UAE." } },
        { "@type": "Question", name: "Do you offer a warranty on repairs?", acceptedAnswer: { "@type": "Answer", text: "Yes. All labour carries a 6-month warranty. Ceramic coating packages come with up to 9 years warranty. PPF films carry the manufacturer warranty (XPEL up to 10 years)." } },
        { "@type": "Question", name: "How do I book a service?", acceptedAnswer: { "@type": "Answer", text: "Book online via our website, call +971 2 555 5443, or WhatsApp +971 800 5445. Walk-ins are welcome during business hours." } },
        { "@type": "Question", name: "Do you offer financing?", acceptedAnswer: { "@type": "Answer", text: "Yes, we partner with Tabby for 4 interest-free installments. We accept Visa, Mastercard, Apple Pay and cash." } },
    ],
}

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://smartmotor.ae" },
        { "@type": "ListItem", position: 2, name: "FAQ", item: "https://smartmotor.ae/faq" },
    ],
}

export default async function FAQPage() {
    let faqs: any[] = []
    try {
        const content = await getAllPublishedContent('FAQ')
        faqs = content.map(c => ({
            id: c.id,
            question: c.title,
            answer: c.content,
            createdAt: c.createdAt
        }))
    } catch (e) {
        console.error(e)
    }

    return (
        <main className="min-h-screen bg-[#FAFAF9]">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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
