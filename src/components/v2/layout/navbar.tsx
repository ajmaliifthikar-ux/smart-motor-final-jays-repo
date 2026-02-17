'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MenuIcon, XIcon, PhoneIcon } from 'lucide-react'
import { cn, publicPath } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Tooltip } from '@/components/ui/tooltip'
import { Button } from '@/components/ui/button'

const navLinks = [
  { href: '#about', label: 'About Us', id: 'about' },
  { href: '#services', label: 'Services', id: 'services' },
  { href: '#brands', label: 'Brands', id: 'brands' },
  { href: '#packages', label: 'Packages', id: 'packages' },
  { href: '/new-home/smart-tips', label: 'Smart Tips', id: 'smart-tips' },
  { href: '#contact', label: 'Contact', id: 'contact' },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Scroll Spy Logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-50% 0px -50% 0px' } // Trigger when section is in middle of viewport
    )

    navLinks.forEach((link) => {
      const element = document.getElementById(link.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // If it's a direct link (not an anchor), let the browser handle it
    if (!href.startsWith('#')) return

    e.preventDefault()
    const targetId = href.replace('#', '')
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-0">
      <div className={cn(
        'w-full max-w-[95%] md:max-w-7xl mx-auto px-6 md:px-10 transition-all duration-500 rounded-b-[3rem] border border-white/10 shadow-sm',
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] py-4'
          : 'bg-white/10 backdrop-blur-md py-6'
      )}>
        <nav className="flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/new-home" className="flex items-center group relative z-50">
            <img
              src={publicPath("/branding/logo.png")}
              alt="Smart Motor"
              className={cn(
                'transition-all duration-500 object-contain',
                isScrolled ? 'h-12 md:h-14' : 'h-16 md:h-20'
              )}
            />
          </Link>

          {/* Desktop Nav - Single Row */}
          <div className="hidden lg:flex items-center justify-center gap-1 bg-gray-100/50 backdrop-blur-md p-1.5 rounded-full border border-white/20 mx-6 shadow-inner whitespace-nowrap">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={cn(
                    'relative px-4 py-2 text-[9px] font-black uppercase tracking-widest transition-all duration-300 rounded-full z-10 flex-nowrap',
                    !isActive && 'text-gray-500 hover:text-[#121212]'
                  )}
                  style={isActive ? { color: '#FFFFFF' } : undefined}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-[#121212] rounded-full -z-10 shadow-lg"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  {link.label}
                </a>
              )
            })}
          </div>

          {/* Desktop Right Actions - Call Button ONLY (no socials) */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#121212]/40">Toll Free</span>
              <Tooltip content="Call us directly for immediate assistance" position="bottom">
                <a
                  href="tel:80076278"
                  className={cn(
                    'group flex items-center gap-3 pl-1 pr-6 py-1.5 rounded-full transition-all duration-300 border shadow-sm',
                    isScrolled
                      ? 'bg-[#121212] text-white border-transparent hover:bg-[#E62329]'
                      : 'bg-white/80 backdrop-blur-md text-[#121212] border-white/20 hover:bg-[#121212] hover:text-white'
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-md",
                    isScrolled ? "bg-white/10 text-white" : "bg-[#E62329] text-white"
                  )}>
                    <PhoneIcon size={14} className="fill-current" />
                  </div>
                  <span className="text-xs font-black tracking-widest leading-none">80076278</span>
                </a>
              </Tooltip>
            </div>

            <Button
              onClick={(e: React.MouseEvent) => {
                e.preventDefault()
                const bookingSection = document.getElementById('booking')
                if (bookingSection) {
                  bookingSection.scrollIntoView({ behavior: 'smooth' })
                }
              }}
              className="bg-[#E62329] text-white rounded-full px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-[#121212] transition-all shadow-lg hover:shadow-xl hidden md:flex"
            >
              Book Now
            </Button>
          </div>

          {/* Mobile hamburger */}
          <Tooltip content={isMobileMenuOpen ? "Close menu" : "Open menu"} position="bottom">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={cn(
                'lg:hidden p-3 rounded-full transition-colors relative z-50',
                isScrolled || isMobileMenuOpen ? 'bg-gray-100 text-[#121212]' : 'bg-white/20 backdrop-blur-md text-[#121212]'
              )}
            >
              {isMobileMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </Tooltip>
        </nav>

        {/* Mobile Menu Overlay */}
        <div className={cn(
          "fixed inset-0 bg-white/95 backdrop-blur-3xl z-40 lg:hidden transition-all duration-500 flex flex-col pt-32 px-8",
          isMobileMenuOpen ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none -translate-y-10"
        )}>
          <div className="flex flex-col gap-6">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="font-black text-3xl text-[#121212] uppercase tracking-tighter"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <span className="text-gray-300 mr-4 text-lg font-medium">0{i + 1}</span>
                {link.label}
              </a>
            ))}

            <div className="mt-12 pt-12 border-t border-gray-100">
              <a href="tel:80076278" className="flex items-center gap-4 w-full bg-[#121212] text-white p-6 rounded-[2rem] shadow-xl active:scale-95 transition-transform">
                <div className="w-12 h-12 bg-[#E62329] rounded-full flex items-center justify-center">
                  <PhoneIcon size={24} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Toll Free Call</p>
                  <p className="text-xl font-black tracking-widest">800 SMART</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
