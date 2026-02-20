import { Users } from 'lucide-react'
import { AgenticChat } from '@/components/admin/agents/agentic-chat'

export default function LeadCapturePage() {
  return (
    <AgenticChat
      title="Lead Capture & Nurture"
      description="Automate lead collection, scoring, and follow-up sequences"
      placeholder="Ask about lead capture, scoring, or follow-up sequences..."
      agentEndpoint="/api/agent/automation"
      icon={<Users className="w-6 h-6" />}
      initialMessage="I help with lead capture automation! Ask about capture methods, lead scoring, follow-up sequences, or conversion optimization."
    />
  )
}
