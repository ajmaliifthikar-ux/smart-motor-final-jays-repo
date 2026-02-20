import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'
import { verifyTOTPCode, generateBackupCodes } from '@/lib/totp'
import { hashMultiple, verifyHash } from '@/lib/hashing'
import { adminDb } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

export const runtime = 'nodejs'
export const maxDuration = 30

/**
 * POST /api/admin/2fa/backup-codes/regenerate
 * Regenerate backup codes for 2FA
 *
 * Body:
 * - totpCode: 6-digit TOTP code (optional if using backup code)
 * - backupCode: Existing backup code (optional if using TOTP)
 * - password: Current password for verification
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
    const { totpCode, backupCode, password } = body

    // Validate inputs
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      )
    }

    if (!totpCode && !backupCode) {
      return NextResponse.json(
        { error: 'Either TOTP code or backup code is required' },
        { status: 400 }
      )
    }

    // Get user's 2FA config
    const userDoc = await adminDb.collection('users').doc(adminId).get()

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userData = userDoc.data()
    const twoFactorConfig = userData?.twoFactor

    if (!twoFactorConfig?.enabled) {
      return NextResponse.json(
        { error: '2FA is not enabled for this account' },
        { status: 400 }
      )
    }

    // Verify either TOTP or backup code
    let codeValid = false

    if (totpCode) {
      if (!/^\d{6}$/.test(totpCode)) {
        return NextResponse.json(
          { error: 'Invalid TOTP code format' },
          { status: 400 }
        )
      }
      codeValid = verifyTOTPCode(twoFactorConfig.secret, totpCode)
    } else if (backupCode) {
      // Verify backup code
      const backupCodes = twoFactorConfig.backupCodes || []
      for (const hash of backupCodes) {
        const isValid = await verifyHash(backupCode, hash)
        if (isValid) {
          codeValid = true
          // Remove used backup code
          const indexToRemove = backupCodes.indexOf(hash)
          if (indexToRemove > -1) {
            backupCodes.splice(indexToRemove, 1)
          }
          break
        }
      }
    }

    if (!codeValid) {
      // Log failed attempt
      await adminDb.collection('security_audit_logs').add({
        adminId,
        event: 'BACKUP_CODES_REGENERATION_FAILED',
        status: 'FAILED',
        details: {
          reason: 'Invalid code',
          codeType: totpCode ? 'TOTP' : 'BACKUP',
        },
        ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown',
        timestamp: Timestamp.now(),
      })

      return NextResponse.json(
        { error: 'Invalid code' },
        { status: 400 }
      )
    }

    // Generate new backup codes
    const newBackupCodes = generateBackupCodes(10)
    const backupCodeHashes = await hashMultiple(newBackupCodes)

    // Update user document with new backup codes
    await userDoc.ref.update({
      twoFactor: {
        ...twoFactorConfig,
        backupCodesCount: backupCodeHashes.length,
        backupCodes: backupCodeHashes,
      },
      updatedAt: Timestamp.now(),
    })

    // Create audit log
    await adminDb.collection('security_audit_logs').add({
      adminId,
      event: 'BACKUP_CODES_REGENERATED',
      status: 'SUCCESS',
      details: {
        codesGenerated: newBackupCodes.length,
      },
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
      timestamp: Timestamp.now(),
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Backup codes regenerated successfully',
        backupCodes: newBackupCodes,
        backupCodesWarning:
          'Your old backup codes are no longer valid. Save these new codes in a secure location.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Backup codes regeneration error:', error)
    return NextResponse.json(
      { error: 'Failed to regenerate backup codes' },
      { status: 500 }
    )
  }
}
