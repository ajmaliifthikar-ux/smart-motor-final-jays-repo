'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Tooltip } from '@/components/ui/tooltip'

const carouselBrands = [
    { id: 'mercedes', name: 'Mercedes-Benz', src: '/brands-carousel/mercedes-logo.png', slug: 'mercedes' },
    { id: 'bmw', name: 'BMW', src: '/brands-carousel/bmw-logo.png', slug: 'bmw' },
    { id: 'audi', name: 'Audi', src: '/brands-carousel/audi-logo-150x150-1.png', slug: 'audi' },
    { id: 'porsche', name: 'Porsche', src: '/brands-carousel/porsche-logo.png', slug: 'porsche' },
    { id: 'bentley', name: 'Bentley', src: '/brands-carousel/bentley-logo-150x150-1.png', slug: 'bentley' },
    { id: 'land-rover', name: 'Range Rover', src: '/brands-carousel/land-rover-logo.png', slug: 'land-rover' },
    { id: 'ferrari', name: 'Ferrari', src: '/brands-carousel/ferrari-logo.png', slug: 'ferrari' },
    { id: 'lamborghini', name: 'Lamborghini', src: '/brands-carousel/lamborghini-logo-150x150-1.png', slug: 'lamborghini' },
    { id: 'rolls-royce', name: 'Rolls Royce', src: '/brands-carousel/rolls-royce-logo.png', slug: 'rolls-royce' },
    { id: 'maserati', name: 'Maserati', src: '/brands-carousel/maserati-logo.png', slug: 'maserati' },
    { id: 'mclaren', name: 'McLaren', src: '/brands-carousel/mclaren-logo.png', slug: 'mclaren' },
    { id: 'aston-martin', name: 'Aston Martin', src: '/brands-carousel/aston-martin-logo.png', slug: 'aston-martin' },
    { id: 'bugatti', name: 'Bugatti', src: '/brands-carousel/Bugatti-logo.png', slug: 'bugatti' },
    { id: 'jaguar', name: 'Jaguar', src: '/brands-carousel/jaguar-logo.png', slug: 'jaguar' },
    { id: 'lotus', name: 'Lotus', src: '/brands-carousel/lotus-logo.png', slug: 'lotus' },
    { id: 'cadillac', name: 'Cadillac', src: '/brands-carousel/cadillac.png', slug: 'cadillac' },
]

// Scale pattern: slot 1=1.0, 2=1.2, 3=1.5, 4=1.8 (center), 5=1.5, 6=1.2, 7=1.0
const DESKTOP_SCALES = [1.0, 1.2, 1.5, 1.8, 1.5, 1.2, 1.0]
const DESKTOP_VISIBLE = 7

// Mobile: 3 visible, center scaled
const MOBILE_SCALES = [1.0, 1.4, 1.0]
const MOBILE_VISIBLE = 3

function getVisibleItems(centerIndex: number, count: number, total: number) {
    const half = Math.floor(count / 2)
    const items: { brand: typeof carouselBrands[0]; slotIndex: number; originalIndex: number }[] = []

    for (let i = -half; i <= half; i++) {
        const originalIndex = ((centerIndex + i) % total + total) % total
        items.push({
            brand: carouselBrands[originalIndex],
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
    brand: typeof carouselBrands[0]
    scale: number
    isMobile: boolean
}) {
    const [imgError, setImgError] = useState(false)
    const isCenter = scale >= 1.7
    const baseSize = isMobile ? 64 : 80

    return (
        <Tooltip content={`View ${brand.name} services`} position="bottom">
            <Link
                href={`/new-home/brands#${brand.slug}`}
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
                    className="flex items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm group-hover:shadow-lg group-hover:border-gray-200 transition-all duration-300"
                    style={{ width: baseSize, height: baseSize, padding: 12 }}
                >
                    {!imgError ? (
                        <img
                            src={brand.src}
                            alt={brand.name}
                            onError={() => setImgError(true)}
                            className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110"
                            draggable={false}
                        />
                    ) : (
                        <span className="text-xs font-black uppercase text-gray-500 tracking-tighter text-center leading-tight">
                            {brand.name}
                        </span>
                    )}
                </div>
                <span
                    className="mt-2 text-[9px] font-black uppercase tracking-wider text-gray-400 group-hover:text-[#121212] transition-colors text-center leading-tight"
                    style={{
                        opacity: isCenter ? 1 : 0.6,
                        transition: 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                >
                    {brand.name}
                </span>
            </Link>
        </Tooltip>
    )
}

export function BrandCarousel() {
    const [centerIndex, setCenterIndex] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const [isPaused, setIsPaused] = useState(false)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const total = carouselBrands.length

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    const advance = useCallback(() => {
        setCenterIndex(prev => (prev + 1) % total)
    }, [total])

    // Auto-advance
    useEffect(() => {
        if (isPaused) return
        intervalRef.current = setInterval(advance, 3000)
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [advance, isPaused])

    const visibleCount = isMobile ? MOBILE_VISIBLE : DESKTOP_VISIBLE
    const scales = isMobile ? MOBILE_SCALES : DESKTOP_SCALES
    const visibleItems = getVisibleItems(centerIndex, visibleCount, total)

    return (
        <div
            id="brands"
            className="relative w-full py-10 md:py-14 overflow-hidden bg-white"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="max-w-7xl mx-auto px-6 mb-8 md:mb-10 text-center">
                <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-3 block">
                    Elite Performance
                </span>
                <h2 className="text-2xl md:text-3xl font-black text-[#121212] tracking-tighter uppercase">
                    Trusted by <span className="silver-shine">Leading Brands</span>
                </h2>
            </div>

            {/* Carousel Track */}
            <div className="flex items-center justify-center gap-2 md:gap-6 px-4 md:px-12 min-h-[140px] md:min-h-[160px]">
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
            <div className="flex justify-center gap-1.5 mt-6 md:mt-8">
                {carouselBrands.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCenterIndex(i)}
                        className={`rounded-full transition-all duration-300 ${
                            i === centerIndex
                                ? 'w-6 h-1.5 bg-[#E62329]'
                                : 'w-1.5 h-1.5 bg-gray-200 hover:bg-gray-400'
                        }`}
                        aria-label={`Go to ${carouselBrands[i].name}`}
                    />
                ))}
            </div>

            <div className="text-center mt-6 md:mt-8">
                <Link
                    href="/new-home/brands"
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#E62329] transition-colors border-b border-transparent hover:border-[#E62329] pb-0.5"
                >
                    View All Capabilities <span aria-hidden="true">&rarr;</span>
                </Link>
            </div>
        </div>
    )
}
