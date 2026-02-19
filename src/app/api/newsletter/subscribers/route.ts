import { NextRequest, NextResponse } from 'next/server'
import admin from '@/lib/firebase-admin'
import { getAdminSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

// Convert RTDB key back to email
function keyToEmail(key: string): string {
    return key.replace(/_DOT_/g, '.').replace(/_AT_/g, '@')
}

export async function GET(req: NextRequest) {
    // Require admin session
    const session = await getAdminSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const rtdb = admin.database()
        const snapshot = await rtdb.ref('subscribers').get()

        if (!snapshot.exists()) {
            return NextResponse.json({ subscribers: [], total: 0, active: 0 })
        }

        const raw = snapshot.val() as Record<string, any>
        const subscribers = Object.entries(raw).map(([key, val]) => ({
            id: key,
            email: val.email || keyToEmail(key),
            isActive: val.isActive ?? true,
            createdAt: val.createdAt ? new Date(val.createdAt).toISOString() : null,
            updatedAt: val.updatedAt ? new Date(val.updatedAt).toISOString() : null,
        }))

        // Sort newest first
        subscribers.sort((a, b) => {
            if (!a.createdAt) return 1
            if (!b.createdAt) return -1
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })

        const active = subscribers.filter(s => s.isActive).length

        return NextResponse.json({ subscribers, total: subscribers.length, active })
    } catch (error) {
        console.error('Subscribers list error:', error)
        return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
    }
}

// PATCH /api/newsletter/subscribers — toggle active status
export async function PATCH(req: NextRequest) {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { id, isActive } = await req.json()
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

        const rtdb = admin.database()
        await rtdb.ref(`subscribers/${id}`).update({ isActive, updatedAt: Date.now() })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Subscriber update error:', error)
        return NextResponse.json({ error: 'Update failed' }, { status: 500 })
    }
}

// DELETE /api/newsletter/subscribers — remove subscriber
export async function DELETE(req: NextRequest) {
    const session = await getAdminSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

        const rtdb = admin.database()
        await rtdb.ref(`subscribers/${id}`).remove()

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Subscriber delete error:', error)
        return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
    }
}
