'use client'

import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Loader2, TrendingUp } from 'lucide-react'

interface QRAnalytics {
  id: string
  code: string
  scans: number
  created: any
}

interface QRSummary {
  totalQRCodes: number
  totalScans: number
  topQRCodes: QRAnalytics[]
}

export function QRAnalyticsWidget() {
  const [analytics, setAnalytics] = useState<QRSummary | null>(null)
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
      setAnalytics(data.summary?.qr)
      setError(null)
    } catch (err) {
      console.error('Error fetching QR analytics:', err)
      setError('Failed to load analytics')
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>QR Code Analytics</CardTitle>
          <CardDescription>Track QR code scans and performance</CardDescription>
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
          <CardTitle>QR Code Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Prepare chart data
  const chartData = analytics.topQRCodes.map((qr) => ({
    name: qr.code || `QR-${qr.id.slice(0, 6)}`,
    scans: qr.scans || 0,
  }))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          QR Code Analytics
        </CardTitle>
        <CardDescription>Track QR code scans and performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted p-4">
            <div className="text-sm font-medium text-muted-foreground">Total QR Codes</div>
            <div className="mt-2 text-2xl font-bold">{analytics.totalQRCodes}</div>
          </div>
          <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
            <div className="text-sm font-medium text-blue-700 dark:text-blue-300">Total Scans</div>
            <div className="mt-2 text-2xl font-bold text-blue-900 dark:text-blue-100">
              {analytics.totalScans.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Chart */}
        {chartData.length > 0 ? (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="scans" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">No QR codes yet</p>
          </div>
        )}

        {/* Top QR Codes List */}
        {analytics.topQRCodes.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Top Performing QR Codes</h4>
            <div className="space-y-2">
              {analytics.topQRCodes.slice(0, 5).map((qr, index) => (
                <div
                  key={qr.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-6 w-6 items-center justify-center rounded bg-muted text-xs font-semibold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{qr.code || `QR-${qr.id.slice(0, 6)}`}</p>
                      <p className="text-xs text-muted-foreground">
                        {qr.created?.toDate?.()?.toLocaleDateString() || 'Unknown date'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{qr.scans}</p>
                    <p className="text-xs text-muted-foreground">scans</p>
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
