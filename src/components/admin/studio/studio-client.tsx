'use client'

import React, { useState } from 'react'
import { StudioLayout } from './studio-layout'
import { Wrench, Car, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ServiceEditor } from './service-editor'
import { BrandEditor } from './brand-editor'

interface StudioClientProps {
  initialServices: any[]
  initialBrands: any[]
}

export function StudioClient({ initialServices, initialBrands }: StudioClientProps) {
  const [activeTab, setActiveTab] = useState<'services' | 'brands' | 'assets'>('services')
  
  const tabs = [
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'brands', label: 'Brands', icon: Car },
    // Assets tab can be added later
  ]

  const serviceItems = initialServices.map(s => ({
    id: s.id,
    name: s.name,
    subtitle: s.category,
    image: s.iconImage || s.image,
    active: s.active
  }))

  const brandItems = initialBrands.map(b => ({
    id: b.id,
    name: b.name,
    subtitle: `${b.models?.split(',').length || 0} Models`,
    image: b.logoUrl || b.logoFile ? (b.logoUrl?.startsWith('http') ? b.logoUrl : `/brands-carousel/${b.logoFile || b.logoUrl?.replace(/^\//, '')}`) : undefined,
    active: true
  }))

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 bg-white/50 backdrop-blur-md p-1.5 rounded-full border border-gray-100 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === tab.id 
                ? "bg-[#121212] text-white shadow-lg" 
                : "text-gray-400 hover:text-[#121212]"
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'services' && (
        <StudioLayout
          title="Service Catalog"
          type="services"
          items={serviceItems}
          onAddItem={() => {}}
          renderDetail={(id) => (
            <ServiceEditor 
              id={id} 
              initialData={initialServices.find(s => s.id === id)} 
            />
          )}
        />
      )}

      {activeTab === 'brands' && (
        <StudioLayout
          title="Brand Profiles"
          type="brands"
          items={brandItems}
          onAddItem={() => {}}
          renderDetail={(id) => (
            <BrandEditor 
              id={id} 
              initialData={initialBrands.find(b => b.id === id)} 
            />
          )}
        />
      )}
    </div>
  )
}
