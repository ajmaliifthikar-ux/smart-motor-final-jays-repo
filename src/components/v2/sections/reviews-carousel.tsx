'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Quote, ChevronRight, ChevronLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Review, googleBusiness } from '@/lib/google-business'
import { ReviewModal } from './review-modal'

export function ReviewsCarousel() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await googleBusiness.getReviews()
                setReviews(data)
            } catch (error) {
                console.error('Failed to load reviews', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchReviews()
    }, [])

    const slideNext = useCallback(() => {
        setDirection(1)
        setCurrentIndex((prev) => (prev + 1) % reviews.length)
    }, [reviews.length])

    const slidePrev = useCallback(() => {
        setDirection(-1)
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length)
    }, [reviews.length])

    // Auto-slide
    useEffect(() => {
        if (reviews.length === 0) return
        const interval = setInterval(slideNext, 8000)
        return () => clearInterval(interval)
    }, [slideNext, reviews.length])

    if (isLoading) return null

    // Helper to get visible reviews based on screen size
    const getVisibleReviews = () => {
        if (reviews.length === 0) return []
        const visible = []
        for (let i = 0; i < 3; i++) {
            visible.push(reviews[(currentIndex + i) % reviews.length])
        }
        return visible
    }

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9,
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1,
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0,
            scale: 0.9,
        }),
    }

    return (
        <section className="py-24 bg-[#FAFAF9] overflow-hidden technical-grid relative">
            <div className="absolute inset-0 micro-noise opacity-5" />
            
            <div className="container mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                    <div className="space-y-4 text-left">
                        <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] block">
                            Elite Performance Sentiment
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#121212] leading-none">
                            Verified <span className="text-[#E62329]">Client Logs</span>
                        </h2>
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((_, i) => (
                                    <Star key={i} className="fill-[#E62329] text-[#E62329] w-4 h-4" />
                                ))}
                            </div>
                            <span className="font-black text-[#121212] text-sm italic">4.9/5 Precision Rating</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-2 mr-4">
                            <button onClick={slidePrev} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#121212] hover:text-white transition-all">
                                <ChevronLeft size={20} />
                            </button>
                            <button onClick={slideNext} className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center hover:bg-[#121212] hover:text-white transition-all">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="bg-[#121212] text-white px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#E62329] transition-all shadow-xl hover:shadow-2xl flex items-center gap-3 group"
                        >
                            Submit Feedback
                            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>

                <ReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

                {/* Elastic Carousel */}
                <div className="relative mt-12 h-[500px] w-full flex items-center justify-center">
                    <div className="w-full flex gap-6 overflow-visible justify-center">
                        <AnimatePresence initial={false} custom={direction} mode="popLayout">
                            {/* Desktop: 3 Cards, Mobile: 1 Card */}
                            <motion.div 
                                key={currentIndex}
                                custom={direction}
                                variants={variants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{
                                    x: { type: "spring", stiffness: 300, damping: 30 },
                                    opacity: { duration: 0.2 },
                                    scale: { type: "spring", stiffness: 200, damping: 20 }
                                }}
                                className="flex gap-6 w-full justify-center"
                            >
                                {/* Mobile/Tablet View (1 or 2 cards depending on logic, but simplified to showing the window) */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                                    {getVisibleReviews().map((review, i) => (
                                        <div
                                            key={`${review.id}-${i}`}
                                            className={cn(
                                                "relative h-auto min-h-[350px] transition-all duration-500",
                                                i > 0 && "hidden md:block" // Hide 2nd and 3rd on mobile
                                            )}
                                        >
                                            <div className="w-full h-full relative overflow-hidden rounded-[2.5rem] bg-[#121212] carbon-fiber border border-white/5 shadow-2xl group/card">
                                                {/* Accent Red Bar */}
                                                <div className="absolute top-0 left-0 w-1.5 h-full bg-[#E62329] opacity-0 group-hover/card:opacity-100 transition-opacity" />
                                                
                                                <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex gap-1 mb-6">
                                                            {[...Array(review.rating)].map((_, i) => (
                                                                <Star key={i} size={16} className="fill-[#FFD700] text-[#FFD700]" />
                                                            ))}
                                                        </div>
                                                        <Quote size={32} className="text-white/5 absolute right-8 top-10 group-hover/card:text-[#E62329]/20 transition-colors" />
                                                        <p className="text-base font-medium text-white/90 leading-relaxed tracking-tight line-clamp-5 italic relative z-10 group-hover/card:silver-shine transition-all">
                                                            &quot;{review.text}&quot;
                                                        </p>
                                                    </div>

                                                    <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center p-1 overflow-hidden transition-colors group-hover/card:bg-[#E62329]/10">
                                                            <img 
                                                                src={review.avatar} 
                                                                alt={review.author} 
                                                                className="w-full h-full object-cover rounded-xl opacity-80 group-hover/card:opacity-100 transition-opacity"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-xs font-black text-white uppercase tracking-widest truncate group-hover/card:text-[#E62329]">
                                                                {review.author}
                                                            </h4>
                                                            <div className="flex items-center justify-between mt-1">
                                                                <span className="text-[7px] font-black text-[#E62329] uppercase tracking-widest">
                                                                    Verified Owner
                                                                </span>
                                                                <div className="flex items-center gap-1.5">
                                                                    <div className="flex items-center gap-1 bg-white rounded-full px-2 py-0.5 shadow-sm">
                                                                        <img src="/google-logo.svg" alt="Google" className="w-4 h-4" />
                                                                        <span className="text-[7px] text-gray-500 font-bold">{review.date}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

                {/* Progress Indicators */}
                <div className="flex justify-center gap-2 mt-12">
                    {reviews.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => {
                                setDirection(i > currentIndex ? 1 : -1)
                                setCurrentIndex(i)
                            }}
                            className={cn(
                                "h-1 rounded-full transition-all duration-500",
                                i === currentIndex ? "w-8 bg-[#E62329]" : "w-2 bg-gray-200"
                            )}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}
