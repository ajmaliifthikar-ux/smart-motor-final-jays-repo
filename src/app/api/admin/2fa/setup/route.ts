import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'
import { generateTOTPSecret } from '@/lib/totp'
import { adminDb } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

export const runtime = 'nodejs'
export const maxDuration = 30

/**
 * POST /api/admin/2fa/setup
 * Generate TOTP secret and QR code for 2FA setup
 * Requires admin authentication
 *
 * Returns:
 * - secret: Base32 encoded TOTP secret
 * - qrCode: Data URL with QR code image
 * - manualEntry: Secret for manual entry if QR doesn't work
 * - setupId: Temporary ID for this setup session (10-minute expiry)
 */
export async function POST(req: NextRequest) {
  try {
    // Verify admin session
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminId = session.uid
    const email = session.email

    // Generate TOTP secret
    const { secret, qrCode, manualEntry } = await generateTOTPSecret(
      email,
      session.name || email.split('@')[0]
    )

    // Store temporary setup session (10-minute expiry)
    const setupId = `2fa_setup_${adminId}_${Date.now()}`
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await adminDb
      .collection('admin_2fa_sessions')
      .doc(setupId)
      .set({
        adminId,
        email,
        secret, // Store secret temporarily
        status: 'pending', // pending -> verified -> confirmed
        createdAt: Timestamp.now(),
        expiresAt: Timestamp.fromDate(expiresAt),
        verified: false,
      })

    // Return secret and QR code
    return NextResponse.json(
      {
        success: true,
        setupId, // Client should send this back when verifying
        secret, // For manual entry
        qrCode, // For scanning
        manualEntry,
        expiresIn: 600, // 10 minutes in seconds
        warning:
          'Save your backup codes in a safe place after verification. You will need them if you lose access to your authenticator.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('2FA setup error:', error)
    return NextResponse.json(
      { error: 'Failed to setup 2FA' },
      { status: 500 }
    )
  }
}
