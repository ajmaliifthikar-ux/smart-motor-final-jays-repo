import type { Metadata } from 'next'
import { ShieldCheckIcon } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Terms of Service | Smart Motor',
    description: 'Terms and conditions for using Smart Motor services and website.',
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[#FAFAF9] pt-32 pb-24">
            <div className="container max-w-4xl mx-auto px-6">
                {/* Header */}
                <div className="mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E62329]/10 text-[#E62329] text-[10px] font-black uppercase tracking-widest mb-6">
                        <ShieldCheckIcon size={14} />
                        <span>Legal</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#121212] mb-6">
                        Terms of Service
                    </h1>
                    <p className="text-gray-500 text-lg leading-relaxed">
                        Last updated: February 13, 2026
                    </p>
                </div>

                {/* Content */}
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 prose prose-lg max-w-none prose-headings:font-bold prose-headings:uppercase prose-a:text-[#E62329]">
                    <h3>1. Service Agreement</h3>
                    <p>
                        By booking a service with Smart Motor Auto Repair ("we", "us", or "our"), you agree to the terms outlined herein. We reserve the right to refuse service to anyone for any reason at any time.
                    </p>

                    <h3>2. Estimates and Authorization</h3>
                    <p>
                        All cost estimates for labor and parts are preliminary. If additional work is required beyond the initial estimate, we will contact you for authorization before proceeding. We are not responsible for delays caused by parts unavailability.
                    </p>

                    <h3>3. Payment Terms</h3>
                    <p>
                        Payment is due in full upon completion of services. We accept cash, major credit cards, and approved financing options (Tabby). Vehicles will not be released until payment is received.
                    </p>

                    <h3>4. Warranty</h3>
                    <p>
                        We offer a warranty on labor for 30 days or 1,000 km, whichever comes first. Parts are subject to the manufacturer's warranty terms. This warranty does not cover issues unrelated to the specific service performed.
                    </p>

                    <h3>5. Liability</h3>
                    <p>
                        While we take every precaution to safeguard your vehicle, we are not responsible for loss or damage to your vehicle or articles left in the vehicle in case of fire, theft, accident, or any other cause beyond our control.
                    </p>

                    <h3>6. Vehicle Storage</h3>
                    <p>
                        Vehicles left for more than 48 hours after service completion notification may be subject to a daily storage fee of AED 50, unless prior arrangements have been made.
                    </p>

                    <h3>7. Changes to Terms</h3>
                    <p>
                        We adhere to UAE consumer protection laws. We reserve the right to update these terms at any time. Continued use of our services constitutes acceptance of the new terms.
                    </p>
                </div>
            </div>
        </div>
    )
}
