import { Palette } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function ImageResizerPage() {
  return (
    <ToolPlaceholder
      title="Image Resizer"
      description="Resize and optimize images for different platforms."
      icon={Palette}
      status="coming-soon"
    />
  )
}
