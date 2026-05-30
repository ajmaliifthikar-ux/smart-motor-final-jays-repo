import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const API_KEY = process.env.GOOGLE_PLACES_API_KEY

export async function GET(request: NextRequest) {
    if (!API_KEY) {
        return new NextResponse('Google Places API key not configured', { status: 500 })
    }

    const { searchParams } = new URL(request.url)
    const ref = searchParams.get('ref')
    const maxwidth = searchParams.get('maxwidth') || '800'

    if (!ref) {
        return new NextResponse('Missing photo reference', { status: 400 })
    }

    try {
        const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photo_reference=${ref}&key=${API_KEY}`
        const res = await fetch(url)

        if (!res.ok) {
            console.error('Google photo proxy failed with status:', res.status)
            return new NextResponse('Proxy error', { status: 502 })
        }

        const buffer = await res.arrayBuffer()

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                'Content-Type': res.headers.get('content-type') || 'image/jpeg',
                'Cache-Control': 'public, max-age=86400, stale-while-revalidate=43200',
            },
        })
    } catch (error) {
        console.error('Google photo proxy error:', error)
        return new NextResponse('Internal error', { status: 500 })
    }
}
