import { DollarSign } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function PricingIntelligencePage() {
  return (
    <ToolPlaceholder
      title="Pricing Intelligence"
      description="Monitor competitor pricing and optimize your pricing strategy."
      icon={DollarSign}
      status="coming-soon"
    />
  )
}
