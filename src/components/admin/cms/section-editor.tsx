'use client'

import React, { useState } from 'react'
import { useAdminMode } from '@/hooks/use-admin-mode'
import { motion, AnimatePresence } from 'framer-motion'
import { Edit3, History, MoreVertical, X, Check, Eye } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface SectionEditorProps {
  children: React.ReactNode
  sectionId: string
  sectionName: string
  onEdit?: () => void
  onHistory?: () => void
  className?: string
}

export function SectionEditor({
  children,
  sectionId,
  sectionName,
  onEdit,
  onHistory,
  className
}: SectionEditorProps) {
  const { isAdminMode } = useAdminMode()
  const [isHovered, setIsHovered] = useState(false)

  if (!isAdminMode) {
    return <div className={className}>{children}</div>
  }

  return (
    <div 
      className={cn("relative group/section transition-all duration-500", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Indicator of Editable Area */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -inset-2 border-2 border-dashed border-[#E62329]/30 rounded-[2.5rem] pointer-events-none z-10"
          />
        )}
      </AnimatePresence>

      {/* Admin Controls Overlay */}
      <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover/section:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/section:translate-y-0">
        <div className="bg-[#121212]/90 backdrop-blur-xl border border-white/10 p-1.5 rounded-full shadow-2xl flex items-center gap-1">
          <div className="px-3 py-1 border-r border-white/10">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/60">
              {sectionName}
            </span>
          </div>
          
          <button
            onClick={onEdit}
            className="p-2 rounded-full hover:bg-white/10 text-white hover:text-[#E62329] transition-all active:scale-90 flex items-center gap-2"
            title="Edit Content"
          >
            <Edit3 size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest pr-1">Edit</span>
          </button>

          <button
            onClick={onHistory}
            className="p-2 rounded-full hover:bg-white/10 text-white hover:text-blue-400 transition-all active:scale-90"
            title="Browse History"
          >
            <History size={14} />
          </button>
        </div>
      </div>

      {/* Original Content */}
      <div className={cn(
        "transition-all duration-500",
        isHovered ? "opacity-90 scale-[0.995]" : "opacity-100 scale-100"
      )}>
        {children}
      </div>
    </div>
  )
}
