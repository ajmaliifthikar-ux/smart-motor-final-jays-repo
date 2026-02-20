import { Search } from 'lucide-react'
import { AgenticChat } from '@/components/admin/agents/agentic-chat'

export default function MarketResearchPage() {
  return (
    <AgenticChat
      title="SEO Intelligence & Keyword Research"
      description="AI-powered SEO specialist for keyword strategy, content optimization, and ranking analysis"
      placeholder="Ask about keywords, content optimization, rankings, or backlinks..."
      agentEndpoint="/api/agent/seo/chat"
      icon={<Search className="w-6 h-6" />}
      initialMessage="How can I help with your SEO strategy? I can assist with keyword research, content optimization, ranking analysis, and link building."
    />
  )
}
