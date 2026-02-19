import type { Metadata } from 'next'
import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'
import { adminGetAllBrands, adminGetAllServices } from '@/lib/firebase-admin'
import { notFound } from 'next/navigation'
import { Shield, Wrench, ChevronRight, Star, MapPin, Phone, CheckCircle, Zap, Award, Clock } from 'lucide-react'
import Link from 'next/link'

// ─── Brand-specific copy ──────────────────────────────────────────────────────
const BRAND_DATA: Record<string, {
    tagline: string
    quote: string
    quoteAuthor: string
    description: string
    heritage: string
    latestModels: string[]
    accentColor: string
}> = {
    bmw: {
        tagline: 'The Ultimate Driving Machine',
        quote: 'Precision engineering deserves precision care.',
        quoteAuthor: 'Smart Motor Master Technician',
        description: 'BMW\'s philosophy of driving pleasure meets our commitment to factory-level excellence. Every BMW carries generations of Bavarian engineering — we honour that legacy with certified diagnostics and OEM parts.',
        heritage: 'Founded in 1916, BMW has defined the intersection of luxury and performance. From the iconic M series to the electric i range, we service every chapter of this legendary story.',
        latestModels: ['M3 Competition', 'X5 M60i', '7 Series', 'iX M60', 'M4 CSL', '3 Series'],
        accentColor: '#1C69D4',
    },
    mercedes: {
        tagline: 'The Best or Nothing',
        quote: 'Engineering perfection leaves no room for compromise.',
        quoteAuthor: 'Smart Motor Senior Diagnostics Lead',
        description: 'Mercedes-Benz sets the benchmark for automotive luxury. Our XENTRY-equipped diagnostics and factory-trained specialists ensure your AMG, S-Class or EQ receives nothing less than the care it was built for.',
        heritage: 'Over 130 years of innovation — from the first automobile ever built to the latest hypercar AMG ONE. We treat every Mercedes as the landmark it is.',
        latestModels: ['S-Class', 'AMG G63', 'EQS 580', 'C43 AMG', 'GLE 63 S', 'Maybach S680'],
        accentColor: '#C0A060',
    },
    porsche: {
        tagline: 'There is no substitute.',
        quote: 'A Porsche is not merely driven — it is experienced.',
        quoteAuthor: 'Smart Motor Porsche Specialist',
        description: 'Porsche\'s pursuit of perfection demands a workshop that matches its standards. Our PIWIS-certified technicians and genuine parts network keep your 911, Cayenne or Taycan performing exactly as Zuffenhausen intended.',
        heritage: 'Since 1948, Porsche has proven that sports cars and practicality are not mutually exclusive. 75+ years of motorsport DNA flows through every vehicle — we protect every bit of it.',
        latestModels: ['911 GT3 RS', 'Cayenne Turbo E-Hybrid', 'Taycan Turbo S', 'Macan EV', 'Panamera 4S', '718 Spyder RS'],
        accentColor: '#E62329',
    },
    'range-rover': {
        tagline: 'Above and Beyond',
        quote: 'True luxury travels anywhere it pleases.',
        quoteAuthor: 'Smart Motor 4x4 Specialist',
        description: 'Land Rover and Range Rover demand specialist knowledge that combines luxury refinement with off-road engineering. Our Terrain Response-certified technicians keep your vehicle ready for both the boardroom and the dunes.',
        heritage: 'Born in the Solihull countryside, Range Rover has defined luxury SUVs for over 50 years. In Abu Dhabi\'s terrain, there is no more natural companion.',
        latestModels: ['Range Rover SV', 'Defender 130', 'Range Rover Sport', 'Discovery', 'Defender 90', 'Velar'],
        accentColor: '#2D6A4F',
    },
    toyota: {
        tagline: 'Let\'s Go Places',
        quote: 'Reliability isn\'t luck — it\'s the result of exceptional care.',
        quoteAuthor: 'Smart Motor Toyota Specialist',
        description: 'Toyota\'s legendary reliability is earned through precise engineering and meticulous maintenance. Our Toyota-trained technicians use genuine parts and manufacturer-specified procedures to keep that reliability unbroken.',
        heritage: 'For decades, Toyota has been the backbone of UAE roads. From the Land Cruiser\'s desert dominance to the Camry\'s urban elegance, we know every variant inside out.',
        latestModels: ['Land Cruiser 300', 'Camry XSE', 'GR86', 'RAV4 Hybrid', 'Tundra TRD', 'Sequoia'],
        accentColor: '#EB0A1E',
    },
    nissan: {
        tagline: 'Innovation That Excites',
        quote: 'Performance is built in the workshop as much as the factory.',
        quoteAuthor: 'Smart Motor Nissan Technician',
        description: 'From the iconic Patrol to the thrilling GT-R, Nissan builds vehicles that excite. Our Nissan-certified service keeps every model at peak performance — whether you\'re crossing the Empty Quarter or the city grid.',
        heritage: 'Nissan\'s deep roots in the UAE market mean we have seen every generation of Patrol, Sunny and Altima. That institutional knowledge is your advantage.',
        latestModels: ['Patrol Platinum', 'GT-R Nismo', 'Altima SR', 'X-Trail', 'Armada', 'Ariya EV'],
        accentColor: '#C3002F',
    },
    audi: {
        tagline: 'Vorsprung durch Technik',
        quote: 'Advancement through technology — and through expert hands.',
        quoteAuthor: 'Smart Motor Audi Certified Technician',
        description: 'Audi\'s Vorsprung durch Technik philosophy lives in every MMI screen, Quattro drivetrain and TFSi engine. Our ODIS-equipped workshop speaks Audi\'s language fluently.',
        heritage: 'From the Auto Union Grand Prix heritage to today\'s RS and e-tron lineup, Audi has always balanced innovation with elegance. We safeguard that balance.',
        latestModels: ['RS6 Avant', 'e-tron GT RS', 'Q8 S-line', 'A8 L', 'RS3 Sportback', 'Q7 S-line'],
        accentColor: '#BB0A21',
    },
    lexus: {
        tagline: 'The Relentless Pursuit of Perfection',
        quote: 'When perfection is the standard, nothing less is acceptable.',
        quoteAuthor: 'Smart Motor Lexus Specialist',
        description: 'Lexus\'s Takumi craftsmanship tradition requires equally meticulous maintenance. Our Lexus specialists combine Japanese precision with Abu Dhabi\'s unique climate expertise.',
        heritage: 'Created to rival the world\'s finest luxury cars, Lexus has exceeded expectations for 35 years. In the UAE, its hybrid technology thrives under our specialist care.',
        latestModels: ['LX 600 F Sport', 'LS 500h', 'LC 500', 'RX 500h', 'NX 350h', 'ES 300h'],
        accentColor: '#8B0000',
    },
    lamborghini: {
        tagline: 'Expect the Unexpected',
        quote: 'Italian fury demands Italian-level precision in its servicing.',
        quoteAuthor: 'Smart Motor Supercar Specialist',
        description: 'Lamborghini\'s naturally aspirated fury and precision aerodynamics demand the most specialised workshop expertise. Our supercar team treats every Huracán and Urus with the reverence a raging bull deserves.',
        heritage: 'Born from a feud and forged in Sant\'Agata Bolognese, Lamborghini defines automotive drama. We ensure the drama stays where it belongs — on the road, never in the workshop.',
        latestModels: ['Revuelto', 'Urus S', 'Huracan Sterrato', 'Urus Performante', 'Huracan Tecnica'],
        accentColor: '#FFD700',
    },
}

function getBrandData(slug: string, brandName: string) {
    return BRAND_DATA[slug.toLowerCase()] || {
        tagline: 'Engineered for Excellence',
        quote: 'Every great vehicle deserves expert care.',
        quoteAuthor: 'Smart Motor Team',
        description: `${brandName} vehicles represent outstanding engineering. Our certified technicians deliver factory-quality service that keeps your vehicle at its best.`,
        heritage: `We have built deep expertise servicing ${brandName} vehicles across all models and generations, ensuring the highest standards of care for every visit.`,
        latestModels: [],
        accentColor: '#E62329',
    }
}

function normalizeLogo(raw: string | undefined): string {
    if (!raw) return '/branding/logo.png'
    if (raw.startsWith('http') || raw.startsWith('/')) return raw
    // Strip any accidental prefix before re-adding
    const bare = raw.replace(/^\/brands-carousel\//, '').replace(/^\/brands\//, '')
    return `/brands-carousel/${bare}`
}

function toSlug(str: string) {
    return str.toLowerCase().replace(/[\s_]+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function findBrand(allBrands: any[], slug: string) {
    return allBrands.find(b =>
        b.slug === slug ||
        b.id === slug ||
        toSlug(b.name) === slug ||
        toSlug(b.slug || '') === slug
    )
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const allBrands = await adminGetAllBrands()
    const brand = findBrand(allBrands, slug)
    const brandName = brand?.name ?? slug.charAt(0).toUpperCase() + slug.slice(1)
    const copy = getBrandData(slug, brandName)

    const title = `${brandName} Service & Repair Abu Dhabi | Smart Motor Auto Care`
    const description = `Certified ${brandName} service & repair in Abu Dhabi, Musaffah M9. ${copy.tagline}. Factory-trained technicians, genuine OEM parts, 12-month warranty. Trusted since 2009 — 4.9★ Google rated. Book online or call 800 SMART.`

    return {
        title,
        description,
        keywords: [
            `${brandName} service Abu Dhabi`,
            `${brandName} repair Abu Dhabi`,
            `${brandName} workshop Abu Dhabi`,
            `${brandName} maintenance Abu Dhabi`,
            `${brandName} specialist Abu Dhabi`,
            `${brandName} garage Musaffah`,
            `${brandName} oil change Abu Dhabi`,
            `${brandName} diagnostics Abu Dhabi`,
            'car service Abu Dhabi',
            'auto repair Musaffah',
            'Smart Motor Abu Dhabi',
        ].join(', '),
        openGraph: {
            title: `${brandName} Service Abu Dhabi | Smart Motor — ${copy.tagline}`,
            description,
            url: `https://smartmotor.ae/brand/${slug}`,
            type: 'website',
            siteName: 'Smart Motor Auto Care',
            images: [{ url: 'https://smartmotor.ae/branding/og-image.jpg', width: 1200, height: 630, alt: `${brandName} Service Abu Dhabi — Smart Motor` }],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
        },
        alternates: {
            canonical: `https://smartmotor.ae/brand/${slug}`,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true, 'max-snippet': -1, 'max-image-preview': 'large' },
        },
    }
}

export default async function BrandPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const allBrands = await adminGetAllBrands()
    const brand = findBrand(allBrands, slug)

    if (!brand) notFound()

    const copy = getBrandData(slug, brand.name)
    const logoSrc = normalizeLogo(brand.logoUrl || brand.logoFile)

    // Load all services — filter to those tagged for this brand or show all
    const allServices = await adminGetAllServices()
    const brandServices = brand.serviceIds?.length
        ? allServices.filter(s => brand.serviceIds?.includes(s.slug))
        : allServices.slice(0, 8)

    const models = copy.latestModels.length
        ? copy.latestModels
        : (brand.models ? brand.models.split(',').map((m: string) => m.trim()).filter(Boolean) : (brand.description ? brand.description.split(',').map((m: string) => m.trim()).filter(Boolean) : []))

    const stats = [
        { value: '15+', label: 'Years Experience' },
        { value: '50+', label: 'Certified Technicians' },
        { value: '12-Mo', label: 'Service Warranty' },
        { value: '4.9★', label: 'Google Rating' },
    ]

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'AutoRepair',
            name: 'Smart Motor Auto Care',
            url: `https://smartmotor.ae/brand/${slug}`,
            description: `Certified ${brand.name} service and repair in Abu Dhabi. ${copy.tagline}.`,
            telephone: '+97180076278',
            priceRange: '$$',
            address: { '@type': 'PostalAddress', streetAddress: 'M9, Musaffah Industrial Area', addressLocality: 'Abu Dhabi', addressCountry: 'AE' },
            geo: { '@type': 'GeoCoordinates', latitude: '24.3639', longitude: '54.4769' },
            openingHoursSpecification: [
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Saturday'], opens: '08:00', closes: '20:00' },
                { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday'], opens: '14:00', closes: '20:00' },
            ],
            aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.9', reviewCount: '500', bestRating: '5' },
            brand: { '@type': 'Brand', name: brand.name },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://smartmotor.ae' },
                { '@type': 'ListItem', position: 2, name: `${brand.name} Service`, item: `https://smartmotor.ae/brand/${slug}` },
            ],
        },
        {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: [
                { '@type': 'Question', name: `Do you service ${brand.name} vehicles in Abu Dhabi?`, acceptedAnswer: { '@type': 'Answer', text: `Yes, Smart Motor is a certified ${brand.name} specialist in Abu Dhabi, Musaffah M9. Factory-trained technicians, genuine OEM parts, 12-month warranty.` } },
                { '@type': 'Question', name: `How much does ${brand.name} servicing cost in Abu Dhabi?`, acceptedAnswer: { '@type': 'Answer', text: `${brand.name} service costs vary by model and type. Smart Motor offers transparent pricing. Call 800 SMART (800 76278) for a free quote.` } },
                { '@type': 'Question', name: `Does Smart Motor use genuine ${brand.name} parts?`, acceptedAnswer: { '@type': 'Answer', text: `Yes, only genuine OEM ${brand.name} parts, all backed by our 12-month warranty on parts and labour.` } },
            ],
        },
    ]

    return (
        <main className="min-h-screen bg-[#FAFAF9]">
            <Navbar />

            {/* ── Hero ───────────────────────────────────────────────────────── */}
            <section className="relative pt-40 pb-32 overflow-hidden bg-[#0A0A0A]">
                {/* Glow blobs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full blur-[160px] opacity-20" style={{ background: copy.accentColor }} />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#E62329]/10 blur-[120px]" />
                    <div className="absolute inset-0 micro-noise opacity-5" />
                </div>

                <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center lg:items-end gap-12 lg:gap-20">

                        {/* Logo showcase */}
                        <div className="flex-shrink-0">
                            <div className="w-52 h-52 md:w-72 md:h-72 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 flex items-center justify-center p-10 shadow-[0_0_120px_rgba(255,255,255,0.04)] relative group">
                                <div className="absolute inset-0 rounded-[3rem] border border-white/5 group-hover:border-white/15 transition-colors duration-700" />
                                <img
                                    src={logoSrc}
                                    alt={brand.name}
                                    className="w-full h-full object-contain filter brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-700"
                                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.filter = 'none' }}
                                />
                            </div>
                        </div>

                        {/* Brand heading */}
                        <div className="flex-1 text-center lg:text-left">
                            <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">
                                Certified Service Partner
                            </span>
                            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase italic leading-[0.85] text-white mb-4">
                                {brand.name}
                            </h1>
                            <p className="text-xl md:text-2xl font-black uppercase tracking-wider mb-8" style={{ color: copy.accentColor }}>
                                {copy.tagline}
                            </p>
                            <blockquote className="border-l-2 pl-6 mb-10" style={{ borderColor: copy.accentColor }}>
                                <p className="text-white/70 text-lg font-medium italic leading-relaxed">
                                    &ldquo;{copy.quote}&rdquo;
                                </p>
                                <cite className="text-white/30 text-[10px] font-black uppercase tracking-widest not-italic mt-2 block">
                                    — {copy.quoteAuthor}
                                </cite>
                            </blockquote>
                            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                                <Link
                                    href="/#booking"
                                    className="inline-flex items-center gap-2 bg-[#E62329] text-white rounded-full px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500 shadow-2xl"
                                >
                                    Book {brand.name} Service
                                    <ChevronRight size={14} />
                                </Link>
                                <a
                                    href="tel:+97125555443"
                                    className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white rounded-full px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all duration-500"
                                >
                                    <Phone size={14} />
                                    Call Now
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 pt-16 border-t border-white/5">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-3xl md:text-4xl font-black text-white tracking-tighter italic">{stat.value}</p>
                                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Brand Story ────────────────────────────────────────────────── */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Brand Heritage</span>
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-[0.9] text-[#121212] mb-6">
                                The {brand.name} <span className="silver-shine">Story</span>
                            </h2>
                            <p className="text-gray-600 text-base leading-relaxed mb-6">{copy.heritage}</p>
                            <p className="text-gray-500 text-sm leading-relaxed">{copy.description}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: Award, title: 'Factory Certified', desc: 'Brand-specific training & tooling' },
                                { icon: Wrench, title: 'OEM Parts Only', desc: 'Genuine manufacturer components' },
                                { icon: Zap, title: 'Advanced Diagnostics', desc: 'Brand-specific diagnostic systems' },
                                { icon: Clock, title: '12-Month Warranty', desc: 'On all parts and labour' },
                            ].map((item) => {
                                const Icon = item.icon
                                return (
                                    <div key={item.title} className="bg-[#FAFAF9] rounded-[2rem] p-6 border border-gray-100 hover:border-[#E62329]/30 hover:shadow-lg transition-all duration-500 group">
                                        <div className="w-10 h-10 bg-[#E62329]/10 rounded-xl flex items-center justify-center text-[#E62329] mb-4 group-hover:bg-[#E62329] group-hover:text-white transition-colors duration-500">
                                            <Icon size={18} />
                                        </div>
                                        <h4 className="font-black text-[#121212] text-sm uppercase tracking-tighter mb-1">{item.title}</h4>
                                        <p className="text-xs text-gray-400 font-medium">{item.desc}</p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Latest Models ──────────────────────────────────────────────── */}
            {models.length > 0 && (
                <section className="py-24 bg-[#FAFAF9]">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">Models We Service</span>
                        <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-[0.9] text-[#121212] mb-10">
                            Latest <span className="silver-shine">Lineup</span>
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            {models.map((model: string) => (
                                <div
                                    key={model}
                                    className="group flex items-center gap-2 px-6 py-3 bg-white rounded-full border border-gray-100 shadow-sm hover:border-[#E62329] hover:shadow-md transition-all duration-300 cursor-default"
                                >
                                    <CheckCircle size={12} className="text-[#E62329] flex-shrink-0" />
                                    <span className="text-xs font-black uppercase tracking-widest text-[#121212] group-hover:text-[#E62329] transition-colors">{model}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Services for this brand ────────────────────────────────────── */}
            {brandServices.length > 0 && (
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-6 md:px-12">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div>
                                <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">What We Do</span>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase italic leading-[0.9] text-[#121212]">
                                    {brand.name} <span className="silver-shine">Services</span>
                                </h2>
                            </div>
                            <Link
                                href="/#booking"
                                className="shrink-0 inline-flex items-center gap-2 bg-black text-white rounded-full px-8 py-4 text-xs font-black uppercase tracking-widest hover:bg-[#E62329] transition-all"
                            >
                                Book Now <ChevronRight size={14} />
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {brandServices.map((service) => (
                                <Link
                                    key={service.id}
                                    href={`/services/${service.slug}`}
                                    className="group bg-[#FAFAF9] hover:bg-white rounded-[2rem] border border-gray-100 hover:border-[#E62329]/30 hover:shadow-xl p-8 flex flex-col gap-4 transition-all duration-500"
                                >
                                    <div className="w-12 h-12 bg-[#121212] rounded-2xl flex items-center justify-center text-white group-hover:bg-[#E62329] transition-colors duration-500">
                                        <Wrench size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-black text-[#121212] uppercase tracking-tighter text-base mb-2 group-hover:text-[#E62329] transition-colors">{service.name}</h4>
                                        <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{service.description}</p>
                                    </div>
                                    {service.duration && (
                                        <span className="text-[9px] font-black text-[#E62329] bg-[#E62329]/10 px-3 py-1 rounded-full uppercase tracking-widest self-start">
                                            {service.duration}
                                        </span>
                                    )}
                                    <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 group-hover:text-[#E62329] transition-colors uppercase tracking-widest">
                                        Learn More <ChevronRight size={12} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── CTA strip ─────────────────────────────────────────────────── */}
            <section className="py-24 bg-[#121212]">
                <div className="max-w-7xl mx-auto px-6 md:px-12 text-center relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[100px] opacity-20" style={{ background: copy.accentColor }} />
                    <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block relative z-10">Abu Dhabi's Trusted {brand.name} Specialist</span>
                    <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.85] text-white mb-6 relative z-10">
                        Your {brand.name} <br /><span className="silver-shine">Deserves Better</span>
                    </h2>
                    <p className="text-white/50 text-lg max-w-xl mx-auto mb-10 relative z-10">
                        Visit us at M9, Musaffah Industrial Area — Abu Dhabi's home of precision automotive care.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
                        <Link
                            href="/#booking"
                            className="inline-flex items-center gap-2 bg-[#E62329] text-white rounded-full px-10 py-5 text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-500 shadow-2xl"
                        >
                            Book a Service
                        </Link>
                        <a
                            href="https://maps.app.goo.gl/M9Musaffah"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white rounded-full px-10 py-5 text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                            <MapPin size={14} />
                            Get Directions
                        </a>
                    </div>
                </div>
            </section>

            {/* ── Reviews snippet ───────────────────────────────────────────── */}
            <section className="py-20 bg-[#FAFAF9]">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { text: `My ${brand.name} runs better than when I bought it. These guys know every bolt.`, name: 'Ahmed K.', model: models[0] || brand.name },
                            { text: `Finally found a workshop that truly understands ${brand.name} engineering. Worth every dirham.`, name: 'Sarah M.', model: models[1] || brand.name },
                            { text: `Transparent pricing, fast turnaround, genuine parts. Won't take my ${brand.name} anywhere else.`, name: 'Omar R.', model: models[2] || brand.name },
                        ].map((review, i) => (
                            <div key={i} className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm">
                                <div className="flex gap-1 mb-4">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} size={14} className="fill-[#FFCC00] text-[#FFCC00]" />
                                    ))}
                                </div>
                                <p className="text-sm text-gray-600 font-medium leading-relaxed mb-6 italic">&ldquo;{review.text}&rdquo;</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#E62329]/10 rounded-full flex items-center justify-center">
                                        <span className="text-[10px] font-black text-[#E62329]">{review.name[0]}</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-[#121212]">{review.name}</p>
                                        <p className="text-[9px] text-gray-400 font-bold">{review.model} Owner</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        </main>
    )
}
