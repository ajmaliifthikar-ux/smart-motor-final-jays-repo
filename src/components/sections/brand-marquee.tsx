'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/lib/language-context'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const marqueeLogos = [
    { id: 'byd', logoFile: 'BYD.svg', name: 'BYD', nameAr: 'بي وای دي' },
    { id: 'bugatti', logoFile: 'Bugatti.svg', name: 'Bugatti', nameAr: 'بوغاتي' },
    { id: 'buick', logoFile: 'Buick.svg', name: 'Buick', nameAr: 'بيوك' },
    { id: 'cadillac', logoFile: 'Cadillac.svg', name: 'Cadillac', nameAr: 'كادلاك' },
    { id: 'caparo', logoFile: 'Caparo.svg', name: 'Caparo', nameAr: 'كابارو' },
    { id: 'carlsson', logoFile: 'Carlsson.svg', name: 'Carlsson', nameAr: 'كارلسون' },
    { id: 'caterham', logoFile: 'Caterham.svg', name: 'Caterham', nameAr: 'كاترهام' },
]

function BrandItem({ brand, language, scale, opacity }: {
    brand: typeof marqueeLogos[0],
    language: string,
    scale: number,
    opacity: number
}) {
    const [imgError, setImgError] = useState(false)

    return (
        <Link
            href={`/brands/${brand.id}`}
            className="flex flex-col items-center gap-1 transition-all group"
            style={{
                transform: `scale(${scale})`,
                opacity,
                transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
        >
            <div className="w-24 h-12 flex items-center justify-center">
                {!imgError ? (
                    <img
                        src={`/brands/${brand.logoFile}`}
                        alt={brand.name}
                        onError={() => setImgError(true)}
                        className="w-full h-full object-contain transition-all duration-500 drop-shadow-sm"
                    />
                ) : (
                    <span className="text-lg font-black uppercase text-gray-400 group-hover:text-black transition-colors tracking-tighter">
                        {brand.name}
                    </span>
                )}
            </div>
        </Link>
    )
}

export function BrandMarquee() {
    const { t, language } = useLanguage()
    const [mounted, setMounted] = useState(false)
    const [centerIndex, setCenterIndex] = useState(0)

    useEffect(() => {
        setMounted(true)

        // Auto-rotate every 3 seconds
        const interval = setInterval(() => {
            setCenterIndex(prev => (prev + 1) % marqueeLogos.length)
        }, 3000)

        return () => clearInterval(interval)
    }, [])

    if (!mounted) return null;

    // Calculate scale and opacity for each item based on distance from center
    const getItemProps = (index: number) => {
        const distance = Math.abs(index - centerIndex)
        const normalizedDistance = Math.min(distance, marqueeLogos.length - distance)

        if (normalizedDistance === 0) return { scale: 1.0, opacity: 1.0 } // Center
        if (normalizedDistance === 1) return { scale: 0.7, opacity: 0.8 } // Adjacent
        return { scale: 0.5, opacity: 0.5 } // Outer
    }

    // Arrange items in circular order centered around centerIndex
    const getVisibleItems = () => {
        const items = []
        const visibleCount = 7 // Show 7 items total (3 left, 1 center, 3 right)
        const halfVisible = Math.floor(visibleCount / 2)

        for (let i = -halfVisible; i <= halfVisible; i++) {
            const index = (centerIndex + i + marqueeLogos.length) % marqueeLogos.length
            items.push({ brand: marqueeLogos[index], index, position: i })
        }

        return items
    }

    return (
        <div className="py-3 bg-white border-y border-gray-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 mb-2 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                    {language === 'ar' ? 'أخصائي معتمد لأرقى العلامات التجارية العالمية' : 'Authorized Specialist for Global Elite Brands'}
                </p>
            </div>

            <div className="relative flex items-center justify-center gap-4 h-16">
                {getVisibleItems().map(({ brand, index, position }) => {
                    const props = getItemProps(position + 3) // +3 to center the position
                    return (
                        <div key={`${brand.id}-${index}`} className="flex-shrink-0">
                            <BrandItem brand={brand} language={language} {...props} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
