import { useEffect, useState, useCallback } from 'react'

export interface AnalyticsData {
  qr?: {
    total: number
    scans: number
    topQRCodes: Array<{
      id: string
      code: string
      scans: number
      created: any
    }>
    data?: any[]
    dateRange?: { start: string; end: string }
  }
  url?: {
    total: number
    clicks: number
    topURLs: Array<{
      id: string
      shortCode: string
      originalUrl: string
      clicks: number
      created: any
    }>
    data?: any[]
    dateRange?: { start: string; end: string }
  }
  summary?: {
    qr: {
      total: number
      scans: number
      topQRCodes: any[]
    }
    url: {
      total: number
      clicks: number
      topURLs: any[]
    }
  }
}

interface UseLiveAnalyticsOptions {
  type?: 'all' | 'qr' | 'url' | 'summary'
  refreshInterval?: number // milliseconds
  autoRefresh?: boolean
}

export function useLiveAnalytics(options: UseLiveAnalyticsOptions = {}) {
  const {
    type = 'summary',
    refreshInterval = 30000, // 30 seconds
    autoRefresh = true,
  } = options

  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({ type })
      const response = await fetch(`/api/analytics/live?${params}`)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      setData(result)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics')
    } finally {
      setLoading(false)
    }
  }, [type])

  // Initial fetch
  useEffect(() => {
    fetchAnalytics()
  }, [fetchAnalytics])

  // Auto-refresh
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(fetchAnalytics, refreshInterval)
    return () => clearInterval(interval)
  }, [autoRefresh, refreshInterval, fetchAnalytics])

  return {
    data,
    loading,
    error,
    lastUpdated,
    refetch: fetchAnalytics,
  }
}
