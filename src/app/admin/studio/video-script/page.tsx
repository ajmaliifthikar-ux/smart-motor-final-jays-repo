import { FileText } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function VideoScriptPage() {
  return (
    <ToolPlaceholder
      title="Video Script"
      description="Write professional video scripts with AI optimization."
      icon={FileText}
      status="coming-soon"
    />
  )
}
