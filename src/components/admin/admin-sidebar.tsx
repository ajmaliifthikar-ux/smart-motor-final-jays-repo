'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ChevronDown, Menu, X } from 'lucide-react'
import { adminNavigation } from '@/lib/admin-nav'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SignOutButton } from '@/app/admin/sign-out-button'

export function AdminSidebar() {
  const pathname = usePathname()
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Load expanded state from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('admin-sidebar-expanded')
    if (saved) {
      try {
        setExpandedSections(JSON.parse(saved))
      } catch (e) {
        // Invalid JSON, use defaults
      }
    } else {
      // Default: expand first section (Performance Dashboard)
      setExpandedSections({ performance: true })
    }
  }, [])

  // Save expanded state to localStorage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('admin-sidebar-expanded', JSON.stringify(expandedSections))
    }
  }, [expandedSections, mounted])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const isItemActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const isSectionActive = (sectionId: string) => {
    const section = adminNavigation.find(s => s.id === sectionId)
    if (!section) return false
    return section.items.some(item => isItemActive(item.href))
  }

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <h1 className="text-xl font-black uppercase tracking-widest text-[#E62329] italic">
          Smart <span className="text-white">Admin</span>
        </h1>
        <p className="text-[8px] font-bold text-white/40 uppercase mt-1 tracking-[0.2em]">High Performance Ops</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto">
        <div className="space-y-1 p-3">
          {adminNavigation.map((section) => {
            const Icon = section.icon
            const isExpanded = expandedSections[section.id]
            const isActive = isSectionActive(section.id)

            return (
              <div key={section.id} className="space-y-1">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#E62329]/20 text-[#E62329]'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{section.label}</span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Sub-items */}
                {isExpanded && (
                  <div className="space-y-1 pl-2">
                    {section.items.map((item) => {
                      const ItemIcon = item.icon
                      const active = isItemActive(item.href)

                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setIsMobileOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group ${
                            active
                              ? 'bg-[#E62329] text-white font-medium'
                              : 'text-white/60 hover:text-white/90 hover:bg-white/5'
                          }`}
                        >
                          <ItemIcon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate text-xs sm:text-sm">{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* Sign Out */}
      <div className="p-4 border-t border-white/5 bg-black/20">
        <SignOutButton />
      </div>
    </>
  )

  if (!mounted) return null

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-50 w-64 bg-[#121212] text-white flex-col carbon-fiber border-r border-white/5">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#121212] border-b border-white/5 flex items-center justify-between px-4 py-4">
        <h1 className="text-lg font-black text-[#E62329] italic">
          Smart <span className="text-white">Admin</span>
        </h1>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              {isMobileOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-[#121212] border-r border-white/5 p-0 flex flex-col">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Mobile Content Padding */}
      <div className="md:hidden h-16" />
    </>
  )
}
