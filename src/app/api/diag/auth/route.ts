import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifySession } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

export async function GET() {
    const cookieStore = await cookies()
    const token = cookieStore.get('firebase-token')?.value
    
    let session = null
    let error = null

    try {
        session = await verifySession(token)
    } catch (e: any) {
        error = e.message
    }

    return NextResponse.json({
        hasToken: !!token,
        tokenValue: token ? (token.substring(0, 10) + '...') : null,
        session,
        error,
        env: {
            nodeEnv: process.env.NODE_ENV,
            projectIdMatches: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID === process.env.FIREBASE_PROJECT_ID
        }
    })
}
