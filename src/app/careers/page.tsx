import type { Metadata } from 'next'
import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'
import { JsonLd } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
    title: 'Careers – Join Our Team | Smart Motor Auto Repair Abu Dhabi',
    description: 'Join Abu Dhabi\'s premier automotive workshop. We\'re hiring certified technicians, service advisors, detailers & more at Smart Motor Musaffah. Competitive salary + benefits.',
    openGraph: {
        title: 'Careers at Smart Motor Auto Repair Abu Dhabi',
        description: 'Build your automotive career with Abu Dhabi\'s most trusted workshop. View open positions at Smart Motor Musaffah.',
        url: 'https://smartmotor.ae/careers',
    },
    alternates: {
        canonical: 'https://smartmotor.ae/careers',
    },
}

const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://smartmotor.ae" },
        { "@type": "ListItem", position: 2, name: "Careers", item: "https://smartmotor.ae/careers" },
    ],
}

const openPositions = [
    {
        title: 'Senior Automotive Technician',
        department: 'Workshop',
        type: 'Full-time',
        description: 'Experienced technician for complex diagnostics and repair on European and Japanese vehicles. Minimum 5 years experience required.',
        requirements: ['5+ years experience', 'Diagnostic tool proficiency', 'European brand knowledge preferred'],
    },
    {
        title: 'Service Advisor',
        department: 'Customer Service',
        type: 'Full-time',
        description: 'Front-facing role managing customer relationships, service estimates, and workshop coordination. Strong English and Arabic communication skills required.',
        requirements: ['2+ years in automotive service', 'Excellent communication', 'Arabic & English fluency'],
    },
    {
        title: 'PPF & Ceramic Coating Specialist',
        department: 'Detailing',
        type: 'Full-time',
        description: 'Certified installer for Paint Protection Film (XPEL) and ceramic coating (Gtechniq). Prior certification is a strong advantage.',
        requirements: ['XPEL or similar certification', 'Detail-oriented', 'Portfolio of installations'],
    },
    {
        title: 'Auto Electrician',
        department: 'Workshop',
        type: 'Full-time',
        description: 'Diagnose and repair electrical systems across all vehicle brands including EVs. Experience with modern ADAS and infotainment systems is a plus.',
        requirements: ['Auto electrical certification', 'EV experience preferred', 'Modern diagnostic tools'],
    },
    {
        title: 'Car Detailing Technician',
        department: 'Detailing',
        type: 'Full-time',
        description: 'Interior and exterior detailing specialist with machine polishing skills. Experience in high-end vehicle detailing is preferred.',
        requirements: ['2+ years detailing experience', 'Machine polishing skills', 'Eye for perfection'],
    },
]

const benefits = [
    { title: 'Competitive Salary', desc: 'Market-leading pay with performance bonuses' },
    { title: 'Health Insurance', desc: 'Full medical coverage for you and dependents' },
    { title: 'Training & Certification', desc: 'Sponsored brand certification programmes' },
    { title: 'Visa & Accommodation', desc: 'UAE visa sponsorship and housing support' },
    { title: 'Career Growth', desc: 'Clear progression paths within the company' },
    { title: 'Modern Facilities', desc: 'State-of-the-art workshop in Musaffah M9' },
]

export default function CareersPage() {
    return (
        <main className="min-h-screen bg-[#FAFAF9]">
            <JsonLd data={breadcrumbSchema} />
            <Navbar />

            {/* Hero */}
            <section className="pt-40 pb-20 relative overflow-hidden bg-[#121212] text-white">
                <div className="absolute inset-0 micro-noise opacity-10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#E62329]/5 blur-[120px] rounded-full pointer-events-none" />
                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                    <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.5em] mb-6 block">
                        Join The Team
                    </span>
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.85] italic mb-8">
                        BUILD YOUR<br />
                        <span className="text-gray-500">CAREER WITH US</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-2xl font-medium leading-relaxed mb-10">
                        Smart Motor is Abu Dhabi's most trusted automotive workshop, est. 2009. We are always looking for passionate, skilled professionals to grow with us.
                    </p>
                    <a
                        href="mailto:service@smartmotor.ae?subject=Career Inquiry"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-[#E62329] text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#c91d23] transition-all"
                    >
                        Send Your CV
                    </a>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-24 max-w-7xl mx-auto px-6 md:px-12">
                <div className="text-center mb-16">
                    <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Why Smart Motor</span>
                    <h2 className="text-4xl md:text-5xl font-black text-[#121212] uppercase tracking-tighter italic">
                        What We Offer
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {benefits.map((b) => (
                        <div key={b.title} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                            <h3 className="font-black text-[#121212] uppercase tracking-tight mb-2 text-sm">{b.title}</h3>
                            <p className="text-gray-500 text-sm font-medium">{b.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Open Positions */}
            <section className="py-12 max-w-7xl mx-auto px-6 md:px-12">
                <div className="text-center mb-16">
                    <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">We&apos;re Hiring</span>
                    <h2 className="text-4xl md:text-5xl font-black text-[#121212] uppercase tracking-tighter italic">
                        Open Positions
                    </h2>
                </div>
                <div className="space-y-6">
                    {openPositions.map((pos) => (
                        <div key={pos.title} className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all">
                            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="text-xl font-black text-[#121212] uppercase tracking-tight italic">{pos.title}</h3>
                                    <div className="flex gap-3 mt-2">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 px-3 py-1 rounded-full">{pos.department}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-[#E62329] bg-[#E62329]/10 px-3 py-1 rounded-full">{pos.type}</span>
                                    </div>
                                </div>
                                <a
                                    href={`mailto:service@smartmotor.ae?subject=Application: ${pos.title}`}
                                    className="px-6 py-3 bg-[#121212] text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#E62329] transition-all whitespace-nowrap"
                                >
                                    Apply Now
                                </a>
                            </div>
                            <p className="text-gray-500 text-sm font-medium mb-4">{pos.description}</p>
                            <ul className="flex flex-wrap gap-2">
                                {pos.requirements.map((req) => (
                                    <li key={req} className="text-[10px] font-bold uppercase tracking-wide text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full">
                                        {req}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Apply CTA */}
            <section className="py-24 bg-[#121212] mx-6 md:mx-12 rounded-[3rem] mb-24 text-center">
                <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter italic mb-6">
                    Don&apos;t see your role?
                </h2>
                <p className="text-gray-400 mb-10 font-medium max-w-xl mx-auto">
                    We are always open to talented automotive professionals. Send us your CV and we will be in touch when the right opportunity arises.
                </p>
                <a
                    href="mailto:service@smartmotor.ae?subject=General Application – Smart Motor"
                    className="px-8 py-4 bg-[#E62329] text-white rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#c91d23] transition-all"
                >
                    Send Your CV → service@smartmotor.ae
                </a>
            </section>

            <Footer />
        </main>
    )
}
