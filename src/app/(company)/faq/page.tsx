import type { Metadata } from 'next'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { faqs } from '@/lib/data'
import { HelpCircleIcon, MessageCircleIcon, PhoneIcon } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
    title: 'Frequently Asked Questions | Smart Motor',
    description: 'Find answers to common questions about our luxury car services, pricing, warranty, and booking process.',
}

export default function FAQPage() {
    return (
        <div className="min-h-screen bg-[#FAFAF9] pt-32 pb-24">
            {/* Header */}
            <div className="container max-w-4xl mx-auto px-6 mb-16 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E62329]/10 text-[#E62329] text-[10px] font-black uppercase tracking-widest mb-6">
                    <HelpCircleIcon size={14} />
                    <span>Support Center</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-[#121212] mb-6">
                    Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E62329] to-[#E62329]/70">Questions</span>
                </h1>
                <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                    Everything you need to know about our premium services, from booking appointments to warranty coverage.
                </p>
            </div>

            {/* FAQ Accordion */}
            <div className="container max-w-3xl mx-auto px-6">
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {faqs.map((faq, index) => (
                            <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-100 last:border-0 px-2">
                                <AccordionTrigger className="text-left font-bold text-[#121212] hover:text-[#E62329] text-base md:text-lg py-6 hover:no-underline transition-colors">
                                    {faq.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-500 leading-relaxed text-base pb-6">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </div>

            {/* Contact CTA */}
            <div className="container max-w-4xl mx-auto px-6 mt-24">
                <div className="bg-[#121212] rounded-[2.5rem] p-12 relative overflow-hidden text-center">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#E62329]/10 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />

                    <div className="relative z-10 flex flex-col items-center">
                        <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4">
                            Still have questions?
                        </h3>
                        <p className="text-gray-400 mb-8 max-w-lg">
                            Our expert advisors are ready to help you with any specific inquiries about your vehicle.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link href="/new-home#contact" className="inline-flex items-center gap-2 bg-[#E62329] text-white px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white hover:text-[#E62329] transition-all">
                                <MessageCircleIcon size={16} />
                                Contact Support
                            </Link>
                            <a href="tel:80076278" className="inline-flex items-center gap-2 bg-white/10 text-white border border-white/10 px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white hover:text-[#121212] transition-all">
                                <PhoneIcon size={16} />
                                800 SMART
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
