'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  LayoutDashboard,
  Calendar,
  Award,
  MessageCircle,
  Settings,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { auth } from '@/lib/firebase-client'
import { signOut } from 'firebase/auth'
import { toast } from 'sonner'

// ─── Nav config ───────────────────────────────────────────────────────────────

const navItems = [
  { href: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/user/bookings', label: 'My Bookings', icon: Calendar },
  { href: '/user/loyalty', label: 'Loyalty', icon: Award },
  { href: '/user/messages', label: 'Messages', icon: MessageCircle },
  { href: '/user/settings', label: 'Settings', icon: Settings },
]

// ─── Props ────────────────────────────────────────────────────────────────────

interface UserSidebarProps {
  displayName: string | null
  email: string | null
  photoURL?: string | null
}

// ─── Shared sidebar content ───────────────────────────────────────────────────

function SidebarContent({
  pathname,
  displayName,
  email,
  onSignOut,
  onClose,
}: {
  pathname: string
  displayName: string | null
  email: string | null
  onSignOut: () => void
  onClose?: () => void
}) {
  const initials = displayName
    ? displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?'

  return (
    <div className="flex flex-col h-full carbon-fiber">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
        <div>
          <span className="text-xl font-black uppercase tracking-widest text-[#E62329] italic">
            Smart
          </span>
          <span className="text-xl font-black uppercase tracking-widest text-white italic ml-1">
            Motor
          </span>
          <p className="text-[9px] font-bold text-white/40 uppercase mt-0.5 tracking-[0.2em]">
            Garage Portal
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="md:hidden text-white/60 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-[#E62329] text-white shadow-lg shadow-[#E62329]/20'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-white/50'
                }`}
              />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/5 p-4">
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-[#E62329] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-semibold truncate">
              {displayName ?? 'User'}
            </p>
            <p className="text-white/40 text-xs truncate">{email ?? ''}</p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function UserSidebar({ displayName, email }: UserSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      await fetch('/api/user/session', { method: 'DELETE' })
      router.push('/user/login')
      router.refresh()
    } catch {
      toast.error('Failed to sign out. Please try again.')
    }
  }

  return (
    <>
      {/* Mobile hamburger button — fixed top-left */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2 rounded-lg bg-[#121212] text-white shadow-lg"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 w-64 flex-col z-30">
        <SidebarContent
          pathname={pathname}
          displayName={displayName}
          email={email}
          onSignOut={handleSignOut}
        />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed inset-y-0 left-0 w-72 z-50 flex flex-col transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent
          pathname={pathname}
          displayName={displayName}
          email={email}
          onSignOut={handleSignOut}
          onClose={() => setMobileOpen(false)}
        />
      </aside>
    </>
  )
}
