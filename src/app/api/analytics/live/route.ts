import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import {
  getQRAnalyticsSummary,
  getURLAnalyticsSummary,
  getAnalyticsByDateRange,
} from '@/lib/firebase-db'
import { z } from 'zod'

// Validation schema
const analyticsQuerySchema = z.object({
  type: z.enum(['qr', 'url', 'all', 'summary']).optional().default('all'),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

export async function GET(request: NextRequest) {
  try {
    // Check authentication (admin only)
    const session = await auth()
    if (!session || (session as any).role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const rawQuery = {
      type: searchParams.get('type') || 'all',
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
    }

    // Validate input
    const query = analyticsQuerySchema.parse(rawQuery)

    // Set default date range to last 30 days if not provided
    const endDate = query.endDate ? new Date(query.endDate) : new Date()
    const startDate = query.startDate
      ? new Date(query.startDate)
      : new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Fetch analytics based on type
    let analytics: any = {}

    if (query.type === 'summary' || query.type === 'all') {
      // Get summary data
      const qrSummary = await getQRAnalyticsSummary()
      const urlSummary = await getURLAnalyticsSummary()

      analytics.summary = {
        qr: {
          total: qrSummary.totalQRCodes,
          scans: qrSummary.totalScans,
          topQRCodes: qrSummary.topQRCodes,
        },
        url: {
          total: urlSummary.totalURLs,
          clicks: urlSummary.totalClicks,
          topURLs: urlSummary.topURLs,
        },
      }

      if (query.type === 'summary') {
        return NextResponse.json(analytics, { status: 200 })
      }
    }

    if (query.type === 'qr' || query.type === 'all') {
      // Get detailed QR analytics by date range
      const dateRangeData = await getAnalyticsByDateRange(startDate, endDate)
      analytics.qr = {
        total: dateRangeData.qrAnalytics.length,
        scans: dateRangeData.summary.totalQRScans,
        data: dateRangeData.qrAnalytics,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
      }

      if (query.type === 'qr') {
        return NextResponse.json(analytics, { status: 200 })
      }
    }

    if (query.type === 'url' || query.type === 'all') {
      // Get detailed URL analytics by date range
      const dateRangeData = await getAnalyticsByDateRange(startDate, endDate)
      analytics.url = {
        total: dateRangeData.urlAnalytics.length,
        clicks: dateRangeData.summary.totalURLClicks,
        data: dateRangeData.urlAnalytics,
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
      }

      if (query.type === 'url') {
        return NextResponse.json(analytics, { status: 200 })
      }
    }

    return NextResponse.json(analytics, { status: 200 })
  } catch (error) {
    console.error('Analytics API error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: error.issues,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}
