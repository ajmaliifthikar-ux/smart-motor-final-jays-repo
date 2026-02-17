import { FileText } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function ContentBriefPage() {
  return (
    <ToolPlaceholder
      title="Content Brief"
      description="Generate SEO-optimized content briefs."
      icon={FileText}
      status="coming-soon"
    />
  )
}
