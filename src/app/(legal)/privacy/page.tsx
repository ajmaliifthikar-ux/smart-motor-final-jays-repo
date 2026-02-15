import type { Metadata } from 'next'
import { LockIcon } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Privacy Policy | Smart Motor',
    description: 'How we collect, use, and protect your personal information.',
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[#FAFAF9] pt-32 pb-24">
            <div className="container max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E62329]/10 text-[#E62329] text-[10px] font-black uppercase tracking-widest mb-6">
                        <LockIcon size={14} />
                        <span>Legal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#121212] mb-6">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        Last updated: February 13, 2026
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 prose prose-lg max-w-none prose-headings:font-bold prose-headings:uppercase prose-a:text-[#E62329]">
                    <h3>1. Information We Collect</h3>
                    <p>
                        We collect information you provide directly to us, such as your name, phone number, email address, and vehicle details when you book an appointment, request a quote, or sign up for our newsletter.
                    </p>

                    <h3>2. How We Use Your Information</h3>
                    <p>
                        We use the information we collect to:
                        <ul>
                            <li>Process your bookings and payments.</li>
                            <li>Communicate with you about your service status.</li>
                            <li>Send you technical updates about your vehicle (e.g., service reminders).</li>
                            <li>Improve our services and website experience.</li>
                        </ul>
                    </p>

                    <h3>3. Data Sharing</h3>
                    <p>
                        We do not sell your personal data. We may share your information with trusted third-party service providers (e.g., payment processors, parts suppliers) strictly for the purpose of fulfilling our service obligations to you.
                    </p>

                    <h3>4. Data Security</h3>
                    <p>
                        We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
                    </p>

                    <h3>5. Cookies</h3>
                    <p>
                        Our website uses cookies to enhance your browsing experience and analyze site traffic. You can control cookie preferences through your browser settings.
                    </p>

                    <h3>6. Contact Us</h3>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@smartmotor.ae">privacy@smartmotor.ae</a> or call us at 800 SMART.
                    </p>
                </div>
            </div>
        </div>
    )
}
