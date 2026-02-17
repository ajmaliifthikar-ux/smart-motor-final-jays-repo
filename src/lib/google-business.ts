export interface Review {
    id: string
    author: string
    avatar: string
    rating: number
    text: string
    date: string
    source: 'Google' | 'Manual'
    profileUrl?: string
}

export interface BusinessStats {
    rating: number
    totalReviews: number
    isOpen: boolean
    name: string
    address: string
    phone: string
    photoUrls: string[]
    placeId: string
}

// Fallback mock reviews (only used if API is completely unreachable)
const MOCK_REVIEWS: Review[] = [
    {
        id: 'mock-1',
        author: 'Mohammad Al',
        avatar: 'https://ui-avatars.com/api/?name=Mohammad+Al&background=E62329&color=fff',
        rating: 5,
        text: 'I recently visited Smart Motor Auto Services for a service package and to apply PPF on my Jeep, and the experience was exceptional. The team was highly professional and attentive.',
        date: '2 months ago',
        source: 'Google'
    },
    {
        id: 'mock-2',
        author: 'Daisy Rapania',
        avatar: 'https://ui-avatars.com/api/?name=Daisy+Rapania&background=121212&color=fff',
        rating: 5,
        text: 'I really appreciate the way they handle customers, specially the lady at the reception ms. Sahar. I like the way they communicate and keep you updated about the progress of your car.',
        date: '3 weeks ago',
        source: 'Google'
    },
    {
        id: 'mock-3',
        author: 'Emad AL-Manthari',
        avatar: 'https://ui-avatars.com/api/?name=Emad+AL-Manthari&background=E62329&color=fff',
        rating: 5,
        text: 'Smart Motor Auto Repair provided an outstanding experience! The team was incredibly helpful, kind, and professional. They clearly explained every step of the repair process.',
        date: 'a year ago',
        source: 'Google'
    },
    {
        id: 'mock-4',
        author: 'Naser Alsarawan',
        avatar: 'https://ui-avatars.com/api/?name=Naser+Alsarawan&background=121212&color=fff',
        rating: 5,
        text: 'A center worth a visit, wonderful reception and distinguished, fast service. They have everything related to the car, from repairs to cleaning.',
        date: 'a year ago',
        source: 'Google'
    },
]

const MOCK_STATS: BusinessStats = {
    rating: 4.6,
    totalReviews: 121,
    isOpen: true,
    name: 'Smart Motor Auto Repair',
    address: 'As Salami 1 St - Musaffah - M09 - Abu Dhabi',
    phone: '800 5445',
    photoUrls: [],
    placeId: 'ChIJpb7_vuBBXj4RpYogfw-RTLg',
}

export const googleBusiness = {
    /**
     * Fetch real reviews from our server-side Google Places API route.
     * Falls back to mock data if the API is unavailable.
     */
    getReviews: async (): Promise<Review[]> => {
        try {
            const baseUrl = typeof window !== 'undefined'
                ? ''
                : (process.env.NEXT_PUBLIC_APP_URL || 'https://smartmotorlatest.vercel.app')

            const res = await fetch(`${baseUrl}/api/google/reviews`, {
                next: { revalidate: 3600 },
            })

            if (!res.ok) {
                console.warn('Google reviews API returned', res.status, '— using fallback')
                return MOCK_REVIEWS
            }

            const data = await res.json()
            if (data.error || !data.reviews) return MOCK_REVIEWS

            return data.reviews as Review[]
        } catch (error) {
            console.error('Failed to fetch Google reviews:', error)
            return MOCK_REVIEWS
        }
    },

    /**
     * Fetch full business stats (rating, review count, open status, photos).
     * Used by dashboard widgets.
     */
    getBusinessStats: async (): Promise<BusinessStats> => {
        try {
            const baseUrl = typeof window !== 'undefined'
                ? ''
                : (process.env.NEXT_PUBLIC_APP_URL || 'https://smartmotorlatest.vercel.app')

            const res = await fetch(`${baseUrl}/api/google/reviews`, {
                next: { revalidate: 3600 },
            })

            if (!res.ok) return MOCK_STATS
            const data = await res.json()
            if (data.error) return MOCK_STATS

            return {
                rating: data.rating ?? MOCK_STATS.rating,
                totalReviews: data.totalReviews ?? MOCK_STATS.totalReviews,
                isOpen: data.openNow ?? MOCK_STATS.isOpen,
                name: data.name ?? MOCK_STATS.name,
                address: data.address ?? MOCK_STATS.address,
                phone: data.phone ?? MOCK_STATS.phone,
                photoUrls: data.photoUrls ?? [],
                placeId: data.placeId ?? MOCK_STATS.placeId,
            }
        } catch {
            return MOCK_STATS
        }
    },
}
