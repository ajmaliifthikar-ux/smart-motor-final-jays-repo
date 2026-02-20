import { Bell } from 'lucide-react'
import { AgenticChat } from '@/components/admin/agents/agentic-chat'

export default function RemindersPage() {
  return (
    <AgenticChat
      title="Appointment Reminders"
      description="Reduce no-shows with automated appointment reminders via SMS, WhatsApp, and email"
      placeholder="Ask about reminder scheduling, channels, or templates..."
      agentEndpoint="/api/agent/automation"
      icon={<Bell className="w-6 h-6" />}
      initialMessage="I can help reduce no-shows! Ask about reminder scheduling, multi-channel setup, or automated response templates."
    />
  )
}
