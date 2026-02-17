import { BookOpen } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function KnowledgePagesPage() {
  return (
    <ToolPlaceholder
      title="Knowledge Pages"
      description="Create knowledge base pages for SEO."
      icon={BookOpen}
      status="coming-soon"
    />
  )
}
