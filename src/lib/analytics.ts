import { prisma } from './prisma'
import { headers } from 'next/headers'

export type AnalyticsEventType = 'page_view' | 'click' | 'conversion' | 'lead'

export interface LogEventParams {
    eventType: AnalyticsEventType
    resource?: string
    metadata?: any
}

/**
 * Server-side utility to log analytics events
 * This should be called from Server Actions or Route Handlers
 */
export async function logEvent({ eventType, resource, metadata }: LogEventParams) {
    try {
        const headerList = await headers()
        const userAgent = headerList.get('user-agent') || 'unknown'

        // Basic Device Detection
        const isMobile = /mobile/i.test(userAgent)
        const device = isMobile ? 'mobile' : 'desktop'

        // Basic Browser Detection
        let browser = 'other'
        if (userAgent.includes('Chrome')) browser = 'Chrome'
        else if (userAgent.includes('Safari')) browser = 'Safari'
        else if (userAgent.includes('Firefox')) browser = 'Firefox'
        else if (userAgent.includes('Edge')) browser = 'Edge'

        // Geolocation Logic (Placeholder for real IP lookup)
        // In production, use a service like ip-api.com or Vercel's x-vercel-ip-city
        const emirate = headerList.get('x-vercel-ip-country-region') || 'Abu Dhabi' // Defaulting for MVP demo
        const city = headerList.get('x-vercel-ip-city') || 'Musaffah'

        // Log to database
        await prisma.analyticsLog.create({
            data: {
                eventType,
                resource,
                emirate,
                city,
                device,
                browser,
                metadata: metadata || {},
                // ipHash could be implemented here using a SHA-256 of the IP
            }
        })
    } catch (error) {
        console.error('Failed to log analytics event:', error)
    }
}

/**
 * Fetch aggregated data for the UAE Heatmap
 */
export async function getHeatmapData() {
    const data = await prisma.analyticsLog.groupBy({
        by: ['emirate'],
        _count: {
            _all: true
        }
    })

    return data.map((item: any) => ({
        emirate: item.emirate,
        count: item._count._all
    }))
}

/**
 * Fetch traffic trends for charts
 */
export async function getTrafficTrends() {
    // Last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    // Using raw SQL for efficient aggregation instead of fetching all rows
    const isProduction = process.env.NODE_ENV === 'production'


    let result: { date: string | Date, count: bigint }[]

    if (isProduction) {
        // MySQL (Production)
        // GreenGeeks uses MySQL. DATE() extracts the date part.
        result = await prisma.$queryRaw`
            SELECT DATE(createdAt) as date, COUNT(*) as count
            FROM AnalyticsLog
            WHERE createdAt >= ${sevenDaysAgo}
            GROUP BY DATE(createdAt)
            ORDER BY date ASC
        `
    } else {
        // SQLite (Development)
        // SQLite stores dates as unix timestamps (milliseconds) or strings depending on configuration.
        // Prisma default for SQLite is numeric timestamp (milliseconds).
        result = await prisma.$queryRaw`
            SELECT strftime('%Y-%m-%d', createdAt / 1000, 'unixepoch') as date, COUNT(*) as count
            FROM AnalyticsLog
            WHERE createdAt >= ${sevenDaysAgo}
            GROUP BY date
            ORDER BY date ASC
        `
    }

    // Map BigInt count to number and ensure date is formatted as YYYY-MM-DD string
    return result.map(r => ({
        date: typeof r.date === 'string' ? r.date : (r.date as Date).toISOString().split('T')[0],
        count: Number(r.count)
    }))
}
