import { cookies } from 'next/headers'
import { verifySession } from './firebase-admin'

export async function getAdminSession() {
    const cookieStore = await cookies()
    const token = cookieStore.get('firebase-token')?.value
    return await verifySession(token)
}

export async function requireAdmin() {
    const session = await getAdminSession()
    if (!session) {
        throw new Error('Unauthorized')
    }
    return session
}
