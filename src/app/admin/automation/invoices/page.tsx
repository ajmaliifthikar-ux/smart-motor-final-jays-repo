import { FileCheck } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function InvoicesPage() {
  return (
    <ToolPlaceholder
      title="Invoice Automation"
      description="Automate invoice generation and sending."
      icon={FileCheck}
      status="coming-soon"
    />
  )
}
