import { ToolPageLayout } from '@/components/admin/tool-page-layout'

export default function BlogDraftsPage() {
  return (
    <ToolPageLayout
      title="Draft Posts"
      description="View and manage your draft blog posts"
      backHref="/admin/blog"
    >
      <div className="bg-gray-50 rounded-lg p-12 text-center border border-gray-200">
        <p className="text-gray-600 mb-4">No draft posts yet</p>
        <p className="text-sm text-gray-500">Create a new post and save it as draft</p>
      </div>
    </ToolPageLayout>
  )
}
