import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://smartmotor.ae'

    // Static routes (verified existence)
    const routes = [
        '',
        '/new-home',
        '/new-home/about',
        '/new-home/contact',
        '/new-home/brands',
        // '/new-home/services', // Removed as page.tsx doesn't exist in that folder
        '/new-home/smart-tips',
        '/new-home/packages', // Added packages
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
            prisma.service.findMany({
                select: { slug: true, updatedAt: true },
                where: { isEnabled: true }
            }),
            prisma.brand.findMany({
                select: { slug: true, id: true, updatedAt: true }
            }),
            prisma.blogPost.findMany({
                where: { isPublished: true },
                select: { slug: true, updatedAt: true, publishedAt: true }
            }),
        ])
        services = s
        brands = b
        posts = p
    } catch (e) {
        console.error("Sitemap DB Error", e)
    }

    const serviceRoutes = services.map((service) => ({
        url: `${baseUrl}/new-home/services/${service.slug}`,
        lastModified: service.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.9,
    }))

    const brandRoutes = brands.map((brand) => ({
        url: `${baseUrl}/new-home/brands/${brand.slug || brand.id}`,
        lastModified: brand.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
    }))

    const blogRoutes = posts.map((post) => ({
        url: `${baseUrl}/new-home/smart-tips/${post.slug}`,
        lastModified: post.publishedAt || post.updatedAt,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    return [...staticEntries, ...serviceRoutes, ...brandRoutes, ...blogRoutes]
}
