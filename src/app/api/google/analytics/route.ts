import { NextRequest, NextResponse } from 'next/server'
import { BetaAnalyticsDataClient } from '@google-analytics/data'

export const dynamic = 'force-dynamic'

const PROPERTY_ID = process.env.GA4_PROPERTY_ID

// ─── Helper: build GA4 client ────────────────────────────────────────────────
function getClient() {
  // Uses GOOGLE_APPLICATION_CREDENTIALS env or inline credentials
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL

  if (privateKey && clientEmail) {
    return new BetaAnalyticsDataClient({
      credentials: { client_email: clientEmail, private_key: privateKey },
    })
  }
  // Fallback: GOOGLE_APPLICATION_CREDENTIALS file
  return new BetaAnalyticsDataClient()
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
function dateRange(days: number) {
  return { startDate: `${days}daysAgo`, endDate: 'today' }
}

export async function GET(req: NextRequest) {
  if (!PROPERTY_ID) {
    // Return mock data so the dashboard renders without GA4 property configured
    return NextResponse.json(getMockData())
  }

  try {
    const client = getClient()
    const property = `properties/${PROPERTY_ID}`

    // Run all reports in parallel
    const [
      overviewRes,
      channelsRes,
      pagesRes,
      devicesRes,
      countriesRes,
      dailyRes,
    ] = await Promise.all([
      // 1 — Overview: sessions, users, bounce rate, avg session duration
      client.runReport({
        property,
        dateRanges: [dateRange(30)],
        metrics: [
          { name: 'sessions' },
          { name: 'activeUsers' },
          { name: 'newUsers' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
          { name: 'screenPageViews' },
          { name: 'conversions' },
        ],
      }),

      // 2 — Traffic channels
      client.runReport({
        property,
        dateRanges: [dateRange(30)],
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 8,
      }),

      // 3 — Top pages
      client.runReport({
        property,
        dateRanges: [dateRange(30)],
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }, { name: 'averageSessionDuration' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),

      // 4 — Device category
      client.runReport({
        property,
        dateRanges: [dateRange(30)],
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      }),

      // 5 — Countries
      client.runReport({
        property,
        dateRanges: [dateRange(30)],
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 8,
      }),

      // 6 — Daily traffic (last 30 days)
      client.runReport({
        property,
        dateRanges: [dateRange(30)],
        dimensions: [{ name: 'date' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      }),
    ])

    // ─── Parse overview ────────────────────────────────────────────────────
    const ov = overviewRes[0]?.rows?.[0]?.metricValues ?? []
    const overview = {
      sessions: Number(ov[0]?.value ?? 0),
      activeUsers: Number(ov[1]?.value ?? 0),
      newUsers: Number(ov[2]?.value ?? 0),
      bounceRate: parseFloat(ov[3]?.value ?? '0'),
      avgSessionDuration: parseFloat(ov[4]?.value ?? '0'),
      pageViews: Number(ov[5]?.value ?? 0),
      conversions: Number(ov[6]?.value ?? 0),
    }

    // ─── Parse channels ────────────────────────────────────────────────────
    const channels = (channelsRes[0]?.rows ?? []).map((r: any) => ({
      channel: r.dimensionValues?.[0]?.value ?? 'Unknown',
      sessions: Number(r.metricValues?.[0]?.value ?? 0),
      users: Number(r.metricValues?.[1]?.value ?? 0),
    }))

    // ─── Parse pages ───────────────────────────────────────────────────────
    const pages = (pagesRes[0]?.rows ?? []).map((r: any) => ({
      path: r.dimensionValues?.[0]?.value ?? '/',
      views: Number(r.metricValues?.[0]?.value ?? 0),
      users: Number(r.metricValues?.[1]?.value ?? 0),
      avgDuration: parseFloat(r.metricValues?.[2]?.value ?? '0'),
    }))

    // ─── Parse devices ─────────────────────────────────────────────────────
    const devices = (devicesRes[0]?.rows ?? []).map((r: any) => ({
      device: r.dimensionValues?.[0]?.value ?? 'unknown',
      sessions: Number(r.metricValues?.[0]?.value ?? 0),
      users: Number(r.metricValues?.[1]?.value ?? 0),
    }))

    // ─── Parse countries ───────────────────────────────────────────────────
    const countries = (countriesRes[0]?.rows ?? []).map((r: any) => ({
      country: r.dimensionValues?.[0]?.value ?? 'Unknown',
      sessions: Number(r.metricValues?.[0]?.value ?? 0),
      users: Number(r.metricValues?.[1]?.value ?? 0),
    }))

    // ─── Parse daily ───────────────────────────────────────────────────────
    const daily = (dailyRes[0]?.rows ?? []).map((r: any) => {
      const raw = r.dimensionValues?.[0]?.value ?? '20260101'
      const date = `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`
      return {
        date,
        sessions: Number(r.metricValues?.[0]?.value ?? 0),
        users: Number(r.metricValues?.[1]?.value ?? 0),
      }
    })

    return NextResponse.json({ overview, channels, pages, devices, countries, daily, source: 'ga4' })
  } catch (error: any) {
    console.error('GA4 Reporting API error:', error?.message)
    // Return mock data on error so dashboard still renders
    return NextResponse.json({ ...getMockData(), source: 'mock', error: error?.message })
  }
}

// ─── Mock data — shown when GA4 property not yet configured ──────────────────
function getMockData() {
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (29 - i))
    return d.toISOString().split('T')[0]
  })

  return {
    source: 'mock',
    overview: {
      sessions: 1842,
      activeUsers: 1203,
      newUsers: 876,
      bounceRate: 0.42,
      avgSessionDuration: 156,
      pageViews: 4920,
      conversions: 48,
    },
    channels: [
      { channel: 'Organic Search', sessions: 782, users: 634 },
      { channel: 'Direct', sessions: 521, users: 410 },
      { channel: 'Social', sessions: 312, users: 254 },
      { channel: 'Referral', sessions: 148, users: 98 },
      { channel: 'Paid Search', sessions: 79, users: 68 },
    ],
    pages: [
      { path: '/new-home', views: 1240, users: 890, avgDuration: 145 },
      { path: '/new-home/packages', views: 720, users: 510, avgDuration: 198 },
      { path: '/new-home/services', views: 640, users: 420, avgDuration: 163 },
      { path: '/new-home/brands', views: 480, users: 360, avgDuration: 112 },
      { path: '/careers', views: 310, users: 280, avgDuration: 89 },
    ],
    devices: [
      { device: 'mobile', sessions: 1104, users: 720 },
      { device: 'desktop', sessions: 627, users: 412 },
      { device: 'tablet', sessions: 111, users: 71 },
    ],
    countries: [
      { country: 'United Arab Emirates', sessions: 1480, users: 962 },
      { country: 'Saudi Arabia', sessions: 142, users: 98 },
      { country: 'India', sessions: 98, users: 76 },
      { country: 'United Kingdom', sessions: 62, users: 48 },
      { country: 'United States', sessions: 60, users: 19 },
    ],
    daily: days.map((date, i) => ({
      date,
      sessions: Math.floor(40 + Math.random() * 80 + (i > 20 ? 20 : 0)),
      users: Math.floor(25 + Math.random() * 55 + (i > 20 ? 15 : 0)),
    })),
  }
}
