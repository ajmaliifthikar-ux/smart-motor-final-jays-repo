'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MenuIcon, XIcon, PhoneIcon, GlobeIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/lib/language-context'

const navLinks = [
  { href: '#services', labelKey: 'nav.services' },
  { href: '#cars', labelKey: 'nav.gallery' },
  { href: '#booking', labelKey: 'nav.booking' },
  { href: '#contact', labelKey: 'nav.contact' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [langKey, setLangKey] = useState(0)

  const { language, setLanguage, t, isRTL } = useLanguage()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLangSwitch = () => {
    setLangKey(k => k + 1)
    setLanguage(language === 'en' ? 'ar' : 'en')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-2">
      <div className={cn(
        'max-w-5xl mx-auto px-5 md:px-8 transition-all duration-500 rounded-b-2xl',
        isScrolled
          ? 'bg-white/92 backdrop-blur-xl shadow-[0_1px_24px_rgba(35,31,32,0.08)] py-3'
          : 'bg-transparent py-5'
      )}>
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <img
              src="/branding/logo.png"
              alt="Smart Motor"
              className={cn(
                'transition-all duration-500',
                isScrolled ? 'h-20' : 'h-32'
              )}
            />
          </Link>

          {/* Desktop Nav — centred, equal spacing */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-6 py-2 text-sm font-semibold tracking-wide transition-colors duration-300',
                  'after:content-[""] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-[#E62329] after:transition-all after:duration-300 after:rounded-full',
                  'hover:after:w-3/4',
                  'text-[#121212] hover:text-[#E62329]'
                )}
              >
                {t(link.labelKey)}
              </Link>
            ))}
          </div>

          {/* Desktop right actions */}
          <div className="hidden lg:flex items-center gap-5">
            <a
              href="tel:+97126666789"
              className={cn(
                'flex items-center gap-2 text-sm font-bold transition-colors duration-300',
                isScrolled ? 'text-[#121212]' : 'text-white'
              )}
            >
              <PhoneIcon size={15} /> <span dir="ltr">+971 2 666 6789</span>
            </a>

            <button
              onClick={handleLangSwitch}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-[10px] font-black uppercase tracking-widest",
                isScrolled
                  ? "border-gray-200 text-gray-500 hover:border-black hover:text-black"
                  : "border-white/30 text-white/70 hover:border-white hover:text-white"
              )}
            >
              <GlobeIcon size={12} />
              <span key={langKey} className="lang-animate">
                {language === 'en' ? 'Arabic' : 'English'}
              </span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn('lg:hidden p-2 rounded-lg text-[#121212]')}
          >
            {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 pb-4 border-t border-[#ECECEA] bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg mt-2 p-4">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-semibold py-3 px-4 text-[#121212] hover:bg-[#F4F3F1] rounded-xl transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t(link.labelKey)}
                </Link>
              ))}
              <hr className="border-[#ECECEA] my-2" />
              <a href="tel:+97126666789" className="flex items-center gap-2 font-semibold py-3 px-4 text-[#121212]">
                <PhoneIcon size={16} /> +971 2 666 6789
              </a>
              <button
                onClick={() => { document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' }); setIsMobileMenuOpen(false) }}
                className="mt-1"
              >
                <div className="w-full bg-[#E62329] text-white rounded-full py-3 text-xs font-extrabold tracking-widest uppercase text-center">Book Now</div>
              </button>
              <button
                onClick={handleLangSwitch}
                className="mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-gray-200 text-gray-500 hover:border-black hover:text-black text-[10px] font-black uppercase tracking-widest"
              >
                <GlobeIcon size={12} />
                <span key={langKey} className="lang-animate">
                  {language === 'en' ? 'Arabic' : 'English'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
