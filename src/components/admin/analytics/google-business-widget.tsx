'use client'

import { useEffect, useState } from 'react'
import { Star, TrendingUp, MapPin, Phone, Clock, ExternalLink, RefreshCw, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { GoogleBusinessData } from '@/app/api/google/reviews/route'

function StarRating({ rating, size = 14 }: { rating: number; size?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(i => (
                <svg key={i} width={size} height={size} viewBox="0 0 24 24" fill={i <= rating ? '#FFD700' : '#D1D5DB'}>
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
            ))}
        </div>
    )
}

export function GoogleBusinessWidget() {
    const [data, setData] = useState<GoogleBusinessData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [reviewPage, setReviewPage] = useState(0)
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

    const fetchData = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const res = await fetch('/api/google/reviews', { cache: 'no-store' })
            if (!res.ok) throw new Error(`API error ${res.status}`)
            const json = await res.json()
            if (json.error) throw new Error(json.error)
            setData(json)
            setLastUpdated(new Date())
        } catch (e: any) {
            setError(e.message || 'Failed to load')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => { fetchData() }, [])

    const reviews = data?.reviews ?? []
    const currentReview = reviews[reviewPage]
    const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
        stars,
        count: reviews.filter(r => r.rating === stars).length,
        pct: reviews.length > 0 ? (reviews.filter(r => r.rating === stars).length / reviews.length) * 100 : 0,
    }))

    return (
        <div className="rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-sm">
            {/* Header */}
            <div className="bg-[#121212] px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center p-1.5 shadow">
                        <img src="/google-logo.svg" alt="Google" className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <p className="text-white font-black text-sm uppercase tracking-widest">Google Business</p>
                        <p className="text-white/40 text-[10px] font-medium">Live performance data</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {data?.placeId && (
                        <a
                            href={`https://www.google.com/maps/place/?q=place_id:${data.placeId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors"
                            title="View on Google Maps"
                        >
                            <ExternalLink size={14} />
                        </a>
                    )}
                    <button
                        onClick={fetchData}
                        disabled={isLoading}
                        className="p-2 rounded-xl bg-white/10 text-white/60 hover:text-white hover:bg-white/20 transition-colors disabled:opacity-40"
                        title="Refresh data"
                    >
                        <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
                {isLoading && !data ? (
                    <div className="h-48 flex items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <RefreshCw size={24} className="animate-spin text-gray-300" />
                            <p className="text-sm text-gray-400 font-medium">Fetching live data...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="h-48 flex items-center justify-center">
                        <div className="text-center space-y-3">
                            <p className="text-sm text-red-500 font-medium">{error}</p>
                            <button onClick={fetchData} className="text-xs text-[#E62329] font-black uppercase tracking-widest hover:underline">
                                Retry
                            </button>
                        </div>
                    </div>
                ) : data && (
                    <>
                        {/* Big Rating + Status */}
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-5xl font-black text-[#121212] leading-none">{data.rating.toFixed(1)}</span>
                                    <span className="text-lg text-gray-400 font-medium">/5</span>
                                </div>
                                <StarRating rating={Math.round(data.rating)} size={16} />
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1.5">
                                    {data.totalReviews.toLocaleString()} verified reviews
                                </p>
                            </div>
                            <div className="text-right space-y-2">
                                {/* Open/Closed badge */}
                                <div className={cn(
                                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest',
                                    data.openNow
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : 'bg-red-50 text-red-600 border border-red-200'
                                )}>
                                    <span className={cn('w-1.5 h-1.5 rounded-full', data.openNow ? 'bg-green-500' : 'bg-red-500')} />
                                    {data.openNow ? 'Open Now' : 'Closed'}
                                </div>
                                <div className="flex items-center gap-1 justify-end text-gray-400">
                                    <TrendingUp size={12} className="text-green-500" />
                                    <span className="text-[10px] font-bold">Top rated in Abu Dhabi</span>
                                </div>
                            </div>
                        </div>

                        {/* Rating Distribution */}
                        <div className="space-y-2">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rating Breakdown</p>
                            {ratingDistribution.map(({ stars, count, pct }) => (
                                <div key={stars} className="flex items-center gap-3">
                                    <span className="text-[10px] font-bold text-gray-500 w-4 text-right">{stars}</span>
                                    <Star size={10} className="fill-[#FFD700] text-[#FFD700] flex-shrink-0" />
                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-[#FFD700] rounded-full transition-all duration-1000"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 w-6 text-right">{count}</span>
                                </div>
                            ))}
                        </div>

                        {/* Business Info */}
                        <div className="bg-gray-50 rounded-2xl p-4 space-y-2.5">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Business Info</p>
                            <div className="flex items-start gap-2.5">
                                <MapPin size={13} className="text-[#E62329] flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-gray-600 font-medium leading-relaxed">{data.address}</span>
                            </div>
                            {data.phone && (
                                <div className="flex items-center gap-2.5">
                                    <Phone size={13} className="text-[#E62329] flex-shrink-0" />
                                    <a href={`tel:${data.phone.replace(/\s/g, '')}`} className="text-xs text-gray-600 font-medium hover:text-[#E62329] transition-colors">
                                        {data.phone}
                                    </a>
                                </div>
                            )}
                            <div className="flex items-center gap-2.5">
                                <Clock size={13} className="text-[#E62329] flex-shrink-0" />
                                <span className="text-xs text-gray-600 font-medium">Mon–Sat 8:00 AM – 7:00 PM</span>
                            </div>
                        </div>

                        {/* Latest Review Carousel */}
                        {reviews.length > 0 && (
                            <div className="bg-[#121212] rounded-2xl p-5 relative">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Latest Reviews</p>
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            onClick={() => setReviewPage(p => Math.max(0, p - 1))}
                                            disabled={reviewPage === 0}
                                            className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white disabled:opacity-30 transition-all"
                                        >
                                            <ChevronLeft size={12} />
                                        </button>
                                        <span className="text-[9px] font-bold text-white/40">{reviewPage + 1}/{reviews.length}</span>
                                        <button
                                            onClick={() => setReviewPage(p => Math.min(reviews.length - 1, p + 1))}
                                            disabled={reviewPage === reviews.length - 1}
                                            className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white disabled:opacity-30 transition-all"
                                        >
                                            <ChevronRight size={12} />
                                        </button>
                                    </div>
                                </div>

                                {currentReview && (
                                    <div className="space-y-3">
                                        <Quote size={20} className="text-[#E62329]/30" />
                                        <p className="text-white/80 text-xs leading-relaxed line-clamp-3 font-medium italic">
                                            &ldquo;{currentReview.text}&rdquo;
                                        </p>
                                        <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                            <div className="flex items-center gap-2.5">
                                                <img
                                                    src={currentReview.avatar}
                                                    alt={currentReview.author}
                                                    className="w-8 h-8 rounded-xl object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentReview.author)}&background=E62329&color=fff`
                                                    }}
                                                />
                                                <div>
                                                    <p className="text-[10px] font-black text-white uppercase tracking-wider">{currentReview.author}</p>
                                                    <StarRating rating={currentReview.rating} size={10} />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 bg-white rounded-full px-2 py-1">
                                                <img src="/google-logo.svg" alt="Google" className="w-3 h-3" />
                                                <span className="text-[8px] text-gray-500 font-bold">{currentReview.date}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Photo strip (if available) */}
                        {data.photoUrls && data.photoUrls.length > 0 && (
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Google Photos</p>
                                <div className="grid grid-cols-3 gap-2">
                                    {data.photoUrls.slice(0, 6).map((url, i) => (
                                        <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                                            <img
                                                src={url}
                                                alt={`Smart Motor photo ${i + 1}`}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Last updated */}
                        {lastUpdated && (
                            <p className="text-[9px] text-gray-300 text-center font-medium">
                                Last synced: {lastUpdated.toLocaleTimeString()}
                            </p>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}
