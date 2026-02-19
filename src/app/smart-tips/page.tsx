import { Navbar } from '@/components/v2/layout/navbar'
import { Footer } from '@/components/v2/layout/footer'
import { adminGetAllPublishedContent } from '@/lib/firebase-admin'
import { BlogPost } from '@/types/v2'
import { SmartTipsList } from '@/components/v2/sections/smart-tips-list'
import { SmartTipsHero } from '@/components/v2/sections/smart-tips-hero'
import { BookingForm } from '@/components/sections/booking-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Car Maintenance Tips & Automotive News | Smart Motor Abu Dhabi',
    description: 'Expert car maintenance tips, repair guides & automotive news from Smart Motor Abu Dhabi. Stay informed with insights from certified technicians in Musaffah.',
    alternates: {
        canonical: 'https://smartmotor.ae/smart-tips',
        languages: {
            'en': 'https://smartmotor.ae/smart-tips',
            'x-default': 'https://smartmotor.ae/smart-tips',
        },
    },
}

export const revalidate = 3600

export default async function SmartTipsPage() {
    let postsData: any[] = []
    try {
        const content = await adminGetAllPublishedContent('BLOG')
        postsData = content
            .sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime())
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
