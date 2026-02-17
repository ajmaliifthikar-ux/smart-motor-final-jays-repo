import { MessageSquare } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function InboxPage() {
  return (
    <ToolPlaceholder
      title="Comment & DM Inbox"
      description="Manage all comments and direct messages."
      icon={MessageSquare}
      status="coming-soon"
    />
  )
}
