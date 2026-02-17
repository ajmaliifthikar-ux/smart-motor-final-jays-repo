import { Calendar } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function ContentCalendarPage() {
  return (
    <ToolPlaceholder
      title="Content Calendar"
      description="Plan and organize your content across all channels with AI assistance."
      icon={Calendar}
      status="coming-soon"
    />
  )
}
