import { Calendar } from 'lucide-react'
import { AgenticChat } from '@/components/admin/agents/agentic-chat'

export default function BookingAutomationPage() {
  return (
    <AgenticChat
      title="Booking Automation"
      description="AI-powered booking assistant that handles scheduling, conflict resolution, and customer notifications"
      placeholder="Ask about scheduling, availability, conflicts, or customer notifications..."
      agentEndpoint="/api/agent/booking/chat"
      icon={<Calendar className="w-6 h-6" />}
      initialMessage="How can I assist with booking automation today? I can help with scheduling, conflict resolution, availability management, and customer notifications."
    />
  )
}
