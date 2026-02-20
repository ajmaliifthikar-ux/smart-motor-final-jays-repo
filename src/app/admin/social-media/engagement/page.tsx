import { TrendingUp } from 'lucide-react'
import { AgenticChat } from '@/components/admin/agents/agentic-chat'

export default function EngagementPage() {
  return (
    <AgenticChat
      title="Engagement Tracker & Growth"
      description="Optimize engagement and grow your social media following"
      placeholder="Ask about engagement strategies, growth tactics..."
      agentEndpoint="/api/agent/social/chat"
      icon={<TrendingUp className="w-6 h-6" />}
      initialMessage="I help boost engagement and grow your followers! Ask about strategies, tactics, or how to increase reach."
    />
  )
}
