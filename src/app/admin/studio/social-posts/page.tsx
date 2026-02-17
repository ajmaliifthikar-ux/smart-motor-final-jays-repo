import { Share } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function SocialPostsPage() {
  return (
    <ToolPlaceholder
      title="Social Posts"
      description="Generate engaging social media posts powered by AI."
      icon={Share}
      status="coming-soon"
    />
  )
}
