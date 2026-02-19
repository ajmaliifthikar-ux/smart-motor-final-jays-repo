import { NextRequest, NextResponse } from 'next/server'
import { adminAuth } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

const COOKIE_NAME = 'user-token'

async function getDecodedToken(req: NextRequest) {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    return await adminAuth.verifyIdToken(token)
  } catch {
    return null
  }
}

// ─── GET /api/user/profile — return user profile ──────────────────────────────

export async function GET(req: NextRequest) {
  const decoded = await getDecodedToken(req)
  if (!decoded) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Return mock/stub profile — extend with real Firestore lookup as needed
  return NextResponse.json({
    success: true,
    profile: {
      uid: decoded.uid,
      name: decoded.name ?? decoded.email?.split('@')[0] ?? 'User',
      email: decoded.email ?? null,
      phone: decoded.phone_number ?? '',
      vehicles: [],
      loyaltyPoints: 0,
      notificationPreferences: {
        serviceReminders: true,
        bookingConfirmations: true,
        loyaltyRewards: true,
        marketingEmails: false,
      },
    },
  })
}

// ─── PATCH /api/user/profile — update user profile (stub) ────────────────────

export async function PATCH(req: NextRequest) {
  const decoded = await getDecodedToken(req)
  if (!decoded) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await req.json()

    // TODO: Persist to Firestore users collection
    // Example:
    // await adminDb.collection('users').doc(decoded.uid).set(
    //   { ...body, updatedAt: FieldValue.serverTimestamp() },
    //   { merge: true }
    // )

    console.log(`[PATCH /api/user/profile] uid=${decoded.uid} body=`, JSON.stringify(body))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[PATCH /api/user/profile] error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
