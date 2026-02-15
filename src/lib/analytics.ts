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
        await (prisma as any).analyticsLog.create({
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
    const data = await (prisma as any).analyticsLog.groupBy({
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

    const logs = await (prisma as any).analyticsLog.findMany({
        where: {
            createdAt: {
                gte: sevenDaysAgo
            }
        },
        orderBy: {
            createdAt: 'asc'
        }
    })

    // Group by day (simplified for demo)
    const trends: Record<string, number> = {}
    logs.forEach((log: any) => {
        const date = log.createdAt.toISOString().split('T')[0]
        trends[date] = (trends[date] || 0) + 1
    })

    return Object.entries(trends).map(([date, count]) => ({ date, count }))
}
