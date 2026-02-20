import { LineChart } from 'lucide-react'
import { AgenticChat } from '@/components/admin/agents/agentic-chat'

export default function TrendTrackerPage() {
  return (
    <AgenticChat
      title="Trend Tracker"
      description="Monitor market trends and industry shifts affecting your business"
      placeholder="Ask about market trends, customer behavior..."
      agentEndpoint="/api/agent/intelligence"
      icon={<LineChart className="w-6 h-6" />}
      initialMessage="I track market trends for you! Ask about industry shifts, customer behavior changes, or emerging opportunities."
    />
  )
}
