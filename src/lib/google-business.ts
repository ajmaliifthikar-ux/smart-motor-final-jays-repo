export interface Review {
    id: string
    author: string
    avatar: string
    rating: number
    text: string
    date: string
    source: 'Google' | 'Manual'
}

// Mock Data fallback
const MOCK_REVIEWS: Review[] = [
    {
        id: '1',
        author: 'Ahmed Al Mansoori',
        avatar: 'https://ui-avatars.com/api/?name=Ahmed+Al+Mansoori&background=E62329&color=fff',
        rating: 5,
        text: 'Exceptional service for my BMW X5. The team is professional and the pricing is very transparent compared to the agency.',
        date: '2 weeks ago',
        source: 'Google'
    },
    {
        id: '2',
        author: 'Jessica Miller',
        avatar: 'https://ui-avatars.com/api/?name=Jessica+Miller&background=121212&color=fff',
        rating: 5,
        text: 'Found them on Google and glad I did. Fixed the AC issue in my Audi A6 within a day. Highly recommended!',
        date: '1 month ago',
        source: 'Google'
    },
    {
        id: '3',
        author: 'Mohammed Saeed',
        avatar: 'https://ui-avatars.com/api/?name=Mohammed+Saeed&background=E62329&color=fff',
        rating: 4,
        text: 'Great mechanical work, but the waiting area could use better coffee. Overall very satisfied with the repair.',
        date: '3 weeks ago',
        source: 'Google'
    },
    {
        id: '4',
        author: 'Sarah Jenkins',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Jenkins&background=121212&color=fff',
        rating: 5,
        text: 'Trustworthy mechanics. They explained everything clearly and send video updates of the work being done.',
        date: '2 days ago',
        source: 'Google'
    }
]

export const googleBusiness = {
    getReviews: async (): Promise<Review[]> => {
        try {
            const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.GOOGLE_API_KEY
            const placeId = process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID || 'ChIJN1t_tDeuEmsRU' // Placeholder Place ID

            if (!apiKey || !placeId || placeId === 'PLACEHOLDER') {
                return MOCK_REVIEWS
            }

            // Using Google Places Details API (server-side usually, but for demo we show the logic)
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=reviews,rating&key=${apiKey}`
            )
            
            const data = await response.json()
            
            if (data.result?.reviews) {
                return data.result.reviews.map((r: any, i: number) => ({
                    id: `google-${i}`,
                    author: r.author_name,
                    avatar: r.profile_photo_url,
                    rating: r.rating,
                    text: r.text,
                    date: r.relative_time_description,
                    source: 'Google'
                }))
            }

            return MOCK_REVIEWS
        } catch (error) {
            console.error('Failed to fetch real Google reviews:', error)
            return MOCK_REVIEWS
        }
    }
}
