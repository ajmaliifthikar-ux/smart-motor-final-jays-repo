import { LineChart } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function GrowthPage() {
  return (
    <ToolPlaceholder
      title="Growth Monitor"
      description="Monitor follower growth and audience metrics."
      icon={LineChart}
      status="coming-soon"
    />
  )
}
