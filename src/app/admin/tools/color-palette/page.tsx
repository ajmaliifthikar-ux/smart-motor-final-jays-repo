import { Palette } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function ColorPalettePage() {
  return (
    <ToolPlaceholder
      title="Color Palette"
      description="Generate and manage color palettes."
      icon={Palette}
      status="coming-soon"
    />
  )
}
