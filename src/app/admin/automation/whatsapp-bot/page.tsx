import { MessageSquare } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function WhatsappBotPage() {
  return (
    <ToolPlaceholder
      title="WhatsApp Bot"
      description="Set up intelligent WhatsApp bot for customer engagement."
      icon={MessageSquare}
      status="coming-soon"
    />
  )
}
