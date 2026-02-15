'use client'

import Link from 'next/link'
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  ClockIcon,
  InstagramIcon,
  FacebookIcon,
  WhatsAppIcon
} from '@/components/ui/icons'
import { VisaIcon, MastercardIcon, ApplePayIcon, GooglePayIcon, AmexIcon } from '@/components/ui/payment-icons'

const services = [
  'Mechanical & Electrical',
  'Bodyshop & Accident Repair',
  'Paint Protection Film',
  'Ceramic Coating',
  'Window Tinting',
  'Detailing & Polishing',
  'Towing & Breakdown',
]

const quickLinks = [
  { label: 'About Us', href: '#about' },
  { label: 'Our Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
  { label: 'Careers', href: '#careers' },
]

export function Footer() {
  return (
    <footer className="relative bg-black text-white pt-32 pb-12 rounded-t-[4rem] overflow-hidden">
      {/* Background Polish */}
      <div className="absolute inset-0 micro-noise opacity-10 pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E62329]/5 blur-[120px] rounded-full -mr-64 -mt-64 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-8">
              <img
                src="/branding/logo.png"
                alt="Smart Motor"
                className="h-20 w-auto object-contain bg-white/5 rounded-2xl p-2 backdrop-blur-sm border border-white/10"
              />
            </Link>
            <p className="text-gray-400 font-medium leading-relaxed mb-8">
              Elite European car care in Abu Dhabi.
              Twenty years of specialized excellence in performance engineering.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/smartmotor_autorepair"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-gray-900 rounded-full hover:bg-white hover:text-black transition-all duration-300"
              >
                <InstagramIcon size={20} />
              </a>
              <a
                href="https://wa.me/97126666789"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 flex items-center justify-center bg-gray-900 rounded-full hover:bg-white hover:text-black transition-all duration-300"
              >
                <WhatsAppIcon size={20} />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-8">Specialties</h3>
            <ul className="space-y-4">
              {services.map((service) => (
                <li key={service}>
                  <Link
                    href="#services"
                    className="text-gray-400 font-bold hover:text-white transition-colors text-sm uppercase tracking-wide"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-8">Navigation</h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 font-bold hover:text-white transition-colors text-sm uppercase tracking-wide"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-8">HQ Contact</h3>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPinIcon size={18} className="text-cyan-400 flex-shrink-0" />
                <span className="text-gray-400 font-medium text-sm leading-relaxed">
                  Musaffah Industrial Area,<br />
                  Abu Dhabi, UAE
                </span>
              </li>
              <li className="flex items-center gap-4">
                <PhoneIcon size={18} className="text-cyan-400 flex-shrink-0" />
                <a
                  href="tel:+97126666789"
                  className="text-gray-400 font-bold hover:text-white transition-colors text-sm"
                >
                  +971 2 666 6789
                </a>
              </li>
              <li className="flex items-center gap-4">
                <ClockIcon size={18} className="text-cyan-400 flex-shrink-0" />
                <span className="text-gray-400 font-medium text-sm">
                  Sat - Thu: 8:00 - 18:00
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-gray-600 text-xs font-bold tracking-widest uppercase">
              &copy; {new Date().getFullYear()} SMART MOTOR AUTO REPAIR
            </p>
            <div className="flex gap-4">
              <VisaIcon />
              <MastercardIcon />
              <ApplePayIcon />
              <GooglePayIcon />
              <AmexIcon />
            </div>
          </div>
          <div className="flex gap-12 text-[10px] font-black uppercase tracking-widest text-gray-600">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
