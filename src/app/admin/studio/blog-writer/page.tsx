import { BookOpen } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function BlogWriterPage() {
  return (
    <ToolPlaceholder
      title="Blog Writer"
      description="Generate high-quality blog posts with SEO optimization."
      icon={BookOpen}
      status="coming-soon"
    />
  )
}
