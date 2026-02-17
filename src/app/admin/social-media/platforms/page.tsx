import { Globe } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function PlatformsPage() {
  return (
    <ToolPlaceholder
      title="Platform Manager"
      description="Manage connections to all social platforms."
      icon={Globe}
      status="coming-soon"
    />
  )
}
