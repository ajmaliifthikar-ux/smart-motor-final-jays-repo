'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Wrench, 
  Car, 
  Search, 
  Plus, 
  ChevronRight, 
  Filter,
  LayoutGrid,
  List
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface StudioItem {
  id: string
  name: string
  subtitle?: string
  image?: string
  active?: boolean
}

interface StudioLayoutProps {
  type: 'services' | 'brands'
  items: StudioItem[]
  onAddItem: () => void
  renderDetail: (id: string | null) => React.ReactNode
  title: string
}

export function StudioLayout({
  type,
  items,
  onAddItem,
  renderDetail,
  title
}: StudioLayoutProps) {
  const [selectedId, setSelectedId] = useState<string | null>(items[0]?.id || null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list')

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedItem = items.find(i => i.id === selectedId)

  return (
    <div className="flex h-[calc(100vh-120px)] gap-6 overflow-hidden">
      {/* Sidebar List */}
      <div className="w-[350px] flex flex-col gap-4 bg-white/50 backdrop-blur-xl rounded-[2.5rem] border border-gray-100 p-6 overflow-hidden shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-black uppercase tracking-tighter italic">
            {title} <span className="text-[#E62329] text-xs not-italic ml-2">({items.length})</span>
          </h2>
          <Button 
            onClick={onAddItem}
            className="w-8 h-8 rounded-full p-0 bg-[#121212] text-white hover:bg-[#E62329] transition-all"
          >
            <Plus size={16} />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            placeholder={`Search ${type}...`}
            className="w-full bg-gray-50 border-none rounded-2xl py-2.5 pl-9 pr-4 text-[10px] font-black uppercase tracking-widest focus:ring-2 focus:ring-[#E62329]/20 transition-all outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex-1 overflow-y-auto subtle-scrollbar pr-2 space-y-2">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedId(item.id)}
              className={cn(
                "w-full text-left p-4 rounded-2xl transition-all duration-300 group flex items-center gap-4 relative overflow-hidden",
                selectedId === item.id 
                  ? "bg-[#121212] text-white shadow-xl translate-x-1" 
                  : "bg-white hover:bg-gray-50 text-gray-600 border border-gray-50"
              )}
            >
              {item.image ? (
                <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-100 p-1">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-[#E62329]/10 flex items-center justify-center flex-shrink-0 text-[#E62329]">
                  {type === 'services' ? <Wrench size={18} /> : <Car size={18} />}
                </div>
              )}
              
              <div className="flex-1 overflow-hidden">
                <p className="font-black text-[10px] uppercase tracking-widest truncate">{item.name}</p>
                {item.subtitle && (
                  <p className={cn(
                    "text-[8px] font-bold uppercase tracking-tight truncate mt-0.5",
                    selectedId === item.id ? "text-white/40" : "text-gray-400"
                  )}>
                    {item.subtitle}
                  </p>
                )}
              </div>

              <ChevronRight 
                size={14} 
                className={cn(
                  "transition-all duration-300",
                  selectedId === item.id ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
                )} 
              />

              {item.active === false && (
                <div className="absolute top-0 right-0 px-2 py-0.5 bg-yellow-400 text-[6px] font-black uppercase text-black">
                  Draft
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Detail Pane */}
      <div className="flex-1 bg-white rounded-[3rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedId || 'empty'}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="flex-1 overflow-y-auto subtle-scrollbar p-10"
          >
            {renderDetail(selectedId)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
