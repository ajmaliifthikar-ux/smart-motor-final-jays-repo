import { Lightbulb } from 'lucide-react'
import { AgenticChat } from '@/components/admin/agents/agentic-chat'

export default function OpportunityFinderPage() {
  return (
    <AgenticChat
      title="Opportunity Finder"
      description="Discover untapped revenue streams and business growth opportunities"
      placeholder="Ask about revenue opportunities, growth strategies..."
      agentEndpoint="/api/agent/intelligence"
      icon={<Lightbulb className="w-6 h-6" />}
      initialMessage="I find growth opportunities! Ask about revenue potential, new services, corporate partnerships, or market gaps."
    />
  )
}
