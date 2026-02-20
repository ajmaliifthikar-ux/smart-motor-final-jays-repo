import { Users } from 'lucide-react'
import { AgenticChat } from '@/components/admin/agents/agentic-chat'

export default function CustomerPersonasPage() {
  return (
    <AgenticChat
      title="Customer Personas"
      description="Understand your target customer segments and create tailored strategies"
      placeholder="Ask about customer types, messaging strategies..."
      agentEndpoint="/api/agent/intelligence"
      icon={<Users className="w-6 h-6" />}
      initialMessage="I help define customer personas! Ask about target segments, customer needs, messaging strategies, or marketing approaches."
    />
  )
}
