'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Review, googleBusiness } from '@/lib/google-business'

export function ReviewsCarousel() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [isLoading, setIsLoading] = useState(true)

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
        <section className="py-24 bg-[#FAFAF9] overflow-hidden">
            <div className="container mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-[#121212]">
                        Trusted by <span className="text-[#E62329]">Drivers</span>
                    </h2>
                    <div className="flex items-center justify-center gap-2">
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((_, i) => (
                                <Star key={i} className="fill-[#E62329] text-[#E62329] w-5 h-5" />
                            ))}
                        </div>
                        <span className="font-bold text-[#121212]">4.9/5</span>
                        <span className="text-gray-500 text-sm">(Based on 120+ Google Reviews)</span>
                    </div>
                </div>

                {/* Carousel (Simplified Grid for now, can be Marquee) */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative group hover:shadow-xl transition-all hover:-translate-y-1"
                        >
                            <Quote className="absolute top-6 right-6 text-gray-100 w-10 h-10 group-hover:text-[#E62329]/10 transition-colors" />

                            <div className="flex items-center gap-4 mb-6">
                                <img
                                    src={review.avatar}
                                    alt={review.author}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" // Fixed Avatar
                                />
                                <div>
                                    <h4 className="font-bold text-[#121212] text-sm">{review.author}</h4>
                                    <div className="flex gap-0.5">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <Star key={i} className="w-3 h-3 fill-[#E62329] text-[#E62329]" />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-4">
                                "{review.text}"
                            </p>

                            <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                <span>{review.date}</span>
                                <span className="flex items-center gap-1">
                                    <img src="/google-logo.svg" alt="Google" className="w-3 h-3 grayscale opacity-50" />
                                    Google
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    )
}
