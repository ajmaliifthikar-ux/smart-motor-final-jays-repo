import { BarChart3 } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function GapAnalysisPage() {
  return (
    <ToolPlaceholder
      title="Keyword Gap"
      description="Identify keyword gaps in your strategy."
      icon={BarChart3}
      status="coming-soon"
    />
  )
}
