import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { generateProductionReportEmail } from '@/lib/emails/production-report'

/**
 * POST /api/send-deployment-report
 * Sends the production deployment report to stakeholders
 *
 * Body: {
 *   recipients: string[] - Email addresses to send to
 *   recipientName: string - Name of primary recipient
 * }
 */
export async function POST(request: NextRequest) {
    try {
        const { recipients, recipientName = 'Team' } = await request.json()

        if (!recipients || recipients.length === 0) {
            return NextResponse.json(
                { error: 'No recipients specified' },
                { status: 400 }
            )
        }

        const html = generateProductionReportEmail(recipientName)

        const result = await sendEmail({
            to: recipients,
            subject: '🚀 Smart Motor Platform - Production Deployment Report',
            html,
            text: `Smart Motor Platform is production-ready. All systems operational. Access admin dashboard at ${process.env.NEXT_PUBLIC_APP_URL}/admin/dashboard`,
            replyTo: 'hello@smartmotor.ae',
            listUnsubscribeUrl: `${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe`,
        })

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: `Report sent to ${recipients.length} recipient(s)`,
                messageId: result.messageId,
            })
        } else {
            return NextResponse.json(
                { error: result.error || 'Failed to send report' },
                { status: 500 }
            )
        }
    } catch (error) {
        console.error('Deployment report error:', error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        )
    }
}
