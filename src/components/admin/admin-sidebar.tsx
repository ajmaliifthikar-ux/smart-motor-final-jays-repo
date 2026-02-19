'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { ChevronRight, Menu, X } from 'lucide-react'
import { adminNavigation } from '@/lib/admin-nav'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SignOutButton } from '@/app/admin/sign-out-button'
import { cn } from '@/lib/utils'

// ─── section accent colours (one per category) ───────────────────────────────
const SECTION_COLOURS: Record<string, string> = {
  performance:  '#60A5FA', // blue
  intelligence: '#A78BFA', // violet
  studio:       '#F472B6', // pink
  automation:   '#34D399', // emerald
  'social-media':'#FBBF24', // amber
  seo:          '#38BDF8', // sky
  blog:         '#FB923C', // orange
  bookings:     '#4ADE80', // green
  tools:        '#E879F9', // fuchsia
  settings:     '#94A3B8', // slate
}

// ─── smooth accordion with ResizeObserver ─────────────────────────────────────
function Accordion({ open, children }: { open: boolean; children: React.ReactNode }) {
  const innerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (!innerRef.current) return
    const ro = new ResizeObserver(() => {
      setHeight(innerRef.current?.scrollHeight ?? 0)
    })
    ro.observe(innerRef.current)
    setHeight(innerRef.current.scrollHeight)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      style={{
        height: open ? height : 0,
        overflow: 'hidden',
        transition: 'height 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div ref={innerRef}>{children}</div>
    </div>
  )
}

// ─── main sidebar content ─────────────────────────────────────────────────────
function SidebarContent({ onNav }: { onNav?: () => void }) {
  const pathname = usePathname()
  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const active: Record<string, boolean> = {}
    adminNavigation.forEach(section => {
      const hasActive = section.items.some(
        item => pathname === item.href || pathname.startsWith(item.href + '/')
      )
      if (hasActive) active[section.id] = true
    })
    try {
      const saved = JSON.parse(localStorage.getItem('sm-sidebar') || '{}')
      setExpanded({ ...saved, ...active })
    } catch {
      setExpanded(active)
    }
  }, [pathname])

  useEffect(() => {
    if (mounted) localStorage.setItem('sm-sidebar', JSON.stringify(expanded))
  }, [expanded, mounted])

  const toggle = (id: string) =>
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  const isItemActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/')

  const isSectionActive = (sectionId: string) =>
    adminNavigation
      .find(s => s.id === sectionId)
      ?.items.some(item => isItemActive(item.href)) ?? false

  if (!mounted) return null

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A]">

      {/* ── Logo ──────────────────────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-4 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#E62329] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-red-900/40">
            <span className="text-white font-black text-sm italic">S</span>
          </div>
          <div>
            <p className="text-white font-black text-sm tracking-tight leading-none">
              Smart <span className="text-[#E62329]">Motor</span>
            </p>
            <p className="text-[9px] text-white/25 font-bold uppercase tracking-[0.2em] mt-0.5">
              Admin Panel
            </p>
          </div>
        </div>
      </div>

      {/* ── Nav ───────────────────────────────────────────────────────── */}
      <nav
        className="flex-1 overflow-y-auto py-3 px-2.5 space-y-0.5"
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.08) transparent',
          WebkitOverflowScrolling: 'touch',
        } as React.CSSProperties}
      >
        {adminNavigation.map(section => {
          const Icon       = section.icon
          const isOpen     = !!expanded[section.id]
          const hasActive  = isSectionActive(section.id)
          const accent     = SECTION_COLOURS[section.id] ?? '#E62329'

          return (
            <div key={section.id}>

              {/* ── Category header ──────────────────────────────────── */}
              <button
                onClick={() => toggle(section.id)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 group select-none',
                  isOpen || hasActive
                    ? 'bg-white/[0.08]'
                    : 'hover:bg-white/[0.05]'
                )}
              >
                {/* Coloured icon pill */}
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={{
                    background: isOpen || hasActive
                      ? `${accent}25`
                      : 'rgba(255,255,255,0.06)',
                  }}
                >
                  <span
                    style={{
                      color: isOpen || hasActive
                        ? accent
                        : 'rgba(255,255,255,0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Label */}
                <span
                  className={cn(
                    'flex-1 text-left text-[10.5px] font-bold uppercase tracking-widest transition-colors duration-200 truncate',
                    isOpen || hasActive ? 'text-white' : 'text-white/45'
                  )}
                >
                  {section.label}
                </span>

                {/* Chevron */}
                <ChevronRight
                  className={cn(
                    'w-3 h-3 flex-shrink-0 transition-transform duration-300',
                    isOpen ? 'rotate-90 text-white/50' : 'text-white/20'
                  )}
                />
              </button>

              {/* ── Sub-items accordion ───────────────────────────────── */}
              <Accordion open={isOpen}>
                <div className="mt-0.5 mb-1 ml-3.5 pl-3 border-l border-white/[0.06] space-y-px py-1">
                  {section.items.map(item => {
                    const ItemIcon = item.icon
                    const active   = isItemActive(item.href)

                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={onNav}
                        className={cn(
                          'relative flex items-center gap-2.5 px-3 py-[7px] rounded-lg transition-all duration-150 group',
                          active
                            ? 'bg-white/[0.09] text-white'
                            : 'text-white/40 hover:text-white/75 hover:bg-white/[0.05]'
                        )}
                      >
                        {/* Active left bar */}
                        {active && (
                          <span
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3.5 rounded-full"
                            style={{ background: accent }}
                          />
                        )}

                        {/* Item icon — always lighter white */}
                        <span
                          style={{
                            color: active
                              ? 'rgba(255,255,255,0.9)'
                              : 'rgba(255,255,255,0.42)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'color 150ms',
                          }}
                          className="group-hover:[color:rgba(255,255,255,0.72)!important]"
                        >
                          <ItemIcon className="w-3.5 h-3.5 flex-shrink-0" />
                        </span>

                        <span className={cn(
                          'text-[11px] font-semibold truncate transition-colors',
                          active ? 'font-bold text-white' : ''
                        )}>
                          {item.label}
                        </span>

                        {active && (
                          <span
                            className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: accent }}
                          />
                        )}
                      </Link>
                    )
                  })}
                </div>
              </Accordion>

            </div>
          )
        })}
      </nav>

      {/* ── Sign out ──────────────────────────────────────────────────── */}
      <div className="px-3 py-3 border-t border-white/[0.06]">
        <SignOutButton />
      </div>
    </div>
  )
}

// ─── exported component ───────────────────────────────────────────────────────
export function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* ── Desktop: floating rounded sidebar ──────────────────────── */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-50 w-60 flex-col p-3">
        <div className="flex flex-col h-full rounded-2xl border border-white/[0.07] shadow-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #0E0E0E 0%, #0A0A0A 100%)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
          }}
        >
          <SidebarContent />
        </div>
      </aside>

      {/* ── Mobile top bar ─────────────────────────────────────────── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#E62329] rounded-lg flex items-center justify-center shadow-md shadow-red-900/40">
            <span className="text-white font-black text-xs italic">S</span>
          </div>
          <span className="text-white font-black text-sm">
            Smart <span className="text-[#E62329]">Motor</span>
          </span>
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <button className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white">
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0 border-r border-white/[0.06] bg-transparent">
            <SidebarContent onNav={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile spacer */}
      <div className="md:hidden h-[57px]" />
    </>
  )
}
