import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'
import { adminDb } from '@/lib/firebase-admin'

export const runtime = 'nodejs'
export const maxDuration = 30

/**
 * GET /api/admin/2fa/status
 * Get 2FA status for current admin
 */
export async function GET(req: NextRequest) {
  try {
    // Verify admin session
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminId = session.uid

    // Get user's 2FA config
    const userDoc = await adminDb.collection('users').doc(adminId).get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userData = userDoc.data()
    const twoFactorConfig = userData?.twoFactor

    return NextResponse.json(
      {
        twoFactorEnabled: twoFactorConfig?.enabled || false,
        twoFactorMethod: twoFactorConfig?.method,
        verified: twoFactorConfig?.verified || false,
        backupCodesCount: twoFactorConfig?.backupCodesCount || 0,
        lastVerified: twoFactorConfig?.lastVerified?.toDate?.(),
        lastPasswordChange: userData?.security?.lastPasswordChangeAt?.toDate?.(),
        trustedDevices: userData?.security?.trustedDevices || [],
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('2FA status error:', error)
    return NextResponse.json(
      { error: 'Failed to get 2FA status' },
      { status: 500 }
    )
  }
}
