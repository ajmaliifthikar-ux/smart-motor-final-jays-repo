'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Tooltip } from '@/components/ui/tooltip'
import { getBrandsWithModels } from '@/app/actions'
import { Loader2 } from 'lucide-react'

// Scale pattern for the 3D-like carousel effect
const DESKTOP_SCALES = [1.0, 1.2, 1.5, 1.8, 1.5, 1.2, 1.0]
const DESKTOP_VISIBLE = 7

const MOBILE_SCALES = [1.0, 1.4, 1.0]
const MOBILE_VISIBLE = 3

function getVisibleItems(centerIndex: number, count: number, total: number, brands: any[]) {
    if (total === 0) return []
    const half = Math.floor(count / 2)
    const items: { brand: any; slotIndex: number; originalIndex: number }[] = []

    for (let i = -half; i <= half; i++) {
        const originalIndex = ((centerIndex + i) % total + total) % total
        items.push({
            brand: brands[originalIndex],
            slotIndex: i + half,
            originalIndex,
        })
    }
    return items
}

function BrandSlot({
    brand,
    scale,
    isMobile,
}: {
    brand: any
    scale: number
    isMobile: boolean
}) {
    const [imgError, setImgError] = useState(false)
    const isCenter = scale >= 1.7
    const baseSize = isMobile ? 64 : 80

    return (
        <Tooltip content={`View ${brand.name} specialized care`} position="bottom">
            <Link
                href={`/brand/${brand.slug || brand.id}`}
                className="flex flex-col items-center justify-center group cursor-pointer"
                style={{
                    transform: `scale(${scale})`,
                    opacity: 0.5 + (scale - 1.0) * 0.625,
                    transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    width: isMobile ? 100 : 140,
                    flexShrink: 0,
                }}
            >
                <div
                    className="flex items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm group-hover:shadow-xl group-hover:border-[#E62329]/20 transition-all duration-500"
                    style={{ width: baseSize, height: baseSize, padding: 12 }}
                >
                    {!imgError && brand.logoFile ? (
                        <img
                            src={`/brands-carousel/${brand.logoFile}`}
                            alt={brand.name}
                            onError={() => setImgError(true)}
                            className="w-full h-full object-contain transition-all duration-700 group-hover:scale-110"
                            draggable={false}
                        />
                    ) : (
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-tighter text-center leading-tight">
                            {brand.name.substring(0, 3)}
                        </span>
                    )}
                </div>
                <span
                    className="mt-3 text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-[#E62329] transition-all text-center leading-tight italic"
                    style={{
                        opacity: isCenter ? 1 : 0.4,
                        transform: `translateY(${isCenter ? '0' : '4px'})`,
                    }}
                >
                    {brand.name}
                </span>
            </Link>
        </Tooltip>
    )
}

export function BrandCarousel() {
    const [brands, setBrands] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [centerIndex, setCenterIndex] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        async function fetchBrands() {
            try {
                const data = await getBrandsWithModels()
                // Focus on top luxury brands for the carousel or just use all
                setBrands(data)
            } catch (err) {
                console.error("Carousel fetch error:", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchBrands()
    }, [])

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const advance = useCallback(() => {
        if (brands.length === 0) return
        setCenterIndex(prev => (prev + 1) % brands.length)
    }, [brands.length])

    useEffect(() => {
        if (isPaused || brands.length === 0) return
        intervalRef.current = setInterval(advance, 3500)
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [advance, isPaused, brands.length])

    if (isLoading) {
        return (
            <div className="w-full py-20 flex flex-col items-center justify-center gap-4 bg-white">
                <Loader2 className="w-8 h-8 animate-spin text-gray-200" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-300">Synchronizing Marques</span>
            </div>
        )
    }

    const total = brands.length
    if (total === 0) return null

    const visibleCount = isMobile ? MOBILE_VISIBLE : DESKTOP_VISIBLE
    const scales = isMobile ? MOBILE_SCALES : DESKTOP_SCALES
    const visibleItems = getVisibleItems(centerIndex, visibleCount, total, brands)

    return (
        <div
            id="brands"
            className="relative w-full py-16 md:py-24 overflow-hidden bg-white technical-grid"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="absolute inset-0 micro-noise opacity-[0.03]" />
            
            <div className="max-w-7xl mx-auto px-6 mb-16 md:mb-20 text-center relative z-10">
                <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.5em] mb-4 block">
                    Luxury Heritage
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-[#121212] tracking-tighter uppercase italic leading-none">
                    Certified <span className="silver-shine">Specialists</span>
                </h2>
            </div>

            {/* Carousel Track */}
            <div className="flex items-center justify-center gap-4 md:gap-10 px-4 md:px-12 min-h-[180px] md:min-h-[220px] relative z-10">
                {visibleItems.map(({ brand, slotIndex }) => (
                    <BrandSlot
                        key={`${brand.id}-${slotIndex}`}
                        brand={brand}
                        scale={scales[slotIndex]}
                        isMobile={isMobile}
                    />
                ))}
            </div>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-12 md:mt-16 relative z-10">
                {brands.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCenterIndex(i)}
                        className={`transition-all duration-500 rounded-full ${
                            i === centerIndex
                                ? 'w-10 h-1.5 bg-[#E62329] shadow-lg shadow-[#E62329]/20'
                                : 'w-1.5 h-1.5 bg-gray-200 hover:bg-gray-400'
                        }`}
                        aria-label={`Focus ${brands[i].name}`}
                    />
                ))}
            </div>

            <div className="text-center mt-12 relative z-10">
                <Link
                    href="/services"
                    className="group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-[#121212] transition-all"
                >
                    Explore All Capabilities 
                    <div className="w-8 h-[1px] bg-gray-200 group-hover:w-12 group-hover:bg-[#E62329] transition-all duration-500" />
                </Link>
            </div>
        </div>
    )
}
