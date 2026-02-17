import { LineChart } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function TrendTrackerPage() {
  return (
    <ToolPlaceholder
      title="Trend Tracker"
      description="Track market trends and consumer behavior patterns in real-time."
      icon={LineChart}
      status="coming-soon"
    />
  )
}
