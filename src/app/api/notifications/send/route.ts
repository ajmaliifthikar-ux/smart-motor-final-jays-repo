/**
 * Admin Notification API
 * Sends real-time event notifications to configured admin recipients
 *
 * Events: login, booking_new, booking_cancelled, content_updated, user_registered
 */

import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/email'
import { verifySession } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

type NotificationEvent = 'login' | 'booking_new' | 'booking_cancelled' | 'content_updated' | 'user_registered' | 'custom'

interface NotificationPayload {
  event: NotificationEvent
  data?: Record<string, string | number | boolean>
  subject?: string
  message?: string
}

const eventConfig: Record<NotificationEvent, { emoji: string; label: string; color: string }> = {
  login: { emoji: '🔐', label: 'Admin Login', color: '#4F46E5' },
  booking_new: { emoji: '📅', label: 'New Booking', color: '#059669' },
  booking_cancelled: { emoji: '❌', label: 'Booking Cancelled', color: '#DC2626' },
  content_updated: { emoji: '✏️', label: 'Content Updated', color: '#D97706' },
  user_registered: { emoji: '👤', label: 'New User Registered', color: '#7C3AED' },
  custom: { emoji: '🔔', label: 'Notification', color: '#E62329' },
}

function buildNotificationEmail(event: NotificationEvent, data: Record<string, string | number | boolean> = {}, customMessage?: string) {
  const config = eventConfig[event]
  const time = new Date().toLocaleString('en-AE', {
    timeZone: 'Asia/Dubai',
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit',
  })
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://smartmotorlatest.vercel.app'

  const dataRows = customMessage
    ? `<tr><td style="padding:12px 0;border-bottom:1px solid #ECECEA;"><span style="font-size:13px;color:#444;line-height:1.6;">${customMessage}</span></td></tr>`
    : Object.entries(data).map(([key, val]) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #ECECEA;">
          <span style="font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.1em;width:100px;display:inline-block;">${key.replace(/_/g, ' ')}</span>
          <span style="font-size:13px;font-weight:600;color:#222;">${val}</span>
        </td>
      </tr>`).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:24px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#121212;border-radius:16px 16px 0 0;padding:28px 36px;text-align:center;">
              <div style="font-size:36px;margin-bottom:8px;">${config.emoji}</div>
              <h2 style="margin:0;color:white;font-size:20px;font-weight:900;text-transform:uppercase;letter-spacing:-0.01em;">${config.label}</h2>
              <p style="margin:6px 0 0;font-size:11px;color:rgba(255,255,255,0.35);">${time} • UAE</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:white;border-radius:0 0 16px 16px;padding:28px 36px;">
              ${dataRows ? `<table width="100%" cellpadding="0" cellspacing="0">${dataRows}</table>` : '<p style="color:#999;font-size:13px;text-align:center;">No additional details</p>'}

              <div style="margin-top:24px;text-align:center;">
                <a href="${appUrl}/admin/dashboard"
                   style="display:inline-block;background:#E62329;color:white;text-decoration:none;font-size:11px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;padding:12px 28px;border-radius:10px;">
                  Open Dashboard →
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px;text-align:center;">
              <p style="margin:0;font-size:10px;color:#AAA;">Smart Motor Performance • Automated Alert System</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function POST(req: NextRequest) {
  try {
    // Internal requests can pass a special server-side key
    const serverKey = req.headers.get('x-notification-key')
    const isServerCall = serverKey === (process.env.NOTIFICATION_SECRET || 'sm-notify-secret')

    if (!isServerCall) {
      // For admin-triggered notifications, verify session
      const cookieStore = await cookies()
      const token = cookieStore.get('admin-token')?.value
      const session = await verifySession(token)
      if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    const body: NotificationPayload = await req.json()
    const { event, data = {}, subject, message } = body

    const config = eventConfig[event] || eventConfig.custom
    const emailSubject = subject || `${config.emoji} [Smart Motor] ${config.label}`
    const recipients = (process.env.NOTIFICATION_EMAILS || process.env.ADMIN_EMAIL || 'admin@smartmotor.ae')
      .split(',').map(e => e.trim()).filter(Boolean)

    await sendEmail({
      to: recipients,
      subject: emailSubject,
      html: buildNotificationEmail(event, data, message),
      text: message || `Smart Motor alert: ${config.label}. ${JSON.stringify(data)}`,
    })

    return NextResponse.json({ success: true, recipients })
  } catch (error) {
    console.error('Notification send error:', error)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}
