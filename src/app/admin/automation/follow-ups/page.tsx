import { Send } from 'lucide-react'
import { AgenticChat } from '@/components/admin/agents/agentic-chat'

export default function FollowUpsPage() {
  return (
    <AgenticChat
      title="Follow-up Sequences"
      description="Create automated follow-up sequences for leads and customers"
      placeholder="Ask about follow-up campaigns, timing, or messaging..."
      agentEndpoint="/api/agent/automation"
      icon={<Send className="w-6 h-6" />}
      initialMessage="I help design effective follow-up sequences! Ask about timing, messaging, channels, or automation setup."
    />
  )
}
