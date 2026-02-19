'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Tooltip } from '@/components/ui/tooltip'

interface BrandItem {
    id: string
    name: string
    src: string
    slug: string
}

const SCALES = [1.0, 1.2, 1.5, 1.8, 1.5, 1.2, 1.0]
const OPACITIES = [0.3, 0.6, 0.8, 1.0, 0.8, 0.6, 0.3]
const BRIGHTNESS = [0.4, 0.6, 0.8, 1.0, 0.8, 0.6, 0.4]

export function AdvancedLogoSlider({ brands: initialBrands }: { brands?: BrandItem[] }) {
    const brands = initialBrands || []
    const [centerIndex, setCenterIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [containerWidth, setContainerWidth] = useState(1200)
    const containerRef = useRef<HTMLDivElement>(null)
    const total = brands.length

    if (total === 0) return null

    // Update container width for spacing calculations
    useEffect(() => {
        const updateWidth = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth)
            }
        }
        updateWidth()
        window.addEventListener('resize', updateWidth)
        return () => window.removeEventListener('resize', updateWidth)
    }, [])

    // Continuous auto-advance
    useEffect(() => {
        if (isPaused) return
        const interval = setInterval(() => {
            setCenterIndex(prev => (prev + 1) % total)
        }, 3000)
        return () => clearInterval(interval)
    }, [isPaused, total])

    // Calculate spacing based on specifications
    const spacing = useMemo(() => {
        const logoBaseWidth = containerWidth * 0.10
        const totalGap = containerWidth * 0.05
        return logoBaseWidth + totalGap
    }, [containerWidth])

    // Get the logos to show in the 7 slots
    const visibleItems = useMemo(() => {
        const items = []
        for (let i = -3; i <= 3; i++) {
            const index = (centerIndex + i + total) % total
            items.push({
                ...brands[index],
                slotIndex: i + 3,
                key: brands[index].id
            })
        }
        return items
    }, [centerIndex, total, brands])

    return (
        <section
            id="brands"
            className="relative w-full py-20 overflow-hidden bg-white"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
                <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] mb-3 block">
                    Elite Performance
                </span>
                <h2 className="text-3xl md:text-4xl font-black text-[#121212] tracking-tighter uppercase">
                    Trusted by <span className="silver-shine">Leading Brands</span>
                </h2>
            </div>

            <div
                ref={containerRef}
                className="relative h-40 flex items-center justify-center"
            >
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-white via-transparent to-white z-10" />

                <AnimatePresence initial={false} mode="popLayout">
                    {visibleItems.map((brand) => {
                        const slotIdx = brand.slotIndex
                        const xOffset = (slotIdx - 3) * spacing
                        const scale = SCALES[slotIdx]
                        const opacity = OPACITIES[slotIdx]
                        const brightness = BRIGHTNESS[slotIdx]

                        return (
                            <motion.div
                                key={brand.key}
                                initial={false}
                                animate={{
                                    x: xOffset,
                                    scale: scale,
                                    opacity: opacity,
                                    filter: `brightness(${brightness})`,
                                }}
                                transition={{
                                    duration: 0.8,
                                    ease: [0.4, 0.0, 0.2, 1], // Magnetic easing
                                }}
                                style={{
                                    position: 'absolute',
                                    left: '50%',
                                    x: '-50%',
                                }}
                                className="flex flex-col items-center justify-center cursor-pointer"
                            >
                                <Tooltip content={`View ${brand.name} services`} position="bottom">
                                    <Link
                                        href={`/brand/${brand.slug}`}
                                        className="group"
                                    >
                                        <div className="flex items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 shadow-sm group-hover:shadow-lg group-hover:border-gray-200 transition-all duration-300 w-20 h-20 md:w-24 md:h-24 p-4 md:p-5">
                                            <img
                                                src={brand.src}
                                                alt={brand.name}
                                                className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110"
                                                draggable={false}
                                            />
                                        </div>
                                        {slotIdx === 3 && (
                                            <motion.span
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#121212] block text-center"
                                            >
                                                {brand.name}
                                            </motion.span>
                                        )}
                                    </Link>
                                </Tooltip>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center gap-2 mt-16">
                {brands.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCenterIndex(i)}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-500",
                            i === centerIndex
                                ? "w-8 bg-[#E62329]"
                                : "w-2 bg-gray-200 hover:bg-gray-300"
                        )}
                        aria-label={`Go to ${brands[i].name}`}
                    />
                ))}
            </div>

            <div className="text-center mt-12">
                <button
                    onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-[#E62329] transition-all duration-300 group"
                >
                    View All Services
                    <span className="group-hover:translate-x-1 transition-transform" aria-hidden="true">&rarr;</span>
                </button>
            </div>
        </section>
    )
}
