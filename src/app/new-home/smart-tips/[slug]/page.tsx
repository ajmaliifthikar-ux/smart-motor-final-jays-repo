import { Metadata } from 'next'
import { JsonLd } from "@/components/seo/JsonLd"
import { WithContext, BlogPosting, BreadcrumbList, ListItem, Person, Organization, ImageObject, WebPage } from "schema-dts"
import { BlogPostClient } from '@/components/v2/sections/blog-post-client'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { BlogPost } from '@/types/v2'

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    try {
        const posts = await prisma.blogPost.findMany({
            where: { isPublished: true },
            select: { slug: true }
        })
        return posts.map(p => ({ slug: p.slug }))
    } catch {
        return []
    }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params
    const slug = params.slug

    const post = await prisma.blogPost.findUnique({
        where: { slug }
    })

    if (!post) {
        return {
            title: 'Article Not Found',
        }
    }

    return {
        title: `${post.title} | Smart Motor Tips`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.publishedAt?.toISOString(),
            authors: [post.author || 'Smart Motor'],
            images: post.image ? [{ url: post.image }] : undefined,
        },
    }
}

export default async function BlogPostPage(props: Props) {
    const params = await props.params
    const slug = params.slug

    const postData = await prisma.blogPost.findUnique({
        where: { slug }
    })

    if (!postData) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-black mb-4">Article Not Found</h1>
                    <Link href="/new-home/smart-tips" className="text-[#E62329] font-bold uppercase underline">Back to Tips</Link>
                </div>
            </div>
        )
    }

    // Transform to BlogPost type
    const post: BlogPost = {
        id: postData.id,
        slug: postData.slug,
        title: postData.title,
        excerpt: postData.excerpt,
        content: postData.content,
        date: postData.publishedAt ? postData.publishedAt.toLocaleDateString('en-GB') : '',
        author: postData.author || 'Smart Motor Team',
        category: postData.category || 'General',
        image: postData.image || '/bg-placeholder.jpg'
    }

    // Find related posts (exclude current, take 2)
    const relatedPostsData = await prisma.blogPost.findMany({
        where: {
            isPublished: true,
            slug: { not: slug }
        },
        take: 2,
        orderBy: { publishedAt: 'desc' }
    })

    const relatedPosts: BlogPost[] = relatedPostsData.map(p => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        date: p.publishedAt ? p.publishedAt.toLocaleDateString('en-GB') : '',
        author: p.author || 'Smart Motor Team',
        category: p.category || 'General',
        image: p.image || '/bg-placeholder.jpg'
    }))

    const jsonLd: WithContext<BlogPosting> = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        image: post.image ? [post.image] : undefined,
        datePublished: post.date,
        author: {
            "@type": "Person",
            name: post.author
        } as Person,
        publisher: {
            "@type": "Organization",
            name: "Smart Motor Auto Repair",
            logo: {
                "@type": "ImageObject",
                url: "https://smartmotor.ae/branding/logo.png"
            } as ImageObject
        } as Organization,
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": `https://smartmotor.ae/new-home/smart-tips/${post.slug}`
        } as WebPage
    };

    const breadcrumbLd: WithContext<BreadcrumbList> = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://smartmotor.ae/new-home"
            } as ListItem,
            {
                "@type": "ListItem",
                position: 2,
                name: "Smart Tips",
                item: "https://smartmotor.ae/new-home/smart-tips"
            } as ListItem,
            {
                "@type": "ListItem",
                position: 3,
                name: post.title,
                item: `https://smartmotor.ae/new-home/smart-tips/${post.slug}`
            } as ListItem
        ]
    };

    return (
        <>
            <JsonLd data={jsonLd} />
            <JsonLd data={breadcrumbLd} />
            <BlogPostClient post={post} relatedPosts={relatedPosts} />
        </>
    )
}
