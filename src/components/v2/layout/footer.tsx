'use client'

import Link from 'next/link'
import {
    PhoneIcon,
    MapPinIcon,
    ClockIcon,
    InstagramIcon,
    WhatsAppIcon
} from '@/components/ui/icons'
import { publicPath } from '@/lib/utils'
// Assuming these exist in generic location
import { VisaIcon, MastercardIcon, ApplePayIcon, GooglePayIcon, AmexIcon } from '@/components/ui/payment-icons'
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
    { label: 'About Us', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Brands', href: '#brands' },
    { label: 'Packages', href: '#packages' },
    { label: 'Contact', href: '#contact' },
]

export function Footer() {
    return (
        <footer id="contact" className="relative bg-black text-white pt-32 pb-12 rounded-t-[4rem] overflow-hidden">
            {/* Background Polish */}
            <div className="absolute inset-0 micro-noise opacity-10 pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E62329]/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                {/* Newsletter Section */}
                <div className="bg-[#121212] border border-white/10 rounded-[3rem] p-12 mb-24 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#E62329]/10 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                        <div>
                            <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">Join Our Exclusive Club</h3>
                            <p className="text-gray-400 text-lg">Subscribe for exclusive offers, maintenance tips, and VIP event invitations.</p>
                        </div>
                        <form className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-grow bg-white/5 border border-white/10 rounded-full px-8 py-5 text-white placeholder:text-gray-600 focus:outline-none focus:border-[#E62329] transition-colors"
                            />
                            <button className="bg-[#E62329] text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-xs hover:bg-white hover:text-[#E62329] transition-all">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">

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
                        <div className="flex gap-4">
                            <Tooltip content="Follow us on Instagram" position="top">
                                <a href="https://instagram.com/smartmotor_autorepair" className="w-10 h-10 flex items-center justify-center bg-gray-900 rounded-full hover:bg-white hover:text-black transition-all">
                                    <InstagramIcon size={18} />
                                </a>
                            </Tooltip>
                            <Tooltip content="Chat on WhatsApp" position="top">
                                <a href="https://wa.me/97126666789" className="w-10 h-10 flex items-center justify-center bg-gray-900 rounded-full hover:bg-white hover:text-black transition-all">
                                    <WhatsAppIcon size={18} />
                                </a>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-8">Quick Links</h3>
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
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-8">Our Services</h3>
                        <ul className="space-y-4">
                            {services.map((service) => (
                                <li key={service}>
                                    <Link href="#services" className="text-gray-400 font-bold hover:text-white transition-colors text-sm uppercase tracking-wide">
                                        {service}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-8">Contact Us</h3>
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
                                <a href="tel:+97126666789" className="text-gray-400 font-bold hover:text-white transition-colors text-sm">
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
                    <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-gray-600">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
