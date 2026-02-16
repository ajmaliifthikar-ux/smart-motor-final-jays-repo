import { MetadataRoute } from 'next'
import { getAllServices, getAllBrands, getAllPublishedContent } from '@/lib/firebase-db'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartmotor.ae'

    // Static routes (verified existence)
    const routes = [
        '',
        '/new-home',
        '/new-home/about',
        '/new-home/contact',
        '/new-home/brands',
        '/new-home/smart-tips',
        '/new-home/packages',
    ]

    const staticEntries = routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' || route === '/new-home' ? 1 : 0.8,
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
        url: `${baseUrl}/new-home/services/${service.slug}`,
        lastModified: service.updatedAt?.toDate?.() || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    const brandRoutes = brands.map((brand) => ({
        url: `${baseUrl}/new-home/brands/${brand.slug || brand.id}`,
        lastModified: brand.updatedAt?.toDate?.() || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    const blogRoutes = posts.map((post) => ({
        url: `${baseUrl}/new-home/smart-tips/${post.slug}`,
        lastModified: post.updatedAt?.toDate?.() || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    return [...staticEntries, ...serviceRoutes, ...brandRoutes, ...blogRoutes]
}
