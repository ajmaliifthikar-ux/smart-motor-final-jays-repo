import { Send } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function FollowUpsPage() {
  return (
    <ToolPlaceholder
      title="Follow-up Sequences"
      description="Create automated follow-up sequences for leads."
      icon={Send}
      status="coming-soon"
    />
  )
}
