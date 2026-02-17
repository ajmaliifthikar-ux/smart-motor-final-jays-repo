import { LinkIcon } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function UrlShortenerPage() {
  return (
    <ToolPlaceholder
      title="URL Shortener"
      description="Create and manage shortened URLs."
      icon={LinkIcon}
      status="coming-soon"
    />
  )
}
