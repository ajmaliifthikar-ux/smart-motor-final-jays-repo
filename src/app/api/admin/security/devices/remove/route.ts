import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/session'
import { adminDb } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

export const runtime = 'nodejs'
export const maxDuration = 30

/**
 * DELETE /api/admin/security/devices/remove
 * Remove a trusted device
 *
 * Body:
 * - deviceId: ID of device to remove
 */
export async function DELETE(req: NextRequest) {
  try {
    // Verify admin session
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const adminId = session.uid
    const body = await req.json()
    const { deviceId } = body

    if (!deviceId) {
      return NextResponse.json({ error: 'Device ID is required' }, { status: 400 })
    }

    // Get user document
    const userDoc = await adminDb.collection('users').doc(adminId)
    const userData = await userDoc.get()

    if (!userData.exists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const devices = userData.data()?.security?.trustedDevices || []
    const updatedDevices = devices.filter((d: any) => d.deviceId !== deviceId)

    // Update user document
    await userDoc.update({
      security: {
        ...userData.data()?.security,
        trustedDevices: updatedDevices,
      },
      updatedAt: Timestamp.now(),
    })

    // Create audit log
    await adminDb.collection('security_audit_logs').add({
      adminId,
      event: 'DEVICE_REMOVED',
      status: 'SUCCESS',
      details: {
        deviceId,
      },
      ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
      userAgent: req.headers.get('user-agent') || 'unknown',
      timestamp: Timestamp.now(),
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Device removed successfully',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Device removal error:', error)
    return NextResponse.json(
      { error: 'Failed to remove device' },
      { status: 500 }
    )
  }
}
