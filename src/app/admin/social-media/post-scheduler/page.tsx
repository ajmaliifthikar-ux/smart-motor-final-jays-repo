import { Calendar } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function PostSchedulerPage() {
  return (
    <ToolPlaceholder
      title="Post Scheduler"
      description="Schedule posts across all social platforms."
      icon={Calendar}
      status="coming-soon"
    />
  )
}
