import { Smartphone } from 'lucide-react'
import { AgenticChat } from '@/components/admin/agents/agentic-chat'

export default function AdCopyPage() {
  return (
    <AgenticChat
      title="Ad Copy Generator"
      description="Generate high-converting ad copy for Google Ads, Facebook, and Instagram"
      placeholder="Ask for ad headlines, descriptions, or full campaigns..."
      agentEndpoint="/api/agent/content/chat"
      icon={<Smartphone className="w-6 h-6" />}
      initialMessage="I'm your ad copywriter! I can create persuasive ad copy for Google Ads, Facebook Ads, Instagram, and email campaigns. What's your advertising goal?"
    />
  )
}
