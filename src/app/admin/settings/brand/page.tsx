import { Palette } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function BrandPage() {
  return (
    <ToolPlaceholder
      title="Brand Profile"
      description="Manage your brand profile and settings."
      icon={Palette}
      status="coming-soon"
    />
  )
}
