import { NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const session = await getAdminSession()
        if (!session) {
            return NextResponse.json({ user: null }, { status: 401 })
        }
        return NextResponse.json({ 
            user: {
                id: session.uid,
                email: session.email,
                role: session.role || 'ADMIN',
                name: session.name || session.email?.split('@')[0]
            } 
        })
    } catch (error) {
        return NextResponse.json({ user: null }, { status: 401 })
    }
}
