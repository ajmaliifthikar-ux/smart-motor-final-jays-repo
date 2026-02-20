import { BookOpen } from 'lucide-react'
import { AgenticChat } from '@/components/admin/agents/agentic-chat'

export default function BlogWriterPage() {
  return (
    <AgenticChat
      title="Blog Writer"
      description="AI-powered blog creation assistant with SEO optimization and structure templates"
      placeholder="Ask for blog post ideas, outlines, or content..."
      agentEndpoint="/api/agent/content/chat"
      icon={<BookOpen className="w-6 h-6" />}
      initialMessage="I'm your blog writing assistant! I can help you brainstorm post ideas, create outlines, and generate SEO-optimized content. What would you like to write about?"
    />
  )
}
