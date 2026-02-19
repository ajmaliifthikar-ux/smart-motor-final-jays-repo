'use client'

import { useSession } from 'next-auth/react'
import { useAdminMode } from '@/hooks/use-admin-mode'
import { motion, AnimatePresence } from 'framer-motion'
import { Settings, Eye, Edit3, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'

export function AdminToolbar() {
  const { data: session, status } = useSession()
  const { isAdminMode, toggleAdminMode } = useAdminMode()

  const isAdmin = session?.user?.role === 'ADMIN'

  if (status === 'loading' || !isAdmin) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        className="fixed top-0 left-0 right-0 z-[60] flex justify-center pt-4 pointer-events-none"
      >
        <div className="flex items-center gap-4 bg-[#121212]/90 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.4)] pointer-events-auto">
          {/* Admin Label */}
          <div className="flex items-center gap-2 pr-4 border-r border-white/10">
            <div className="w-2 h-2 rounded-full bg-[#E62329] animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">
              Admin Panel
            </span>
          </div>

          {/* Toggle Mode */}
          <div className="flex items-center gap-3">
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest transition-colors duration-300",
              isAdminMode ? "text-white/40" : "text-white"
            )}>
              View
            </span>
            
            <button
              onClick={toggleAdminMode}
              data-testid="admin-mode-toggle"
              className={cn(
                "relative w-10 h-5 rounded-full transition-colors duration-300 flex items-center px-0.5",
                isAdminMode ? "bg-[#E62329]" : "bg-white/20"
              )}
              role="checkbox"
              aria-checked={isAdminMode}
            >
              <motion.div
                layout
                className="w-4 h-4 bg-white rounded-full shadow-sm"
                animate={{ x: isAdminMode ? 20 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>

            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest transition-colors duration-300",
              isAdminMode ? "text-[#E62329]" : "text-white/40"
            )}>
              Edit Mode
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 pl-4 border-l border-white/10">
            <button
              onClick={() => window.location.href = '/admin/dashboard'}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-all active:scale-90"
              title="Admin Dashboard"
            >
              <Settings size={14} />
            </button>
            <button
              onClick={() => signOut()}
              className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-[#E62329] transition-all active:scale-90"
              title="Sign Out"
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
