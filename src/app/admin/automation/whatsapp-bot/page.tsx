import { MessageSquare } from 'lucide-react'
import { AgenticChat } from '@/components/admin/agents/agentic-chat'

export default function WhatsAppBotPage() {
  return (
    <AgenticChat
      title="WhatsApp Bot Configuration"
      description="Set up automated WhatsApp messaging for bookings, reminders, and customer support"
      placeholder="Ask about WhatsApp templates, automation setup..."
      agentEndpoint="/api/agent/automation"
      icon={<MessageSquare className="w-6 h-6" />}
      initialMessage="I can help you set up WhatsApp automation! Ask about message templates, auto-responses, appointment reminders, or booking confirmations."
    />
  )
}
