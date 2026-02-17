import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { AnalyticsHeader } from '@/components/dashboard/analytics-header'
import { QRAnalyticsWidget } from '@/components/dashboard/qr-analytics-widget'
import { URLAnalyticsWidget } from '@/components/dashboard/url-analytics-widget'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp } from 'lucide-react'

export const metadata = {
  title: 'Analytics Dashboard | Smart Motor',
  description: 'Track QR codes and short URL performance',
}

export default async function AnalyticsDashboardPage() {
  // Check authentication
  const session = await auth()
  if (!session || (session as any).role !== 'admin') {
    redirect('/auth/login')
  }

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <AnalyticsHeader />

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Analytics Overview</CardTitle>
            <CardDescription>Real-time tracking of all campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              <p className="mb-2">📊 Monitor your QR codes and short URL performance in real-time</p>
              <p className="mb-2">🔄 Data refreshes automatically every 30 seconds</p>
              <p>📈 Click the refresh button to manually update all widgets</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">Quick Stats</CardTitle>
            <CardDescription>Current performance metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Dashboard Status</span>
                <span className="font-semibold text-green-600">Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Data Refresh</span>
                <span className="font-semibold">Every 30s</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Last Update</span>
                <span className="font-semibold">Just now</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Widgets */}
      <div className="grid gap-6 lg:grid-cols-2">
        <QRAnalyticsWidget />
        <URLAnalyticsWidget />
      </div>

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            How to Use This Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">📱 QR Code Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Track the performance of your QR codes. See total scans, top performing QR codes, and scan trends over time.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">🔗 Short URL Analytics</h3>
            <p className="text-sm text-muted-foreground">
              Monitor clicks on your shortened URLs. View click counts, top URLs, and traffic sources.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">📊 Real-time Updates</h3>
            <p className="text-sm text-muted-foreground">
              Data updates automatically every 30 seconds. Use the refresh button in the header for immediate updates.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">📅 Date Range Filtering</h3>
            <p className="text-sm text-muted-foreground">
              Click the calendar icon to filter analytics by date range. Choose from preset ranges or custom dates.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">📥 Export Data</h3>
            <p className="text-sm text-muted-foreground">
              Export analytics data for further analysis. Click the Export button to download current metrics.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
