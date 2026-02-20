import { Lightbulb } from 'lucide-react'
import { AgenticChat } from '@/components/admin/agents/agentic-chat'

export default function BrainstormerPage() {
  return (
    <AgenticChat
      title="Content Brainstormer"
      description="AI-powered content creation assistant for blogs, social media, videos, ads, and captions"
      placeholder="Ask me for content ideas... (blog posts, social media, video scripts, ads, captions)"
      agentEndpoint="/api/agent/content/chat"
      icon={<Lightbulb className="w-6 h-6" />}
      initialMessage="I'm your content creation assistant! I can help you brainstorm and generate ideas for blogs, social media posts, video scripts, ad copy, and captions. What type of content would you like to create?"
    />
  )
}
