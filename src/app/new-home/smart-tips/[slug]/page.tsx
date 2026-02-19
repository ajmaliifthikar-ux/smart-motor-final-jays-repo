import { Metadata } from 'next'
import { JsonLd } from "@/components/seo/JsonLd"
import { WithContext, BlogPosting, BreadcrumbList, ListItem, Person, Organization, ImageObject, WebPage } from "schema-dts"
import { BlogPostClient } from '@/components/v2/sections/blog-post-client'
import Link from 'next/link'
import { adminGetAllPublishedContent } from '@/lib/firebase-admin'
import { BlogPost } from '@/types/v2'

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
    try {
        const posts = await adminGetAllPublishedContent('BLOG')
        return posts.map(p => ({ slug: p.slug }))
    } catch {
        return []
    }
}

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params
    const slug = params.slug

    const allContent = await adminGetAllPublishedContent('BLOG')
    const post = allContent.find(p => p.slug === slug)

    if (!post) {
        return {
            title: 'Article Not Found',
        }
    }

    const excerpt = post.content?.substring(0, 160) || ''

    return {
        title: `${post.title} | Smart Motor Tips`,
        description: excerpt,
        openGraph: {
            title: post.title,
            description: excerpt,
            type: 'article',
            authors: [post.author || 'Smart Motor'],
        },
    }
}

export default async function BlogPostPage(props: Props) {
    const params = await props.params
    const slug = params.slug

    const allContent = await adminGetAllPublishedContent('BLOG')
    const postData = allContent.find(c => c.slug === slug)

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
        excerpt: postData.content?.substring(0, 160) || '',
        content: postData.content,
        date: postData.createdAt.toDate().toLocaleDateString('en-GB'),
        author: postData.author || 'Smart Motor Team',
        category: 'General',
        image: '/bg-placeholder.jpg'
    }

    // Find related posts (exclude current, take 2)
    const relatedPostsData = allContent
        .filter(c => c.slug !== slug)
        .slice(0, 2)

    const relatedPosts: BlogPost[] = relatedPostsData.map(p => ({
        id: p.id,
        slug: p.slug,
        title: p.title,
        excerpt: p.content?.substring(0, 160) || '',
        content: p.content,
        date: p.createdAt.toDate().toLocaleDateString('en-GB'),
        author: p.author || 'Smart Motor Team',
        category: 'General',
        image: '/bg-placeholder.jpg'
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
