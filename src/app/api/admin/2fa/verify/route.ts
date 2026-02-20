import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'
import { verifyTOTPCode, generateBackupCodes } from '@/lib/totp'
import { hashMultiple } from '@/lib/hashing'
import { adminDb, adminAuth } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

export const runtime = 'nodejs'
export const maxDuration = 30

/**
 * POST /api/admin/2fa/verify
 * Verify TOTP code and enable 2FA for admin account
 * Requires admin authentication and valid setup session
 *
 * Body:
 * - setupId: ID from setup session
 * - code: 6-digit code from authenticator app
 * - generateBackupCodes: Whether to generate new backup codes (default: true)
 *
 * Returns:
 * - success: true/false
 * - backupCodes: Array of backup codes (if generateBackupCodes=true)
 * - message: Status message
 */
export async function POST(req: NextRequest) {
  try {
    // Verify admin session
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminId = session.uid
    const body = await req.json()
    const { setupId, code, generateCodes = true } = body

    // Validate inputs
    if (!setupId || !code) {
      return NextResponse.json(
        { error: 'Missing setupId or code' },
        { status: 400 }
      )
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { error: 'Invalid code format' },
        { status: 400 }
      )
    }

    // Retrieve setup session
    const setupDoc = await adminDb
      .collection('admin_2fa_sessions')
      .doc(setupId)
      .get()

    if (!setupDoc.exists) {
      return NextResponse.json(
        { error: 'Setup session not found' },
        { status: 404 }
      )
    }

    const setupData = setupDoc.data()

    // Verify setup session belongs to current admin
    if (setupData?.adminId !== adminId) {
      return NextResponse.json(
        { error: 'Setup session does not belong to current user' },
        { status: 403 }
      )
    }

    // Check if setup session has expired
    const expiresAt = setupData?.expiresAt?.toDate?.() || new Date(0)
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Setup session has expired' },
        { status: 400 }
      )
    }

    // Verify TOTP code against secret
    const secret = setupData?.secret
    if (!secret) {
      return NextResponse.json(
        { error: 'No secret found in setup session' },
        { status: 400 }
      )
    }

    const isCodeValid = verifyTOTPCode(secret, code)
    if (!isCodeValid) {
      return NextResponse.json(
        { error: 'Invalid code' },
        { status: 400 }
      )
    }

    // Generate backup codes if requested
    let backupCodes: string[] = []
    let backupCodeHashes: string[] = []

    if (generateCodes) {
      backupCodes = generateBackupCodes(10)
      backupCodeHashes = await hashMultiple(backupCodes)
    }

    // Save 2FA configuration to user document
    const userRef = adminDb.collection('users').doc(adminId)

    await userRef.set(
      {
        twoFactor: {
          enabled: true,
          method: 'authenticator',
          secret, // Store encrypted secret in production
          verified: true,
          backupCodesCount: backupCodeHashes.length,
          backupCodes: backupCodeHashes, // Store hashes, not plain codes
          lastVerified: Timestamp.now(),
        },
      },
      { merge: true }
    )

    // Create audit log entry
    await adminDb.collection('security_audit_logs').add({
      adminId,
      event: '2FA_ENABLED',
      status: 'SUCCESS',
      details: {
        method: 'authenticator',
        backupCodesGenerated: backupCodes.length,
      },
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
      timestamp: Timestamp.now(),
    })

    // Delete setup session after successful verification
    await adminDb.collection('admin_2fa_sessions').doc(setupId).delete()

    return NextResponse.json(
      {
        success: true,
        message: '2FA enabled successfully',
        backupCodes: generateCodes ? backupCodes : undefined,
        backupCodesWarning:
          'These backup codes allow you to access your account if you lose your authenticator. Save them in a secure location.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('2FA verification error:', error)
    return NextResponse.json(
      { error: 'Failed to verify 2FA' },
      { status: 500 }
    )
  }
}
