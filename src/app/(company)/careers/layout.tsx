import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Careers – Join Our Team | Smart Motor Auto Repair Abu Dhabi',
    description: "Join Abu Dhabi's premier automotive workshop. We're hiring certified technicians, service advisors, detailers & more at Smart Motor Musaffah. Competitive salary + UAE visa.",
    openGraph: {
        title: 'Careers at Smart Motor Auto Repair Abu Dhabi',
        description: "Build your automotive career with Abu Dhabi's most trusted workshop. View open positions at Smart Motor Musaffah.",
        url: 'https://smartmotor.ae/careers',
    },
    alternates: {
        canonical: 'https://smartmotor.ae/careers',
    },
}

export default function CareersLayout({ children }: { children: React.ReactNode }) {
    return children
}
