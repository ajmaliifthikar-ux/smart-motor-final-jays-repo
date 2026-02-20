import { Hash } from 'lucide-react'
import { AgenticChat } from '@/components/admin/agents/agentic-chat'

export default function CaptionsPage() {
  return (
    <AgenticChat
      title="Captions & Hashtags Generator"
      description="Generate engaging captions and hashtag strategies for social media"
      placeholder="Ask for captions, hashtags, or engagement strategies..."
      agentEndpoint="/api/agent/content/chat"
      icon={<Hash className="w-6 h-6" />}
      initialMessage="I'm your social media copywriter! I can generate engaging captions, suggest relevant hashtags, and help boost your post engagement. What platform are you posting to?"
    />
  )
}
