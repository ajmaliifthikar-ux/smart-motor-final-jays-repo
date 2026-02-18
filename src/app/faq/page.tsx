import type { Metadata } from 'next'
import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'
import { JsonLd } from '@/components/seo/JsonLd'
import { FAQAccordion } from '@/components/v2/sections/faq-accordion'

export const metadata: Metadata = {
    title: 'FAQ – Car Service Questions Answered | Smart Motor Abu Dhabi',
    description: 'Answers to common questions about car repair, PPF, ceramic coating, operating hours, and more at Smart Motor Auto Repair in Musaffah, Abu Dhabi.',
    openGraph: {
        title: 'FAQ | Smart Motor Auto Repair Abu Dhabi',
        description: 'Find answers to frequently asked questions about our automotive services, hours, pricing, and warranties.',
        url: 'https://smartmotor.ae/faq',
    },
    alternates: {
        canonical: 'https://smartmotor.ae/faq',
    },
}

const faqItems = [
    {
        question: 'What car brands do you service at Smart Motor?',
        answer: 'We service all vehicle brands — German (BMW, Mercedes-Benz, Audi, Porsche, Volkswagen), Japanese (Toyota, Nissan, Honda, Lexus, Infiniti), Korean (Hyundai, Kia, Genesis), American (Ford, GMC, Chevrolet), Chinese (BYD, Chery, Haval, MG), and European luxury (Range Rover, Bentley, Rolls-Royce, Ferrari, Lamborghini). Our factory-certified technicians use OEM-quality parts for every brand.',
    },
    {
        question: 'Where is Smart Motor Auto Repair located?',
        answer: 'We are located at M9, Musaffah Industrial Area, Abu Dhabi, UAE. Musaffah is Abu Dhabi\'s main automotive hub, making us easily accessible from all parts of the city. Search "Smart Motor Musaffah" on Google Maps for directions.',
    },
    {
        question: 'What are your operating hours?',
        answer: 'We are open Monday to Saturday, 8:00 AM to 7:00 PM. We are closed on Sundays. Emergency towing assistance is available 24/7 — call +971 2 555 5443 or WhatsApp +971 800 5445 any time.',
    },
    {
        question: 'How do I book a car service appointment?',
        answer: 'You can book an appointment online through our website booking form, call us at +971 2 555 5443, or send us a WhatsApp message at +971 800 5445. Walk-ins are also welcome during business hours, though we recommend booking in advance for specialist services.',
    },
    {
        question: 'How long does a standard service take?',
        answer: 'A standard oil change and inspection takes 1–2 hours. Major mechanical repairs typically take 1–3 days. PPF installation takes 1–3 days depending on coverage. Ceramic coating takes 1–2 days. We provide a realistic time estimate when you drop off your vehicle.',
    },
    {
        question: 'Do you offer a warranty on your repairs?',
        answer: 'Yes. All labour work carries a 6-month warranty. Parts warranties depend on the manufacturer — typically 12 months for genuine parts. Ceramic coating packages include up to 9 years warranty. PPF films carry the manufacturer\'s warranty (XPEL offers up to 10 years).',
    },
    {
        question: 'How long does PPF (Paint Protection Film) installation take?',
        answer: 'Full-vehicle PPF installation takes 2–3 days. Partial coverage (front bumper, hood, fenders) can be completed in 1 day. We are certified XPEL installers and use precision computer-cut templates for a factory-perfect finish.',
    },
    {
        question: 'What ceramic coating warranty do you offer?',
        answer: 'Our Gtechniq ceramic coating packages come with warranties from 1 year up to 9 years depending on the package selected. As certified Gtechniq installers, we apply under controlled conditions to guarantee adhesion and longevity.',
    },
    {
        question: 'Do you use genuine OEM parts or aftermarket?',
        answer: 'We prioritize genuine OEM parts for all repairs. Where original parts are unavailable or cost-prohibitive, we use only certified OEM-equivalent parts from approved suppliers. We always inform customers of the options before proceeding.',
    },
    {
        question: 'Do you offer a pickup and delivery service?',
        answer: 'Yes. We offer complimentary pickup and delivery within Abu Dhabi for scheduled appointments. Please mention this when booking and our team will arrange a convenient time.',
    },
    {
        question: 'Do you offer financing or payment plans?',
        answer: 'Yes. We partner with Tabby for Buy Now Pay Later options, allowing you to split any payment into 4 interest-free installments. We also accept Visa, Mastercard, Apple Pay, and cash.',
    },
    {
        question: 'Can you service electric vehicles (EVs)?',
        answer: 'Yes. Our technicians are trained for EV diagnostics and service including battery health checks, regenerative braking systems, and electrical systems for Tesla, BYD, Polestar, Lucid, and other EV brands.',
    },
    {
        question: 'Do you provide a free inspection?',
        answer: 'Yes. We offer a complimentary multi-point vehicle health inspection with every service booking. This covers engine, transmission, brakes, tyres, AC, battery, and fluid levels.',
    },
    {
        question: 'What is your phone number?',
        answer: 'You can reach us at +971 2 555 5443 (landline) or on WhatsApp at +971 800 5445. Our team is available Monday to Saturday, 8:00 AM to 7:00 PM.',
    },
    {
        question: 'How do I get to Smart Motor from Abu Dhabi city centre?',
        answer: 'From Abu Dhabi city centre, take Sheikh Zayed Bin Sultan St (E10) towards Musaffah. Exit at Musaffah Industrial Area and follow signs for Sector M9. The journey takes approximately 20–30 minutes. Ample parking is available at our workshop.',
    },
]

const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map(item => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
        },
    })),
}

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://smartmotor.ae" },
        { "@type": "ListItem", position: 2, name: "FAQ", item: "https://smartmotor.ae/faq" },
    ],
}

export default function FAQPage() {
    return (
        <main className="min-h-screen bg-[#FAFAF9]">
            <JsonLd data={faqSchema} />
            <JsonLd data={breadcrumbSchema} />
            <Navbar />

            {/* Hero */}
            <section className="pt-40 pb-20 relative overflow-hidden bg-[#FAFAF9]">
                <div className="absolute inset-0 micro-noise opacity-5 pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative z-10">
                    <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">
                        Knowledge Base
                    </span>
                    <h1 className="text-5xl md:text-7xl font-black text-[#121212] tracking-tighter uppercase leading-[0.85] italic mb-8">
                        FREQUENTLY<br />
                        <span className="text-gray-400">ASKED QUESTIONS</span>
                    </h1>
                    <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                        Everything you need to know about our services, hours, warranties, and how to book your next appointment at Smart Motor Abu Dhabi.
                    </p>
                </div>
            </section>

            {/* FAQ List */}
            <section className="py-16 max-w-4xl mx-auto px-6 md:px-12">
                <div className="space-y-4">
                    {faqItems.map((item, i) => (
                        <FAQItem key={i} question={item.question} answer={item.answer} />
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="py-24 bg-[#121212] mx-6 md:mx-12 rounded-[3rem] mb-24 text-center">
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic mb-6">
                    Still have questions?
                </h2>
                <p className="text-gray-400 mb-10 font-medium">
                    Our team is available Mon–Sat, 8AM–7PM to help you.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <a
                        href="tel:+97125555443"
                        className="px-8 py-4 bg-[#E62329] text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#c91d23] transition-all"
                    >
                        Call +971 2 555 5443
                    </a>
                    <a
                        href="https://wa.me/9718005445"
                        className="px-8 py-4 bg-[#25D366] text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#1da851] transition-all"
                    >
                        WhatsApp Us
                    </a>
                </div>
            </section>

            <Footer />
        </main>
    )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    return (
        <details className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <summary className="flex items-center justify-between gap-4 p-6 cursor-pointer list-none font-black text-[#121212] uppercase tracking-tight text-sm hover:text-[#E62329] transition-colors">
                {question}
                <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 group-open:bg-[#E62329] group-open:text-white transition-all text-xs font-black">
                    <span className="group-open:hidden">+</span>
                    <span className="hidden group-open:block">−</span>
                </span>
            </summary>
            <div className="px-6 pb-6 text-gray-500 text-sm leading-relaxed font-medium border-t border-gray-50 pt-4">
                {answer}
            </div>
        </details>
    )
}
