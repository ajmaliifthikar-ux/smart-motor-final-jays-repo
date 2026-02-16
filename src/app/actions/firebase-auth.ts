'use server'

import { cookies } from 'next/headers'

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
    
    return { success: true }
}

export async function removeSessionCookie() {
    const cookieStore = await cookies()
    cookieStore.delete('firebase-token')
    return { success: true }
}
