import { FileCheck } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function AuditLogsPage() {
  return (
    <ToolPlaceholder
      title="Audit Logs"
      description="View system audit logs and activities."
      icon={FileCheck}
      status="coming-soon"
    />
  )
}
