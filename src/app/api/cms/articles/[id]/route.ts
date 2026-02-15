import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const article = await prisma.article.findUnique({
            where: { id: params.id }
        })

        return NextResponse.json(article)
    } catch (error) {
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        const body = await req.json()
        const article = await prisma.article.update({
            where: { id: params.id },
            data: body
        })

        return NextResponse.json(article)
    } catch (error) {
        console.error('[ARTICLE_PATCH]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const session = await auth()
        if (!session || session.user.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 })
        }

        await prisma.article.delete({
            where: { id: params.id }
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('[ARTICLE_DELETE]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
