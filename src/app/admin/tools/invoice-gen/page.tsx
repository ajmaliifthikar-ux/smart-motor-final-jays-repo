import { FileCheck } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function InvoiceGenPage() {
  return (
    <ToolPlaceholder
      title="Invoice Generator"
      description="Generate professional invoices."
      icon={FileCheck}
      status="coming-soon"
    />
  )
}
