import { MessageSquare } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function AutoRepliesPage() {
  return (
    <ToolPlaceholder
      title="Auto Reply Rules"
      description="Configure smart auto-reply rules for messages."
      icon={MessageSquare}
      status="coming-soon"
    />
  )
}
