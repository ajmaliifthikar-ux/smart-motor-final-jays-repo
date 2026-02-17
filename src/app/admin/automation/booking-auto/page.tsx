import { Calendar } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function BookingAutoPage() {
  return (
    <ToolPlaceholder
      title="Booking Automation"
      description="Automate booking and appointment scheduling."
      icon={Calendar}
      status="coming-soon"
    />
  )
}
