import { MetadataRoute } from 'next'
import { getAllServices, getAllBrands, getAllPublishedContent } from '@/lib/firebase-db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartmotor.ae'

    // Static routes — canonical URLs only
    const staticRoutes = [
        { path: '', priority: 1.0 },
        { path: '/new-home', priority: 1.0 },
        { path: '/services', priority: 0.9 },
        { path: '/brands', priority: 0.9 },
        { path: '/about', priority: 0.8 },
        { path: '/contact', priority: 0.8 },
        { path: '/faq', priority: 0.8 },
        { path: '/careers', priority: 0.7 },
        { path: '/privacy', priority: 0.3 },
        { path: '/terms', priority: 0.3 },
    ]

    const staticEntries = staticRoutes.map(({ path, priority }) => ({
        url: `${baseUrl}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority,
    }))

    let services: any[] = []
    let brands: any[] = []
    let posts: any[] = []

    try {
        const [s, b, p] = await Promise.all([
            getAllServices(),
            getAllBrands(),
            getAllPublishedContent('BLOG')
        ])
        services = s
        brands = b
        posts = p
    } catch (e) {
        console.error("Sitemap DB Error", e)
    }

    const serviceRoutes = services.map((service) => ({
        url: `${baseUrl}/services/${service.slug}`,
        lastModified: service.updatedAt?.toDate?.() || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    const brandRoutes = brands.map((brand) => ({
        url: `${baseUrl}/brand/${brand.slug || brand.id}`,
        lastModified: brand.updatedAt?.toDate?.() || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    const blogRoutes = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: post.updatedAt?.toDate?.() || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    return [...staticEntries, ...serviceRoutes, ...brandRoutes, ...blogRoutes]
}
