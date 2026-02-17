import { Globe } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function MarketPositionPage() {
  return (
    <ToolPlaceholder
      title="Market Position"
      description="Monitor your market position, share, and standing against competitors."
      icon={Globe}
      status="coming-soon"
    />
  )
}
