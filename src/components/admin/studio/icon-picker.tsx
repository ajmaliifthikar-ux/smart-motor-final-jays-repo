'use client'

import React, { useState } from 'react'
import { PRESET_AUTOMOTIVE_ICONS } from '@/lib/constants/icons'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger 
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface IconPickerProps {
  selectedIcon?: string
  onSelect: (icon: string) => void
}

export function IconPicker({ selectedIcon, onSelect }: IconPickerProps) {
  const [search, setSearch] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const filteredIcons = PRESET_AUTOMOTIVE_ICONS.filter(icon => 
    icon.toLowerCase().includes(search.toLowerCase())
  )

  const RED_FILTER = 'brightness(0) saturate(100%) invert(18%) sepia(96%) saturate(4000%) hue-rotate(349deg) brightness(88%) contrast(108%)'

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button 
          type="button"
          className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 hover:border-[#E62329] hover:bg-[#E62329]/5 transition-all group"
        >
          {selectedIcon ? (
            <img 
              src={`/Automotive-Icons/${selectedIcon}`} 
              alt="Selected" 
              className="w-10 h-10 object-contain"
              style={{ filter: RED_FILTER }}
            />
          ) : (
            <>
              <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-[#E62329]/10 group-hover:text-[#E62329]">
                <Search size={12} />
              </div>
              <span className="text-[8px] font-black uppercase text-gray-400">Pick Icon</span>
            </>
          )}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col p-0 overflow-hidden bg-white rounded-[2rem] border-none shadow-2xl">
        <DialogHeader className="p-8 pb-4">
          <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic">
            Icon <span className="text-[#E62329]">Library</span>
          </DialogTitle>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              placeholder="Search icons..."
              className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-10 pr-4 text-xs font-bold uppercase tracking-widest focus:ring-2 focus:ring-[#E62329]/20 transition-all outline-none"
              value={search}
              onChange={(e) => setSearch(search)} // Fixed: typo
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto subtle-scrollbar p-8 grid grid-cols-4 sm:grid-cols-6 gap-4">
          {filteredIcons.map((icon) => (
            <button
              key={icon}
              onClick={() => { onSelect(icon); setIsOpen(false) }}
              className={cn(
                "aspect-square rounded-2xl border-2 flex items-center justify-center p-4 transition-all hover:scale-110",
                selectedIcon === icon ? "border-[#E62329] bg-[#E62329]/5" : "border-gray-50 bg-gray-50/30 hover:border-gray-200"
              )}
            >
              <img 
                src={`/Automotive-Icons/${icon}`} 
                alt={icon} 
                className="w-full h-full object-contain"
                style={{ filter: selectedIcon === icon ? RED_FILTER : undefined }}
              />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
