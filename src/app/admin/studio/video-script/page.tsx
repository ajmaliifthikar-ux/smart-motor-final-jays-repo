import { Film } from 'lucide-react'
import { AgenticChat } from '@/components/admin/agents/agentic-chat'

export default function VideoScriptPage() {
  return (
    <AgenticChat
      title="Video Script Generator"
      description="Create compelling video scripts for different platforms and lengths"
      placeholder="Ask for video script ideas for TikTok, YouTube, Reels, etc..."
      agentEndpoint="/api/agent/content/chat"
      icon={<Film className="w-6 h-6" />}
      initialMessage="I'm your video script writer! I can create scripts for TikTok, YouTube, Instagram Reels, and Facebook videos. What platform and length do you need?"
    />
  )
}
