import { Bell } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function RemindersPage() {
  return (
    <ToolPlaceholder
      title="Appointment Reminders"
      description="Send automated appointment reminder notifications."
      icon={Bell}
      status="coming-soon"
    />
  )
}
