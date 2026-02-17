'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Loader2, Link2, TrendingUp } from 'lucide-react'

interface URLAnalytics {
  id: string
  shortCode: string
  originalUrl: string
  clicks: number
  created: any
}

interface URLSummary {
  totalURLs: number
  totalClicks: number
  topURLs: URLAnalytics[]
}

export function URLAnalyticsWidget() {
  const [analytics, setAnalytics] = useState<URLSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAnalytics()
    // Refresh every 30 seconds for live updates
    const interval = setInterval(fetchAnalytics, 30000)
    return () => clearInterval(interval)
  }, [])

  async function fetchAnalytics() {
    try {
      setLoading(true)
      const response = await fetch('/api/analytics/live?type=summary')
      if (!response.ok) throw new Error('Failed to fetch analytics')
      const data = await response.json()
      setAnalytics(data.summary?.url)
      setError(null)
    } catch (err) {
      console.error('Error fetching URL analytics:', err)
      setError('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Short URL Analytics</CardTitle>
          <CardDescription>Track short URL clicks and performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-red-600">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (loading || !analytics) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Short URL Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Prepare chart data (simulate time series)
  const chartData = analytics.topURLs.slice(0, 5).map((url, index) => ({
    name: url.shortCode,
    clicks: url.clicks,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link2 className="h-5 w-5" />
          Short URL Analytics
        </CardTitle>
        <CardDescription>Track short URL clicks and performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted p-4">
            <div className="text-sm font-medium text-muted-foreground">Total Short URLs</div>
            <div className="mt-2 text-2xl font-bold">{analytics.totalURLs}</div>
          </div>
          <div className="rounded-lg bg-emerald-50 p-4 dark:bg-emerald-950">
            <div className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Total Clicks</div>
            <div className="mt-2 text-2xl font-bold text-emerald-900 dark:text-emerald-100">
              {analytics.totalClicks.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="clicks" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">No short URLs yet</p>
          </div>
        )}

        {/* Top URLs List */}
        {analytics.topURLs.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Top Performing URLs</h4>
            <div className="space-y-2">
              {analytics.topURLs.slice(0, 5).map((url, index) => (
                <div
                  key={url.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="inline-flex h-6 w-6 items-center justify-center rounded bg-muted text-xs font-semibold">
                        {index + 1}
                      </div>
                      <p className="font-mono font-medium text-sm truncate">
                        smartmotor.ae/{url.shortCode}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                      {url.originalUrl}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Created: {url.created?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-bold text-lg">{url.clicks}</p>
                    <p className="text-xs text-muted-foreground">clicks</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
