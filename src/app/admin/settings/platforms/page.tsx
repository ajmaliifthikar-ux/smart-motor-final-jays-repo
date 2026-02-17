import { Globe } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function PlatformsPage() {
  return (
    <ToolPlaceholder
      title="Connected Platforms"
      description="Manage connected social platforms."
      icon={Globe}
      status="coming-soon"
    />
  )
}
