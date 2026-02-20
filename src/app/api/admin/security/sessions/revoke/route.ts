import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'
import { adminDb } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

export const runtime = 'nodejs'
export const maxDuration = 30

/**
 * POST /api/admin/security/sessions/revoke
 * Revoke active session(s)
 *
 * Body:
 * - sessionId: ID of specific session to revoke
 * - revokeAllOthers: Boolean to revoke all other sessions
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
    const { sessionId, revokeAllOthers } = body

    if (!sessionId && !revokeAllOthers) {
      return NextResponse.json(
        { error: 'Either sessionId or revokeAllOthers is required' },
        { status: 400 }
      )
    }

    // Get user document
    const userDoc = await adminDb.collection('users').doc(adminId)
    const userData = await userDoc.get()

    if (!userData.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const sessions = userData.data()?.security?.sessions || []
    let updatedSessions = sessions

    if (revokeAllOthers) {
      // Keep only current session
      updatedSessions = sessions.filter((s: any) => s.id === session.sessionId)
    } else if (sessionId) {
      // Remove specific session
      updatedSessions = sessions.filter((s: any) => s.id !== sessionId)
    }

    // Update user document
    await userDoc.update({
      security: {
        ...userData.data()?.security,
        sessions: updatedSessions,
      },
      updatedAt: Timestamp.now(),
    })

    // Create audit log
    await adminDb.collection('security_audit_logs').add({
      adminId,
      event: 'SESSION_REVOKED',
      status: 'SUCCESS',
      details: {
        revokeAllOthers,
        sessionId,
      },
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
      timestamp: Timestamp.now(),
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Session revoked successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Session revocation error:', error)
    return NextResponse.json(
      { error: 'Failed to revoke session' },
      { status: 500 }
    )
  }
}
