import { LinkIcon } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function BacklinksPage() {
  return (
    <ToolPlaceholder
      title="Backlink Finder"
      description="Find and analyze backlink opportunities."
      icon={LinkIcon}
      status="coming-soon"
    />
  )
}
