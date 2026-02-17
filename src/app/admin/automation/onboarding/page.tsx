import { Layers } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function OnboardingPage() {
  return (
    <ToolPlaceholder
      title="Onboarding Flow"
      description="Automate customer onboarding processes."
      icon={Layers}
      status="coming-soon"
    />
  )
}
