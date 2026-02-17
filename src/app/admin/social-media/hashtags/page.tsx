import { Hash } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function HashtagsPage() {
  return (
    <ToolPlaceholder
      title="Hashtag Analyzer"
      description="Analyze hashtag performance and recommendations."
      icon={Hash}
      status="coming-soon"
    />
  )
}
