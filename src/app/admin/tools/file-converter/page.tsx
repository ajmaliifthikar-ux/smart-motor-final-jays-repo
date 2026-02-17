import { FileCheck } from 'lucide-react'
import { ToolPlaceholder } from '@/components/admin/tool-placeholder'

export default function FileConverterPage() {
  return (
    <ToolPlaceholder
      title="File Converter"
      description="Convert files between different formats."
      icon={FileCheck}
      status="coming-soon"
    />
  )
}
