import { LineChart } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function RankingsPage() {
  return (
    <ToolPlaceholder
      title="Ranking Tracker"
      description="Track keyword rankings over time."
      icon={LineChart}
      status="coming-soon"
    />
  )
}
