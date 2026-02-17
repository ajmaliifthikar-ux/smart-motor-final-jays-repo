import { Lightbulb } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function BrainstormerPage() {
  return (
    <ToolPlaceholder
      title="Content Brainstorm"
      description="Brainstorm content ideas with AI suggestions."
      icon={Lightbulb}
      status="coming-soon"
    />
  )
}
