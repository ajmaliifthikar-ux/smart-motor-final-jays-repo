import { Cpu } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function CommandCenterPage() {
  return (
    <ToolPlaceholder
      title="Command Center"
      description="Central hub for managing all automations."
      icon={Cpu}
      status="coming-soon"
    />
  )
}
