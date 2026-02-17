import { DollarSign } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function BillingPage() {
  return (
    <ToolPlaceholder
      title="Billing"
      description="Manage billing and subscription."
      icon={DollarSign}
      status="coming-soon"
    />
  )
}
