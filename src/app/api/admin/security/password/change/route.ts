import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'
import { validatePassword } from '@/lib/password'
import { hashValue, verifyHash } from '@/lib/hashing'
import { adminDb } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

export const runtime = 'nodejs'
export const maxDuration = 30

/**
 * POST /api/admin/security/password/change
 * Change admin password
 *
 * Body:
 * - currentPassword: Current password for verification
 * - newPassword: New password (must meet requirements)
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
    const { currentPassword, newPassword } = body

    // Validate inputs
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current and new passwords are required' },
        { status: 400 }
      )
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        {
          error: 'New password does not meet requirements',
          requirements: passwordValidation.requirements,
        },
        { status: 400 }
      )
    }

    // Get user's stored password hash
    const userDoc = await adminDb.collection('users').doc(adminId).get()
    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const userData = userDoc.data()
    const storedPasswordHash = userData?.passwordHash

    // Verify current password
    if (storedPasswordHash) {
      const isPasswordCorrect = await verifyHash(currentPassword, storedPasswordHash)
      if (!isPasswordCorrect) {
        // Log failed attempt
        await adminDb.collection('security_audit_logs').add({
          adminId,
          event: 'PASSWORD_CHANGE_FAILED',
          status: 'FAILED',
          details: {
            reason: 'Invalid current password',
          },
          ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
          userAgent: req.headers.get('user-agent') || 'unknown',
          timestamp: Timestamp.now(),
        })

        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        )
      }
    }

    // Hash new password
    const newPasswordHash = await hashValue(newPassword)

    // Update user document
    await userDoc.ref.update({
      passwordHash: newPasswordHash,
      passwordChangedAt: Timestamp.now(),
      security: {
        ...userData?.security,
        passwordChangedAt: Timestamp.now(),
        lastPasswordChangeAt: Timestamp.now(),
      },
      updatedAt: Timestamp.now(),
    })

    // Create audit log
    await adminDb.collection('security_audit_logs').add({
      adminId,
      event: 'PASSWORD_CHANGED',
      status: 'SUCCESS',
      details: {
        changedAt: new Date().toISOString(),
      },
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
      timestamp: Timestamp.now(),
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Password changed successfully',
        warning: 'You may need to log in again with your new password',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    )
  }
}
