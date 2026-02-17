import { Palette } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function VisualsPage() {
  return (
    <ToolPlaceholder
      title="Artwork & Visuals"
      description="Create stunning visuals and artwork with AI design tools."
      icon={Palette}
      status="coming-soon"
    />
  )
}
