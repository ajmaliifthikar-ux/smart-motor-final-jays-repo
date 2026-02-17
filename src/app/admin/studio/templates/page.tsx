import { Layers } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function TemplatesPage() {
  return (
    <ToolPlaceholder
      title="Templates & Lists"
      description="Access templates and checklists for content creation."
      icon={Layers}
      status="coming-soon"
    />
  )
}
