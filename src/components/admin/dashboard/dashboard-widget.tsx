'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

interface DashboardWidgetProps {
  children: React.ReactNode
  title?: string
  subtitle?: string
  isLoading?: boolean
  className?: string
  headerAction?: React.ReactNode
  delay?: number
}

export function DashboardWidget({
  children,
  title,
  subtitle,
  isLoading,
  className,
  headerAction,
  delay = 0
}: DashboardWidgetProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay, 
        ease: [0.23, 1, 0.32, 1] 
      }}
      className={cn(
        "rounded-[2.5rem] border border-gray-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden flex flex-col",
        className
      )}
    >
      {(title || headerAction) && (
        <div className="px-8 py-6 flex items-center justify-between border-b border-gray-50 bg-gray-50/30">
          <div>
            {title && (
              <h3 className="text-sm font-black uppercase tracking-widest text-[#121212]">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      <div className="flex-1 p-8">
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-[60%] rounded-xl" />
            <Skeleton className="h-32 w-full rounded-2xl" />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </motion.div>
  )
}
