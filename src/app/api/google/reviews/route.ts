import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Cache for 1 hour

export interface GoogleReview {
    id: string
    author: string
    avatar: string
    rating: number
    text: string
    date: string
    source: 'Google'
    profileUrl?: string
}

export interface GoogleBusinessData {
    name: string
    rating: number
    totalReviews: number
    address: string
    phone: string
    isOpen: boolean
    openNow?: boolean
    placeId: string
    reviews: GoogleReview[]
    photoUrls: string[]
}

const PLACE_ID = process.env.GOOGLE_PLACE_ID || 'ChIJpb7_vuBBXj4RpYogfw-RTLg'
const API_KEY = process.env.GOOGLE_PLACES_API_KEY

export async function GET() {
    if (!API_KEY) {
        return NextResponse.json({ error: 'Google Places API key not configured' }, { status: 500 })
    }

    try {
        const fields = [
            'name', 'rating', 'user_ratings_total',
            'reviews', 'formatted_address',
            'formatted_phone_number', 'opening_hours', 'photos'
        ].join(',')

        const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=${fields}&reviews_sort=newest&key=${API_KEY}`
        const res = await fetch(url, { next: { revalidate: 3600 } })
        const data = await res.json()

        if (data.status !== 'OK' || !data.result) {
            console.error('Google Places API error:', data.status, data.error_message)
            return NextResponse.json({ error: 'Places API error', status: data.status }, { status: 502 })
        }

        const place = data.result

        // Build photo URLs (max 6)
        const photoUrls: string[] = (place.photos || []).slice(0, 6).map((p: { photo_reference: string }) =>
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${p.photo_reference}&key=${API_KEY}`
        )

        // Map Google reviews
        const reviews: GoogleReview[] = (place.reviews || []).map((r: {
            author_name: string
            profile_photo_url?: string
            rating: number
            text: string
            relative_time_description: string
            author_url?: string
        }, i: number) => ({
            id: `google-${i}-${Date.now()}`,
            author: r.author_name,
            avatar: r.profile_photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(r.author_name)}&background=E62329&color=fff`,
            rating: r.rating,
            text: r.text,
            date: r.relative_time_description,
            source: 'Google' as const,
            profileUrl: r.author_url,
        }))

        const businessData: GoogleBusinessData = {
            name: place.name || 'Smart Motor Auto Repair',
            rating: place.rating || 0,
            totalReviews: place.user_ratings_total || 0,
            address: place.formatted_address || '',
            phone: place.formatted_phone_number || '',
            isOpen: place.opening_hours?.open_now ?? false,
            openNow: place.opening_hours?.open_now ?? false,
            placeId: PLACE_ID,
            reviews,
            photoUrls,
        }

        return NextResponse.json(businessData)
    } catch (error) {
        console.error('Google reviews fetch error:', error)
        return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
    }
}
