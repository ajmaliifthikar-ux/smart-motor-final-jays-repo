import { TrendingUp } from 'lucide-react'
import { AgenticChat } from '@/components/admin/agents/agentic-chat'

export default function CompetitorAnalysisPage() {
  return (
    <AgenticChat
      title="Business Strategy & Competitor Analysis"
      description="AI-powered market strategist for growth planning, competitive intelligence, and market opportunities"
      placeholder="Ask about market analysis, competitors, trends, or growth strategy..."
      agentEndpoint="/api/agent/strategy/chat"
      icon={<TrendingUp className="w-6 h-6" />}
      initialMessage="I can help with market analysis, competitor research, trend identification, and growth strategy. What would you like to explore?"
    />
  )
}
