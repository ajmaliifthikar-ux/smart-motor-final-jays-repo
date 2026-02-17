import { MessageSquare } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function AutoResponsesPage() {
  return (
    <ToolPlaceholder
      title="Auto Responses"
      description="Set up automatic responses to followers."
      icon={MessageSquare}
      status="coming-soon"
    />
  )
}
