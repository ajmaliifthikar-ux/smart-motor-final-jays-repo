'use server'

import { cookies, headers } from 'next/headers'
import { verifySession } from '@/lib/firebase-admin'

export async function setSessionCookie(idToken: string) {
    const cookieStore = await cookies()

    // Set the token in a secure, httpOnly cookie
    cookieStore.set('firebase-token', idToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 5 // 5 days
    })

    // Fire login notification (non-blocking)
    try {
        const decoded = await verifySession(idToken)
        const headerStore = await headers()
        const ip = headerStore.get('x-forwarded-for') || headerStore.get('x-real-ip') || 'unknown'
        const ua = headerStore.get('user-agent') || 'unknown'
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://smartmotorlatest.vercel.app'

        fetch(`${appUrl}/api/notifications/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-notification-key': process.env.NOTIFICATION_SECRET || 'sm-notify-secret',
            },
            body: JSON.stringify({
                event: 'login',
                data: {
                    email: decoded?.email || 'unknown',
                    time: new Date().toLocaleString('en-AE', { timeZone: 'Asia/Dubai' }),
                    ip,
                    device: ua.length > 80 ? ua.slice(0, 80) + '…' : ua,
                },
            }),
        }).catch(() => {}) // Non-blocking — never fail the login
    } catch {}

    return { success: true }
}

export async function removeSessionCookie() {
    const cookieStore = await cookies()
    cookieStore.delete('firebase-token')
    return { success: true }
}
