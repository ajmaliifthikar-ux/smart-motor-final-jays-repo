import { Calendar } from 'lucide-react'
import { AgenticChat } from '@/components/admin/agents/agentic-chat'

export default function PostSchedulerPage() {
  return (
    <AgenticChat
      title="Post Scheduler"
      description="Plan and schedule social media posts across all platforms"
      placeholder="Ask about posting schedule, calendar, timing..."
      agentEndpoint="/api/agent/social/chat"
      icon={<Calendar className="w-6 h-6" />}
      initialMessage="I help with social media scheduling! Ask about optimal posting times, content calendars, or posting strategies."
    />
  )
}
