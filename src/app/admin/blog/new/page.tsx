import { ToolPageLayout } from '@/components/admin/tool-page-layout'

export default function NewBlogPostPage() {
  return (
    <ToolPageLayout
      title="Create New Blog Post"
      description="Write a new blog post with SEO optimization"
      backHref="/admin/blog"
    >
      <form className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Post Title
          </label>
          <input
            type="text"
            placeholder="Enter post title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E62329] focus:border-transparent outline-none"
          />
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            URL Slug
          </label>
          <input
            type="text"
            placeholder="url-slug-here"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E62329] focus:border-transparent outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Meta Description
          </label>
          <textarea
            placeholder="Brief description for search results"
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E62329] focus:border-transparent outline-none resize-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Content
          </label>
          <textarea
            placeholder="Write your blog post content..."
            rows={10}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E62329] focus:border-transparent outline-none resize-none font-mono text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium hover:bg-gray-50 transition-colors"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#E62329] text-white rounded-lg font-medium hover:bg-[#E62329]/90 transition-colors"
          >
            Publish Post
          </button>
        </div>
      </form>
    </ToolPageLayout>
  )
}
