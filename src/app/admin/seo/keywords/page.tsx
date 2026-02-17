import { Search } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function KeywordsPage() {
  return (
    <ToolPlaceholder
      title="Keyword Research"
      description="Research and track keywords for SEO strategy."
      icon={Search}
      status="coming-soon"
    />
  )
}
