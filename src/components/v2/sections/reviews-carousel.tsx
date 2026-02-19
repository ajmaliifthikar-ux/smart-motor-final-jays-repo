'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { Star, Quote, ChevronRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Review, googleBusiness } from '@/lib/google-business'
import { ReviewModal } from './review-modal'

// ─── timing ───────────────────────────────────────────────────────────────────
const PAUSE_MS   = 3200   // how long a card sits in the centre
const SLIDE_MS   = 620    // transition duration for the slide

// ─── card visual props per slot ───────────────────────────────────────────────
// Slots: -1 (left), 0 (centre), +1 (right)
// Cards outside ±1 are hidden (off-screen, for smooth entry/exit)
const SLOT_PROPS: Record<number, { scale: number; opacity: number; blur: number }> = {
    [-2]: { scale: 0.72, opacity: 0,    blur: 6   },  // entering from left (invisible)
    [-1]: { scale: 0.88, opacity: 0.55, blur: 2.5 },  // left visible card
    [ 0]: { scale: 1.12, opacity: 1,    blur: 0   },  // centre hero card
    [ 1]: { scale: 0.88, opacity: 0.55, blur: 2.5 },  // right visible card
    [ 2]: { scale: 0.72, opacity: 0,    blur: 6   },  // exiting to right (invisible)
}

function getSlotProps(slot: number) {
    return SLOT_PROPS[Math.max(-2, Math.min(2, slot))] ?? SLOT_PROPS[2]
}

// easeInOutCubic
function ease(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2
}

export function ReviewsCarousel() {
    const [reviews,     setReviews]     = useState<Review[]>([])
    const [isLoading,   setIsLoading]   = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isPaused,    setIsPaused]    = useState(false)

    // `centreIdx` — which review is currently in the centre slot
    const [centreIdx, setCentreIdx] = useState(0)

    // `slidePos` — continuous float: 0 = cards at rest, 1 = cards have moved one step left
    // We interpolate from 0→1 during a slide, then snap centreIdx+1 and reset to 0
    const [slidePos, setSlidePos] = useState(0)

    const slidingRef   = useRef(false)
    const pauseTimer   = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
    const rafRef       = useRef<number>(0)
    const isPausedRef  = useRef(false)
    isPausedRef.current = isPaused

    useEffect(() => {
        googleBusiness.getReviews()
            .then(setReviews)
            .catch(() => {})
            .finally(() => setIsLoading(false))
    }, [])

    const total = reviews.length

    // ── slide one step to the right (advance) ────────────────────────────────
    const slideBy = useCallback((dir: 1 | -1) => {
        if (slidingRef.current || total === 0) return
        slidingRef.current = true

        const startTime = performance.now()

        const tick = (now: number) => {
            const t = Math.min((now - startTime) / SLIDE_MS, 1)
            // dir=1 means cards slide left (next), dir=-1 means cards slide right (prev)
            setSlidePos(ease(t) * dir)

            if (t < 1) {
                rafRef.current = requestAnimationFrame(tick)
            } else {
                // Commit: advance centreIdx, reset slidePos to 0
                setCentreIdx(prev => ((prev + dir) % total + total) % total)
                setSlidePos(0)
                slidingRef.current = false
            }
        }

        rafRef.current = requestAnimationFrame(tick)
    }, [total])

    const next = useCallback(() => slideBy(1),  [slideBy])
    const prev = useCallback(() => slideBy(-1), [slideBy])

    // ── auto-advance: pause → slide → pause → slide … ────────────────────────
    useEffect(() => {
        if (total === 0) return
        const schedule = () => {
            pauseTimer.current = setTimeout(() => {
                if (!isPausedRef.current) slideBy(1)
                schedule()
            }, PAUSE_MS + SLIDE_MS)
        }
        schedule()
        return () => {
            clearTimeout(pauseTimer.current)
            cancelAnimationFrame(rafRef.current)
        }
    }, [total, slideBy])

    if (isLoading || total === 0) return null

    // ── which 5 reviews to render (slots -2 … +2) ────────────────────────────
    const slots = [-2, -1, 0, 1, 2] as const
    type SlotNum = typeof slots[number]

    return (
        <section
            className="py-24 bg-[#FAFAF9] overflow-hidden technical-grid relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="absolute inset-0 micro-noise opacity-5" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">

                {/* ── Header ─────────────────────────────────────────────── */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                    <div className="space-y-4">
                        <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] block">
                            Elite Performance Sentiment
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#121212] leading-none">
                            Verified <span className="text-[#E62329]">Client Logs</span>
                        </h2>
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                                {[1,2,3,4,5].map(i => (
                                    <Star key={i} className="fill-[#E62329] text-[#E62329] w-4 h-4" />
                                ))}
                            </div>
                            <span className="font-black text-[#121212] text-sm italic">4.9 / 5 · Google Verified</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={prev}
                            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#121212] hover:text-white hover:border-[#121212] transition-all">
                            <ChevronLeft size={20} />
                        </button>
                        <button onClick={next}
                            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#121212] hover:text-white hover:border-[#121212] transition-all">
                            <ChevronRight size={20} />
                        </button>
                        <button onClick={() => setIsModalOpen(true)}
                            className="ml-2 bg-[#121212] text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#E62329] transition-all shadow-xl flex items-center gap-2 group">
                            Leave a Review
                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <ReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

                {/* ── 3-card fixed-slot carousel ─────────────────────────── */}
                {/*
                    Layout: 3 visible slots (-1, 0, +1) centred in the container.
                    Slots -2 and +2 exist but are transparent — cards glide through them.
                    Each card is absolutely positioned at its slot's x offset.
                    `slidePos` (−1…+1) is added to the slot number so the whole deck
                    shifts left (next) or right (prev) during the animation.
                */}
                <div
                    className="relative w-full overflow-hidden select-none"
                    style={{ height: 480 }}
                >
                    {/* left/right fade masks */}
                    <div className="absolute inset-y-0 left-0  w-[22%] bg-gradient-to-r from-[#FAFAF9] to-transparent z-20 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-[22%] bg-gradient-to-l from-[#FAFAF9] to-transparent z-20 pointer-events-none" />

                    <div className="absolute inset-0 flex items-center justify-center">
                        {slots.map(slot => {
                            // Which review lives in this slot?
                            const reviewIdx = ((centreIdx + slot) % total + total) % total
                            const review    = reviews[reviewIdx]

                            // Visual position = slot offset + live slide displacement
                            // slidePos: 0=at rest, +1=slid left one step (next), -1=slid right one step (prev)
                            const visualSlot = slot - slidePos  // subtract because sliding left means visual pos moves left

                            // Interpolate visual props from the two nearest integer slots
                            const slotLow  = Math.floor(visualSlot)
                            const slotHigh = Math.ceil(visualSlot)
                            const frac     = visualSlot - slotLow

                            const propsLow  = getSlotProps(slotLow)
                            const propsHigh = getSlotProps(slotHigh)

                            const scale   = propsLow.scale   + (propsHigh.scale   - propsLow.scale)   * frac
                            const opacity = propsLow.opacity + (propsHigh.opacity - propsLow.opacity) * frac
                            const blur    = propsLow.blur    + (propsHigh.blur    - propsLow.blur)    * frac

                            // X position: each slot is 380px apart from centre
                            const SLOT_SPACING = 380
                            const xPx = visualSlot * SLOT_SPACING

                            // Is this card the centre hero right now?
                            const isHero = Math.abs(visualSlot) < 0.5

                            // Hide completely when beyond visible range
                            if (Math.abs(visualSlot) > 2.1) return null

                            return (
                                <div
                                    key={slot}
                                    className="absolute"
                                    style={{
                                        width: 340,
                                        left:  `calc(50% + ${xPx}px - 170px)`,
                                        top: 0, bottom: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        // No CSS transition — position driven by rAF slidePos state
                                        transform:  `scale(${scale.toFixed(4)})`,
                                        opacity:    opacity,
                                        filter:     blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none',
                                        zIndex:     isHero ? 10 : Math.abs(slot) === 1 ? 5 : 1,
                                        transformOrigin: 'center center',
                                        cursor: isHero ? 'default' : 'pointer',
                                        // Vertical lift for hero
                                        marginTop: isHero ? -12 : 0,
                                        transition: 'margin-top 0.4s ease',
                                    }}
                                    onClick={() => {
                                        if (!slidingRef.current && !isHero) {
                                            slideBy(slot > 0 ? 1 : -1)
                                        }
                                    }}
                                >
                                    <ReviewCard review={review} isHero={isHero} />
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* ── Dots ───────────────────────────────────────────────── */}
                <div className="flex justify-center gap-2 mt-10">
                    {reviews.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                if (!slidingRef.current) {
                                    const diff = ((i - centreIdx) % total + total) % total
                                    // go shortest path
                                    const dir = diff <= total / 2 ? 1 : -1
                                    // just snap directly for dot clicks — use centreIdx override
                                    setCentreIdx(i)
                                    setSlidePos(0)
                                    slidingRef.current = false
                                }
                            }}
                            className={cn(
                                'h-1.5 rounded-full transition-all duration-500',
                                i === centreIdx ? 'w-8 bg-[#E62329]' : 'w-2 bg-gray-300 hover:bg-gray-400'
                            )}
                        />
                    ))}
                </div>

            </div>
        </section>
    )
}

// ─── pure card, no animation deps ────────────────────────────────────────────
function ReviewCard({ review, isHero }: { review: Review; isHero: boolean }) {
    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-[2.5rem] bg-[#121212] carbon-fiber border w-full select-none',
                isHero
                    ? 'border-white/15 shadow-[0_0_80px_rgba(230,35,41,0.15),0_28px_60px_rgba(0,0,0,0.5)]'
                    : 'border-white/5 shadow-md'
            )}
            style={{ height: 370 }}
        >
            {/* red left accent bar — only on hero */}
            {isHero && (
                <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-[#E62329] to-[#a01418] rounded-l-[2.5rem]" />
            )}
            {/* top glow line */}
            {isHero && (
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#E62329]/50 to-transparent" />
            )}

            <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                <div>
                    <div className="flex gap-1 mb-5">
                        {Array.from({ length: review.rating }).map((_, i) => (
                            <Star key={i} size={14} className="fill-[#FFD700] text-[#FFD700]" />
                        ))}
                    </div>
                    <Quote size={26} className="text-white/5 absolute right-8 top-8" />
                    <p className="text-[14.5px] font-medium text-white/90 leading-relaxed tracking-tight line-clamp-5 italic">
                        &ldquo;{review.text}&rdquo;
                    </p>
                </div>

                <div className="flex items-center gap-3 pt-5 border-t border-white/10">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/10 flex-shrink-0">
                        <img src={review.avatar} alt={review.author} className="w-full h-full object-cover opacity-90" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-black text-white uppercase tracking-widest truncate">
                            {review.author}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[7px] font-black text-[#E62329] uppercase tracking-widest">
                                Verified Client
                            </span>
                            <div className="flex items-center gap-1 bg-white rounded-full px-2 py-0.5 shadow-sm ml-auto">
                                <img src="/google-logo.svg" alt="Google" className="w-3 h-3" />
                                <span className="text-[7px] text-gray-500 font-bold">{review.date}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
