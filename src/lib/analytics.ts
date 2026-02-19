import { createAnalyticsLog, getAnalyticsLogs } from './firebase-db'
import { headers } from 'next/headers'

export type AnalyticsEventType = 'page_view' | 'click' | 'conversion' | 'lead' | 'FAQ_VIEW'

export interface LogEventParams {
    eventType: AnalyticsEventType
    resource?: string
    metadata?: any
}

export async function logEvent({ eventType, resource, metadata }: LogEventParams) {
    try {
        const headerList = await headers()
        const userAgent = headerList.get('user-agent') || 'unknown'

        const isMobile = /mobile/i.test(userAgent)
        const device = isMobile ? 'mobile' : 'desktop'

        let browser = 'other'
        if (userAgent.includes('Chrome')) browser = 'Chrome'
        else if (userAgent.includes('Safari')) browser = 'Safari'
        else if (userAgent.includes('Firefox')) browser = 'Firefox'
        else if (userAgent.includes('Edge')) browser = 'Edge'

        const emirate = headerList.get('x-vercel-ip-country-region') || 'Abu Dhabi'
        const city = headerList.get('x-vercel-ip-city') || 'Musaffah'

        await createAnalyticsLog({
            eventType,
            resource,
            emirate,
            city,
            device,
            browser,
            metadata: metadata || {},
        })
    } catch (error) {
        console.error('Failed to log analytics event:', error)
    }
}

export async function getHeatmapData() {
    const logs = await getAnalyticsLogs(500)
    const emirateCounts: Record<string, number> = {}
    
    logs.forEach(log => {
        if (log.emirate) {
            emirateCounts[log.emirate] = (emirateCounts[log.emirate] || 0) + 1
        }
    })

    return Object.entries(emirateCounts).map(([emirate, count]) => ({
        emirate,
        count
    }))
}

export async function getTrafficTrends() {
    const logs = await getAnalyticsLogs(500)
    const dailyCounts: Record<string, number> = {}
    
    // Last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    logs.forEach(log => {
        const date = log.createdAt.toDate().toISOString().split('T')[0]
        if (log.createdAt.toDate() >= sevenDaysAgo) {
            dailyCounts[date] = (dailyCounts[date] || 0) + 1
        }
    })

    return Object.entries(dailyCounts)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({
            date,
            count
        }))
}
