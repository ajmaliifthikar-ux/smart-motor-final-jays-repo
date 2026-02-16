import { getAllBrands, getAllPublishedContent } from "@/lib/firebase-db"
import { Tabs } from "@/components/ui/tabs"
import { GlobalSettings } from "@/components/admin/content/global-settings"
import { BrandManager } from "@/components/admin/content/brand-manager"
import { ContentEditor } from "@/components/admin/content/content-editor"
import { SEODashboard } from "@/components/admin/seo/seo-dashboard"
import { PageManager } from "@/components/admin/content/page-manager"
import { HistoryViewer } from "@/components/admin/content/history-viewer"

export default async function ContentPage() {
    // 1. Fetch Data
    let contentBlocks: any[] = []
    let brands: any[] = []

    try {
        const [allContent, allBrands] = await Promise.all([
            getAllPublishedContent(),
            getAllBrands()
        ])
        contentBlocks = allContent
        brands = allBrands
    } catch (error) {
        console.error('Failed to fetch content data:', error)
    }

    // 2. Transform Content Blocks for localized editing
    const config = contentBlocks.reduce((acc, block) => {
        acc[block.slug] = { value: block.content, valueAr: block.contentAr }
        return acc
    }, {} as Record<string, { value: string, valueAr: string | null }>)

    // 2.1 Group Blocks by Page (use type as page grouping)
    const pageBlocks = contentBlocks.reduce((acc, block) => {
        const page = block.type || 'general'
        if (!acc[page]) acc[page] = []
        acc[page].push(block)
        return acc
    }, {} as Record<string, any[]>)

    // Sort blocks within each page by order
    Object.keys(pageBlocks).forEach(page => {
        pageBlocks[page].sort((a: any, b: any) => a.order - b.order)
    })

    // 3. Define Tabs
    const tabs = [
        {
            id: "general",
            label: "Global Settings",
            content: <GlobalSettings initialData={config} />
        },
        {
            id: "brands",
            label: "Car Brands",
            content: <BrandManager brands={brands} />
        },
        {
            id: "pages",
            label: "Page Layouts",
            content: <PageManager initialPages={pageBlocks} />
        },
        {
            id: "history",
            label: "Version History",
            content: <HistoryViewer />
        },
        {
            id: "ai-writer",
            label: "AI Content Studio",
            content: <ContentEditor />
        },
        {
            id: "seo",
            label: "SEO Intelligence",
            content: <SEODashboard />
        }
    ]

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-[#121212]">Content Management</h1>
                    <p className="mt-1 text-sm text-gray-500">Manage your website's visual and text content.</p>
                </div>
            </div>

            <Tabs tabs={tabs} />
        </div>
    )
}
