import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { verifyInvitationToken, isInvitationExpired } from '@/lib/invitations'
import { hashValue } from '@/lib/hashing'
import { validatePassword } from '@/lib/password'
import { Timestamp } from 'firebase-admin/firestore'

export const runtime = 'nodejs'
export const maxDuration = 30

/**
 * POST /api/admin/invitations/complete
 * Complete admin setup via invitation link
 *
 * Body:
 * - token: Invitation token from email link
 * - email: Email address of admin being invited
 * - password: New password for admin account
 * - passwordConfirm: Password confirmation
 * - adminName: Display name for admin
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { token, email, password, passwordConfirm, adminName } = body

    // Validate inputs
    if (!token || !email || !password || !passwordConfirm || !adminName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (password !== passwordConfirm) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        {
          error: 'Password does not meet requirements',
          requirements: passwordValidation.requirements,
          feedback: passwordValidation.feedback,
        },
        { status: 400 }
      )
    }

    // Find and validate invitation
    const invitationsRef = adminDb.collection('admin_invitations')
    const invitationQuery = await invitationsRef
      .where('email', '==', email)
      .where('used', '==', false)
      .limit(1)
      .get()

    if (invitationQuery.empty) {
      return NextResponse.json(
        { error: 'Invitation not found or already used' },
        { status: 404 }
      )
    }

    const invitationDoc = invitationQuery.docs[0]
    const invitationData = invitationDoc.data()

    // Verify invitation token
    const tokenValid = await verifyInvitationToken(
      token,
      invitationData.tokenHash
    )
    if (!tokenValid) {
      return NextResponse.json(
        { error: 'Invalid invitation token' },
        { status: 400 }
      )
    }

    // Check if invitation has expired
    const expiresAt = invitationData.expiresAt?.toDate?.() || new Date(0)
    if (isInvitationExpired(expiresAt)) {
      return NextResponse.json(
        { error: 'Invitation has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Hash password for storage (Firebase Auth will handle the actual password)
    const passwordHash = await hashValue(password)

    // Create admin user document in Firestore
    const userId = invitationData.createdBy || `admin_${Date.now()}`
    const userRef = adminDb.collection('users').doc(email)

    await userRef.set(
      {
        id: email,
        email,
        name: adminName,
        role: 'admin',
        passwordHash, // For additional security
        passwordChangedAt: Timestamp.now(),
        twoFactor: {
          enabled: false,
          method: 'authenticator',
          verified: false,
          backupCodesCount: 0,
        },
        security: {
          passwordChangedAt: Timestamp.now(),
          passwordExpiryDays: 90,
          loginAttempts: 0,
          lastLoginAt: null,
          lastPasswordChangeAt: Timestamp.now(),
          trustedDevices: [],
        },
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
      { merge: true }
    )

    // Mark invitation as used
    await invitationDoc.ref.update({
      used: true,
      usedAt: Timestamp.now(),
      usedBy: email,
    })

    // Create audit log
    await adminDb.collection('security_audit_logs').add({
      adminId: email,
      event: 'ADMIN_ONBOARDING_COMPLETED',
      status: 'SUCCESS',
      details: {
        email,
        adminName,
        invitationId: invitationDoc.id,
      },
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
      timestamp: Timestamp.now(),
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Admin account created successfully',
        email,
        adminName,
        nextStep: '2fa_setup',
        nextStepMessage:
          'You will now be prompted to set up two-factor authentication',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin invitation completion error:', error)
    return NextResponse.json(
      { error: 'Failed to complete admin setup' },
      { status: 500 }
    )
  }
}
