import { Calculator } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function CalculatorPage() {
  return (
    <ToolPlaceholder
      title="Calculator"
      description="Advanced calculator for business calculations."
      icon={Calculator}
      status="coming-soon"
    />
  )
}
