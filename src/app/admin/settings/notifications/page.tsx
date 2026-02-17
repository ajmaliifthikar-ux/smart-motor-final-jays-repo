import { Bell } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function NotificationsPage() {
  return (
    <ToolPlaceholder
      title="Notifications"
      description="Configure notification preferences."
      icon={Bell}
      status="coming-soon"
    />
  )
}
