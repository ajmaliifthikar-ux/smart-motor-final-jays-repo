import { Calendar } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function CalendarViewPage() {
  return (
    <ToolPlaceholder
      title="Calendar View"
      description="View your social media schedule in calendar format."
      icon={Calendar}
      status="coming-soon"
    />
  )
}
