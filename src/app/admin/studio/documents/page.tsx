import { FileCheck } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function DocumentsPage() {
  return (
    <ToolPlaceholder
      title="Documents"
      description="Manage and organize your content documents."
      icon={FileCheck}
      status="coming-soon"
    />
  )
}
