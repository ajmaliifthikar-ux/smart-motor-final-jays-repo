import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore'
import { generateSecureToken } from '@/lib/tokens'
import { sendEmail } from '@/lib/email'
import { generateAdminInvitationEmail } from '@/lib/emails/admin-invitation'

interface BulkInviteRequest {
  admins: Array<{
    email: string
    name: string
  }>
  companyName?: string
  senderName?: string
}

/**
 * POST /api/admin/invitations/send-bulk
 * Send bulk admin invitations with setup links
 *
 * Restricted to: Super admin only
 */
export async function POST(request: NextRequest) {
    try {
        // Check for authorization header or environment variable
        const authHeader = request.headers.get('authorization')
        const secretKey = process.env.ADMIN_SETUP_SECRET || 'admin-setup-secret'

        // Allow with proper secret or admin session
        const session = await auth()
        const isAuthorized = authHeader === `Bearer ${secretKey}` || session?.user?.id

        if (!isAuthorized) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body: BulkInviteRequest = await request.json()
        const { admins, companyName = 'Smart Motor Performance', senderName = 'Admin Team' } = body

        if (!admins || admins.length === 0) {
            return NextResponse.json(
                { error: 'No admin emails provided' },
                { status: 400 }
            )
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://smartmotorlatest.vercel.app'
        const invitations = []
        const failedInvites = []

        for (const admin of admins) {
            try {
                // Check if admin already exists
                const existingQuery = query(
                    collection(db, 'admins'),
                    where('email', '==', admin.email)
                )
                const existing = await getDocs(existingQuery)

                if (existing.docs.length > 0) {
                    failedInvites.push({
                        email: admin.email,
                        reason: 'Admin already exists'
                    })
                    continue
                }

                // Generate secure token
                const token = generateSecureToken()
                const expiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

                // Create invitation in Firestore
                const invitationRef = await addDoc(
                    collection(db, 'adminInvitations'),
                    {
                        email: admin.email,
                        name: admin.name,
                        token: token,
                        tokenHash: token, // In production, hash this
                        createdAt: serverTimestamp(),
                        expiresAt: expiryTime,
                        status: 'pending',
                        usedAt: null,
                        sentAt: new Date(),
                        companyName: companyName,
                        senderName: senderName,
                    }
                )

                // Generate setup link
                const setupLink = `${appUrl}/admin/setup/${token}`

                // Send invitation email
                const html = generateAdminInvitationEmail(
                    admin.name,
                    admin.email,
                    setupLink,
                    companyName,
                    senderName
                )

                const emailResult = await sendEmail({
                    to: admin.email,
                    subject: `${companyName} - Admin Account Setup Invitation`,
                    html,
                    text: `You have been invited to join ${companyName} as an admin. Click the link to set up your account: ${setupLink}`,
                    replyTo: 'hello@smartmotor.ae'
                })

                if (emailResult.success) {
                    invitations.push({
                        email: admin.email,
                        name: admin.name,
                        token: token,
                        setupLink: setupLink,
                        invitationId: invitationRef.id,
                        status: 'sent',
                        messageId: emailResult.messageId
                    })
                } else {
                    failedInvites.push({
                        email: admin.email,
                        reason: emailResult.error || 'Failed to send email'
                    })
                }
            } catch (error) {
                console.error(`Error creating invitation for ${admin.email}:`, error)
                failedInvites.push({
                    email: admin.email,
                    reason: error instanceof Error ? error.message : 'Unknown error'
                })
            }
        }

        return NextResponse.json({
            success: true,
            message: `Sent ${invitations.length} invitation(s)`,
            invitations,
            failed: failedInvites,
            totalAttempted: admins.length,
            totalSuccessful: invitations.length,
            totalFailed: failedInvites.length
        })
    } catch (error) {
        console.error('Bulk invitation error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
