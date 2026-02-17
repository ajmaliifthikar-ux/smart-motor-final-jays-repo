import { Lightbulb } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function OpportunityFinderPage() {
  return (
    <ToolPlaceholder
      title="Opportunity Finder"
      description="Discover untapped market opportunities and revenue streams."
      icon={Lightbulb}
      status="coming-soon"
    />
  )
}
