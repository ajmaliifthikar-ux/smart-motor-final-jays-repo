'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar, Download, RefreshCw } from 'lucide-react'

interface DateRange {
  from: Date
  to: Date
}

interface AnalyticsHeaderProps {
  onDateRangeChange?: (dateRange: DateRange) => void
  onExport?: () => void
  onRefresh?: () => void
}

export function AnalyticsHeader({
  onDateRangeChange,
  onExport,
  onRefresh,
}: AnalyticsHeaderProps) {
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })
  const [isLoading, setIsLoading] = useState(false)

  function handleDateRangeChange(type: 'from' | 'to', date: Date) {
    const newRange = { ...dateRange, [type]: date }
    setDateRange(newRange)
    onDateRangeChange?.(newRange)
  }

  async function handleExport() {
    setIsLoading(true)
    try {
      onExport?.()
      // Simulate export delay
      await new Promise(resolve => setTimeout(resolve, 500))
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRefresh() {
    setIsLoading(true)
    try {
      onRefresh?.()
      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 500))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Track QR codes and short URL performance</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* Date Range Button */}
        <Button 
          variant="outline" 
          className="gap-2"
          onClick={() => setShowDatePicker(!showDatePicker)}
        >
          <Calendar className="h-4 w-4" />
          <span className="hidden sm:inline">
            {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
          </span>
          <span className="sm:hidden">Date Range</span>
        </Button>

        {/* Refresh Button */}
        <Button
          variant="outline"
          onClick={handleRefresh}
          disabled={isLoading}
          title="Refresh analytics"
          className="h-10 w-10 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </Button>

        {/* Export Button */}
        <Button
          variant="primary"
          className="gap-2"
          onClick={handleExport}
          disabled={isLoading}
        >
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Export</span>
        </Button>
      </div>

      {/* Date Range Picker */}
      {showDatePicker && (
        <div className="rounded-lg border bg-card p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">From</label>
              <input
                type="date"
                value={dateRange.from.toISOString().split('T')[0]}
                onChange={(e) =>
                  handleDateRangeChange('from', new Date(e.target.value))
                }
                className="mt-1 w-full rounded border px-2 py-1 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium">To</label>
              <input
                type="date"
                value={dateRange.to.toISOString().split('T')[0]}
                onChange={(e) =>
                  handleDateRangeChange('to', new Date(e.target.value))
                }
                className="mt-1 w-full rounded border px-2 py-1 text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              className="text-sm h-8 px-3"
              variant="outline"
              onClick={() => {
                const now = new Date()
                const newDate = new Date(now)
                newDate.setDate(now.getDate() - 7)
                setDateRange({
                  from: newDate,
                  to: now,
                })
              }}
            >
              Last 7 Days
            </Button>
            <Button
              className="text-sm h-8 px-3"
              variant="outline"
              onClick={() => {
                const now = new Date()
                const newDate = new Date(now)
                newDate.setDate(now.getDate() - 30)
                setDateRange({
                  from: newDate,
                  to: now,
                })
              }}
            >
              Last 30 Days
            </Button>
            <Button
              className="text-sm h-8 px-3"
              variant="ghost"
              onClick={() => setShowDatePicker(false)}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
