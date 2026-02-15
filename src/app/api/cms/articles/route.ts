import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

// Schema for creating an article
const articleSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1),
    seoTitle: z.string().optional(),
    seoDesc: z.string().optional(),
    keywords: z.string().optional(),
    isPublished: z.boolean().default(false),
})

export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const articles = await prisma.article.findMany({
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(articles)
    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const { title, content, seoTitle, seoDesc, keywords, isPublished } = articleSchema.parse(body)

        // Generate slug from title
        const slug = title
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-4)

        const article = await prisma.article.create({
            data: {
                title,
                slug,
                content,
                seoTitle,
                seoDesc: seoDesc || title,
                keywords: keywords || '',
                isPublished
            }
        })

        return NextResponse.json(article)
    } catch (error) {
        console.error('[ARTICLES_POST]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
