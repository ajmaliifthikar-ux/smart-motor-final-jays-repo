import { TrendingUp } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function CompetitorAnalysisPage() {
  return (
    <ToolPlaceholder
      title="Competitor Analysis"
      description="Analyze competitor strategies, market positioning, and identify competitive advantages."
      icon={TrendingUp}
      status="coming-soon"
    />
  )
}
