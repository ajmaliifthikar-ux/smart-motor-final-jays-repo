import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'

const USER_COOKIE  = 'user-token'
const ADMIN_COOKIE = 'firebase-token'
const MAX_AGE_USER  = 60 * 60 * 24 * 7  // 7 days
const MAX_AGE_ADMIN = 60 * 60 * 24 * 5  // 5 days (matches admin auth)

// ─── POST /api/user/session ───────────────────────────────────────────────────
// Unified session creation for both regular users AND admin users.
// Both share the same Firebase Auth project.
// Admins (email ending @smartmotor.ae OR role===ADMIN) also get the admin cookie set.
export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { idToken } = body as { idToken?: string }

        if (!idToken) {
            return NextResponse.json({ success: false, error: 'idToken is required' }, { status: 400 })
        }

        const decoded = await adminAuth.verifyIdToken(idToken)
        const email = decoded.email ?? ''
        // Strict role check, no email whitelist
        const isAdmin = decoded.role === 'ADMIN'

        const response = NextResponse.json({
            success: true,
            uid: decoded.uid,
            email,
            displayName: decoded.name ?? null,
            role: isAdmin ? 'ADMIN' : 'USER',
        })

        const isProd = process.env.NODE_ENV === 'production'

        // Always set the user cookie
        response.cookies.set(USER_COOKIE, idToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
            maxAge: MAX_AGE_USER,
            path: '/',
        })

        // Also set the admin cookie if they're an admin — so /admin layout works
        if (isAdmin) {
            response.cookies.set(ADMIN_COOKIE, idToken, {
                httpOnly: true,
                secure: isProd,
                sameSite: 'lax',
                maxAge: MAX_AGE_ADMIN,
                path: '/',
            })
        }

        return response
    } catch (error) {
        console.error('[user/session POST] error:', error)
        return NextResponse.json({ success: false, error: 'Invalid or expired token' }, { status: 401 })
    }
}

// ─── DELETE /api/user/session — clear ALL session cookies ────────────────────
export async function DELETE() {
    const response = NextResponse.json({ success: true })
    const isProd = process.env.NODE_ENV === 'production'

    for (const name of [USER_COOKIE, ADMIN_COOKIE]) {
        response.cookies.set(name, '', {
            httpOnly: true,
            secure: isProd,
            sameSite: 'lax',
            maxAge: 0,
            path: '/',
        })
    }
    return response
}
