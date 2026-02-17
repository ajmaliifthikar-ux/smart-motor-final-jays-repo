import { Users } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function LeadCapturePage() {
  return (
    <ToolPlaceholder
      title="Lead Capture"
      description="Automate lead capture from multiple channels."
      icon={Users}
      status="coming-soon"
    />
  )
}
