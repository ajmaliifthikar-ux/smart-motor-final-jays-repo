import { FileText } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function HistoryPage() {
  return (
    <ToolPlaceholder
      title="History"
      description="View booking history and past appointments."
      icon={FileText}
      status="coming-soon"
    />
  )
}
