import { NextRequest, NextResponse } from 'next/server'
import { adminAuth, adminDb } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

const COOKIE_NAME = 'user-token'

export async function GET(req: NextRequest) {
  try {
    // 1. Get token from cookie
    const token = req.cookies.get(COOKIE_NAME)?.value
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized — no session token' },
        { status: 401 }
      )
    }

    // 2. Verify with Firebase Admin Auth
    let decoded: { uid: string; email?: string }
    try {
      decoded = await adminAuth.verifyIdToken(token)
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired session' },
        { status: 401 }
      )
    }

    const userEmail = decoded.email
    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: 'No email associated with account' },
        { status: 400 }
      )
    }

    // 3. Query Firestore bookings collection where email matches
    const snapshot = await adminDb
      .collection('bookings')
      .where('email', '==', userEmail)
      .orderBy('date', 'desc')
      .get()

    const bookings = snapshot.docs.map((doc) => {
      const data = doc.data()
      // Serialize Firestore Timestamps
      const date =
        data.date && typeof data.date.toDate === 'function'
          ? data.date.toDate().toISOString()
          : data.date ?? null

      const createdAt =
        data.createdAt && typeof data.createdAt.toDate === 'function'
          ? data.createdAt.toDate().toISOString()
          : data.createdAt ?? null

      return {
        id: doc.id,
        serviceName: data.serviceName ?? data.serviceId ?? 'Service',
        date: date
          ? new Date(date).toLocaleDateString('en-AE', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'N/A',
        time: data.time ?? 'N/A',
        status: (data.status ?? 'pending') as 'pending' | 'confirmed' | 'completed' | 'cancelled',
        vehicle: data.brand && data.model ? `${data.brand} ${data.model}` : undefined,
        cost: data.cost ? `AED ${data.cost}` : undefined,
        createdAt,
      }
    })

    return NextResponse.json({ success: true, bookings })
  } catch (error) {
    console.error('[GET /api/user/bookings] error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
