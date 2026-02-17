import { LinkIcon } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function IntegrationsPage() {
  return (
    <ToolPlaceholder
      title="Integrations"
      description="Manage third-party integrations."
      icon={LinkIcon}
      status="coming-soon"
    />
  )
}
