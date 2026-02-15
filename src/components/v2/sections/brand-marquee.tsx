'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

// Extended brand list based on feedback
// Using placeholders or existing logic if logos are missing, but aiming for comprehensive list
// Since we don't have all SVGs, we will use text fallback for missing ones or map to existing if similar
const brandList = [
    // German
    { id: 'bmw', name: 'BMW' },
    { id: 'mercedes', name: 'Mercedes' },
    { id: 'audi', name: 'Audi' },
    { id: 'porsche', name: 'Porsche' },
    { id: 'vw', name: 'Volkswagen' },
    // Japanese
    { id: 'toyota', name: 'Toyota' },
    { id: 'lexus', name: 'Lexus' },
    { id: 'nissan', name: 'Nissan' },
    { id: 'honda', name: 'Honda' },
    // Chinese
    { id: 'byd', name: 'BYD' },
    { id: 'mg', name: 'MG' },
    { id: 'hongqi', name: 'Hongqi' },
    { id: 'haval', name: 'Haval' },
    // European
    { id: 'rangerover', name: 'Range Rover' },
    { id: 'jaguar', name: 'Jaguar' },
    { id: 'volvo', name: 'Volvo' },
    // American
    { id: 'ford', name: 'Ford' },
    { id: 'chevrolet', name: 'Chevrolet' },
    { id: 'gmc', name: 'GMC' },
    { id: 'jeep', name: 'Jeep' }
]

function BrandItem({ brand, scale, opacity }: {
    brand: typeof brandList[0],
    scale: number,
    opacity: number
}) {
    // Simplified Item that relies on text if logo missing, but retains existing style
    return (
        <div
            className="flex flex-col items-center gap-1 transition-all group"
            style={{
                transform: `scale(${scale})`,
                opacity,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            {/* Placeholder for Logo - In a real scenario we'd map to actual SVGs */}
            {/* For now, using a stylish text representation to ensure it looks good without broken images */}
            <div className="w-32 h-16 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100 px-4">
                <span className="text-sm font-black uppercase text-gray-800 tracking-tighter">
                    {brand.name}
                </span>
            </div>
        </div>
    )
}

export function BrandMarquee() {
    const [centerIndex, setCenterIndex] = useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setCenterIndex(prev => (prev + 1) % brandList.length)
        }, 2000) // Faster rotation
        return () => clearInterval(interval)
    }, [])

    const getVisibleItems = () => {
        const items = []
        const visibleCount = 7
        const halfVisible = Math.floor(visibleCount / 2)
        for (let i = -halfVisible; i <= halfVisible; i++) {
            const index = (centerIndex + i + brandList.length) % brandList.length
            items.push({ brand: brandList[index], index, position: i })
        }
        return items
    }

    return (
        <div className="py-6 bg-white border-y border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-4 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-800">
                    SPECIALIZED EXPERTISE ACROSS LEADING BRANDS
                </p>
                <p className="text-[10px] text-gray-500 mt-1 tracking-widest uppercase">
                    German • Japanese • Chinese • European • American
                </p>
            </div>

            <div className="relative flex items-center justify-center gap-4 h-20">
                {getVisibleItems().map(({ brand, index, position }) => {
                    const distance = Math.abs(position)
                    let scale = 1
                    let opacity = 1
                    if (distance === 1) { scale = 0.85; opacity = 0.7 }
                    if (distance === 2) { scale = 0.7; opacity = 0.5 }
                    if (distance >= 3) { scale = 0.5; opacity = 0.3 }

                    return (
                        <div key={`${brand.id}-${index}`} className="flex-shrink-0">
                            <BrandItem brand={brand} scale={scale} opacity={opacity} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
