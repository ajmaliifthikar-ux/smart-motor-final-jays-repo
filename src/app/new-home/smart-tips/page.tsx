import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'
import dynamic from 'next/dynamic'
import { prisma } from '@/lib/prisma'
import { BlogPost } from '@/types/v2'
import { SmartTipsList } from '@/components/v2/sections/smart-tips-list'
import { SmartTipsHero } from '@/components/v2/sections/smart-tips-hero'
import { Metadata } from 'next'

import { BookingForm } from '@/components/sections/booking-form'

export const metadata: Metadata = {
    title: 'Car Maintenance Tips & News | Smart Motor Abu Dhabi',
    description: 'Expert advice on car repair, maintenance, and diagnostics from Smart Motor Abu Dhabi. Stay informed with our latest automotive insights.',
}

export const revalidate = 3600

export default async function SmartTipsPage() {
    let postsData: any[] = []
    try {
        postsData = await prisma.blogPost.findMany({
            where: { isPublished: true },
            orderBy: { createdAt: 'desc' } // publishedAt is nullable, verify sort
        })
    } catch (e) {
        console.error("DB Error", e);
    }

    const posts: BlogPost[] = postsData.map(p => ({
        id: p.id,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        date: p.publishedAt ? p.publishedAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : p.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
        slug: p.slug,
        image: p.image || '/bg-placeholder.jpg',
        category: p.category || 'Automotive',
        author: p.author || 'Smart Motor Team'
    }))

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <SmartTipsHero />

            {/* Blog Grid */}
            <section className="py-24 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 md:px-12">
                    <SmartTipsList posts={posts} />
                </div>
            </section>

            <BookingForm />
            <Footer />
        </main>
    )
}
