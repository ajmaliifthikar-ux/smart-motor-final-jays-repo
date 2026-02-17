import { Plus } from 'lucide-react'
import Link from 'next/link'
import { ToolPageLayout } from '@/components/admin/tool-page-layout'

export default function BlogManagerPage() {
  return (
    <ToolPageLayout
      title="Blog Manager"
      description="Create, edit, and publish blog posts for your website"
      backHref="/admin"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold text-gray-900">All Posts</h2>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#E62329] text-white rounded-lg hover:bg-[#E62329]/90 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          New Post
        </Link>
      </div>

      <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
        <p className="text-gray-600 mb-4">No blog posts yet</p>
        <p className="text-sm text-gray-500">Create your first blog post to get started</p>
      </div>
    </ToolPageLayout>
  )
}
