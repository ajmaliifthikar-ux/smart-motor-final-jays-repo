import { QrCode } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function QrCodePage() {
  return (
    <ToolPlaceholder
      title="QR Code Generator"
      description="Generate QR codes for marketing campaigns."
      icon={QrCode}
      status="coming-soon"
    />
  )
}
