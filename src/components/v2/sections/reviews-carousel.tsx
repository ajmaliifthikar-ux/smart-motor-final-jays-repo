'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Review, googleBusiness } from '@/lib/google-business'
import { ReviewModal } from './review-modal'

export function ReviewsCarousel() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)

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

    if (isLoading) return null

    return (
        <section className="py-24 bg-[#FAFAF9] overflow-hidden technical-grid relative">
            <div className="absolute inset-0 micro-noise opacity-5" />
            
            <div className="container mx-auto px-6 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
                    <div className="space-y-4 text-left">
                        <span className="text-[#E62329] font-black text-[10px] uppercase tracking-[0.4em] block">
                            Customer Satisfaction
                        </span>
                        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#121212] leading-none">
                            Verified <span className="text-[#E62329]">Reviews</span>
                        </h2>
                        <div className="flex items-center gap-3">
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((_, i) => (
                                    <Star key={i} className="fill-[#E62329] text-[#E62329] w-4 h-4" />
                                ))}
                            </div>
                            <span className="font-black text-[#121212] text-sm">4.9/5 Elite Rating</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#121212] text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#E62329] transition-all shadow-xl hover:shadow-2xl flex items-center gap-3 group"
                    >
                        Write a Review
                        <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>

                <ReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

                {/* Carousel - Stacked Look Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="relative h-[380px] group"
                        >
                            <div className="w-full h-full relative overflow-hidden rounded-[3rem] shadow-precision">
                                <div className="absolute inset-0 silver-shine rounded-[3rem] z-0" />
                                <div className="relative z-10 p-10 h-full flex flex-col justify-between carbon-fiber rounded-[2.2rem] border border-white/5 shadow-2xl transition-transform group-hover:scale-[0.99] duration-500">
                                    <div>
                                        <div className="flex gap-1 mb-8">
                                            {[...Array(review.rating)].map((_, i) => (
                                                <Star key={i} size={14} className="fill-[#E62329] text-[#E62329]" />
                                            ))}
                                        </div>
                                        <p className="text-lg font-medium text-white/90 leading-relaxed tracking-tight line-clamp-5">
                                            &quot;{review.text}&quot;
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6 pt-10 border-t border-white/10">
                                        <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-white p-1 overflow-hidden">
                                            <img 
                                                src={review.avatar} 
                                                alt={review.author} 
                                                className="w-full h-full object-cover rounded-2xl opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-lg font-black text-white uppercase tracking-tighter truncate">
                                                {review.author}
                                            </h4>
                                            <div className="flex items-center justify-between mt-1">
                                                <span className="text-[10px] font-black text-[#E62329] uppercase tracking-widest bg-[#E62329]/5 px-3 py-1 rounded-full border border-[#E62329]/10">
                                                    Verified Client
                                                </span>
                                                <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity">
                                                    <img src="/google-logo.svg" alt="Google" className="w-3 h-3 grayscale invert" />
                                                    <span className="text-[8px] text-white font-bold uppercase">{review.date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    )
}
