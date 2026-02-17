'use client'

import Link from 'next/link'
import {
    PhoneIcon,
    MapPinIcon,
    ClockIcon,
    InstagramIcon,
    WhatsAppIcon,
    FacebookIcon,
    TikTokIcon,
    ThreadsIcon
} from '@/components/ui/icons'
import { publicPath } from '@/lib/utils'
import { VisaIcon, MastercardIcon, ApplePayIcon } from '@/components/ui/payment-icons'
import { Tooltip } from '@/components/ui/tooltip'

const services = [
    'Mechanical Services',
    'Electrical Services',
    'Body Shop',
    'Paint & Protection',
    'Ceramic Coating',
    'Window Tinting',
    'Detailing'
]

const quickLinks = [
    { label: 'Home', href: '/new-home' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact', href: '/contact' },
]

export function Footer() {
    return (
        <footer id="contact" className="relative bg-black text-white pt-32 pb-12 rounded-t-[4rem] overflow-hidden">
            {/* Background Polish */}
            <div className="absolute inset-0 micro-noise opacity-10 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E62329]/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24 pt-12">

                    {/* Column 1: About */}
                    <div>
                        <Link href="/new-home" className="inline-block mb-8">
                            <img
                                src={publicPath("/branding/logo.png")}
                                alt="Smart Motor"
                                className="h-20 w-auto object-contain"
                            />
                        </Link>
                        <p className="text-gray-400 font-medium leading-relaxed mb-8 text-sm">
                            Smart Motor Auto Repair is a professional automotive service center dedicated to delivering top-notch solutions for all your vehicle needs.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <Tooltip content="Instagram" position="top">
                                <a href="https://instagram.com/smartmotor_autorepair" className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all">
                                    <InstagramIcon size={16} />
                                </a>
                            </Tooltip>
                            <Tooltip content="WhatsApp" position="top">
                                <a href="https://wa.me/97125555443" className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all">
                                    <WhatsAppIcon size={16} />
                                </a>
                            </Tooltip>
                            <Tooltip content="Facebook" position="top">
                                <a href="#" className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all">
                                    <FacebookIcon size={16} />
                                </a>
                            </Tooltip>
                            <Tooltip content="TikTok" position="top">
                                <a href="#" className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all">
                                    <TikTokIcon size={16} />
                                </a>
                            </Tooltip>
                            <Tooltip content="Threads" position="top">
                                <a href="#" className="w-9 h-9 flex items-center justify-center bg-white/5 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all">
                                    <ThreadsIcon size={16} />
                                </a>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Quick Links</h3>
                        <ul className="space-y-4">
                            {quickLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-gray-400 font-bold hover:text-white transition-colors text-sm uppercase tracking-wide">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Services */}
                    <div>
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Our Services</h3>
                        <ul className="space-y-4">
                            {services.map((service) => (
                                <li key={service}>
                                    <Link href="/services" className="text-gray-400 font-bold hover:text-white transition-colors text-sm uppercase tracking-wide">
                                        {service}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Contact Us</h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <Tooltip content="Visit us in Musaffah" position="left">
                                    <MapPinIcon size={18} className="text-[#E62329] flex-shrink-0" />
                                </Tooltip>
                                <span className="text-gray-400 font-medium text-sm leading-relaxed">
                                    M9, Musaffah Industrial Area,<br />
                                    Abu Dhabi, UAE
                                </span>
                            </li>
                            <li className="flex items-center gap-4">
                                <Tooltip content="Call us now" position="left">
                                    <PhoneIcon size={18} className="text-[#E62329] flex-shrink-0" />
                                </Tooltip>
                                <a href="tel:+97125555443" className="text-gray-400 font-bold hover:text-white transition-colors text-sm">
                                    +971 2 555 5443
                                </a>
                            </li>
                            <li className="flex items-center gap-4">
                                <Tooltip content="Working hours" position="left">
                                    <ClockIcon size={18} className="text-[#E62329] flex-shrink-0" />
                                </Tooltip>
                                <span className="text-gray-400 font-medium text-sm">
                                    Daily: 08:00 AM - 07:00 PM
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex flex-col gap-4">
                        <p className="text-gray-600 text-xs font-bold tracking-widest uppercase">
                            &copy; 2026 SMART MOTOR AUTO REPAIR.
                        </p>
                        <div className="flex gap-4 opacity-50">
                            <Tooltip content="Visa accepted" position="top"><span><VisaIcon /></span></Tooltip>
                            <Tooltip content="Mastercard accepted" position="top"><span><MastercardIcon /></span></Tooltip>
                            <Tooltip content="Apple Pay accepted" position="top"><span><ApplePayIcon /></span></Tooltip>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-gray-600">
                            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                        </div>
                        <p className="text-[8px] text-gray-700 leading-relaxed">
                            This site is protected by reCAPTCHA and the Google
                            <a href="https://policies.google.com/privacy" className="hover:text-white transition-colors"> Privacy Policy</a> and
                            <a href="https://policies.google.com/terms" className="hover:text-white transition-colors"> Terms of Service</a> apply.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
