'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DashboardWidget } from './dashboard-widget'

interface StatCardProps {
  label: string
  value: string
  trend: string
  trendUp?: boolean
  delay?: number
  isLoading?: boolean
}

export function StatCard({ label, value, trend, trendUp, delay = 0, isLoading }: StatCardProps) {
  return (
    <DashboardWidget isLoading={isLoading} delay={delay} className="p-0">
      <div className="p-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{label}</p>
        <div className="flex items-end justify-between gap-2">
          <motion.p 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="text-4xl font-black tracking-tighter text-[#121212] italic leading-none"
          >
            {value}
          </motion.p>
          <div className={cn(
            "flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight shadow-sm",
            trendUp 
              ? "bg-green-50 text-green-600 border border-green-100" 
              : "bg-red-50 text-red-600 border border-red-100"
          )}>
            {trendUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trend}
          </div>
        </div>
      </div>
    </DashboardWidget>
  )
}
