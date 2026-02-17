import { Layers } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function PipelinePage() {
  return (
    <ToolPlaceholder
      title="Content Pipeline"
      description="Manage your SEO content pipeline."
      icon={Layers}
      status="coming-soon"
    />
  )
}
