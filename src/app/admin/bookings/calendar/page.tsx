import { Calendar } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function CalendarPage() {
  return (
    <ToolPlaceholder
      title="Calendar View"
      description="View all bookings in calendar format."
      icon={Calendar}
      status="coming-soon"
    />
  )
}
