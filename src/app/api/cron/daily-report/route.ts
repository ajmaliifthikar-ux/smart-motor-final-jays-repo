/**
 * Daily Report Cron Job
 * Runs every day at 8:00 AM UAE time (04:00 UTC)
 * Sends a comprehensive daily analytics report to configured admin recipients
 */

import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import admin from '@/lib/firebase-admin'
import { sendEmail } from '@/lib/email'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

function buildDailyReportEmail(data: {
  date: string
  bookings: { total: number; today: number; pending: number }
  subscribers: number
  urlClicks: number
  topLinks: Array<{ code: string; clicks: number; campaign?: string }>
  newUsers: number
  recentUpdates: Array<{ type: string; summary: string; time: string }>
}) {
  const { date, bookings, subscribers, urlClicks, topLinks, newUsers, recentUpdates } = data

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Smart Motor Daily Report — ${date}</title>
</head>
<body style="margin:0;padding:0;background:#0d0d0d;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0d0d;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="620" cellpadding="0" cellspacing="0" style="max-width:620px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a1a,#121212);border-radius:20px 20px 0 0;padding:36px 48px;text-align:center;border-bottom:2px solid #E62329;">
              <div style="display:inline-block;background:#E62329;color:white;font-size:9px;font-weight:900;letter-spacing:0.4em;text-transform:uppercase;padding:5px 14px;border-radius:100px;margin-bottom:16px;">
                Daily Intelligence Report
              </div>
              <h1 style="margin:0;color:white;font-size:28px;font-weight:900;letter-spacing:-0.02em;text-transform:uppercase;font-style:italic;">
                Smart Motor
              </h1>
              <p style="margin:8px 0 0;color:rgba(255,255,255,0.4);font-size:13px;">${date}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background:#FAFAF9;padding:40px 48px;">

              <!-- KPI Grid -->
              <p style="margin:0 0 16px;font-size:10px;font-weight:900;color:#E62329;text-transform:uppercase;letter-spacing:0.4em;">Today at a Glance</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
                <tr>
                  <td width="50%" style="padding:0 6px 12px 0;">
                    <div style="background:#121212;border-radius:14px;padding:20px;text-align:center;">
                      <p style="margin:0;font-size:32px;font-weight:900;color:#E62329;">${bookings.today}</p>
                      <p style="margin:4px 0 0;font-size:10px;font-weight:700;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.1em;">New Bookings Today</p>
                    </div>
                  </td>
                  <td width="50%" style="padding:0 0 12px 6px;">
                    <div style="background:#121212;border-radius:14px;padding:20px;text-align:center;">
                      <p style="margin:0;font-size:32px;font-weight:900;color:white;">${bookings.pending}</p>
                      <p style="margin:4px 0 0;font-size:10px;font-weight:700;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:0.1em;">Pending Bookings</p>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td width="50%" style="padding:0 6px 0 0;">
                    <div style="background:white;border:1px solid #ECECEA;border-radius:14px;padding:20px;text-align:center;">
                      <p style="margin:0;font-size:32px;font-weight:900;color:#121212;">${subscribers}</p>
                      <p style="margin:4px 0 0;font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.1em;">Newsletter Subscribers</p>
                    </div>
                  </td>
                  <td width="50%" style="padding:0 0 0 6px;">
                    <div style="background:white;border:1px solid #ECECEA;border-radius:14px;padding:20px;text-align:center;">
                      <p style="margin:0;font-size:32px;font-weight:900;color:#121212;">${urlClicks}</p>
                      <p style="margin:4px 0 0;font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:0.1em;">Link Clicks (All Time)</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Top Links -->
              ${topLinks.length > 0 ? `
              <p style="margin:0 0 12px;font-size:10px;font-weight:900;color:#E62329;text-transform:uppercase;letter-spacing:0.4em;">Top Performing Links</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#121212;border-radius:14px;overflow:hidden;margin-bottom:36px;">
                ${topLinks.slice(0, 5).map((link, i) => `
                <tr style="border-bottom:1px solid rgba(255,255,255,0.04);">
                  <td style="padding:12px 20px;">
                    <span style="color:rgba(255,255,255,0.3);font-size:11px;font-weight:700;margin-right:12px;">#${i + 1}</span>
                    <span style="color:#E62329;font-size:12px;font-weight:700;font-family:monospace;">/${link.code}</span>
                    ${link.campaign ? `<span style="color:rgba(255,255,255,0.35);font-size:11px;margin-left:8px;">${link.campaign}</span>` : ''}
                  </td>
                  <td style="padding:12px 20px;text-align:right;">
                    <span style="color:white;font-size:14px;font-weight:900;">${link.clicks}</span>
                    <span style="color:rgba(255,255,255,0.3);font-size:10px;margin-left:4px;">clicks</span>
                  </td>
                </tr>`).join('')}
              </table>
              ` : ''}

              <!-- Recent Activity -->
              ${recentUpdates.length > 0 ? `
              <p style="margin:0 0 12px;font-size:10px;font-weight:900;color:#E62329;text-transform:uppercase;letter-spacing:0.4em;">Recent Activity</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:36px;">
                ${recentUpdates.map(u => `
                <tr>
                  <td style="padding:8px 0;border-bottom:1px solid #ECECEA;">
                    <span style="display:inline-block;background:${u.type === 'booking' ? '#E62329/10' : '#f0f0f0'};color:#666;font-size:9px;font-weight:900;text-transform:uppercase;letter-spacing:0.15em;padding:2px 8px;border-radius:100px;margin-right:10px;">${u.type}</span>
                    <span style="font-size:13px;color:#333;">${u.summary}</span>
                    <span style="float:right;font-size:11px;color:#AAA;">${u.time}</span>
                  </td>
                </tr>`).join('')}
              </table>
              ` : ''}

              <!-- Action Buttons -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:8px;">
                <tr>
                  <td style="padding:0 6px 0 0;" width="50%">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://smartmotorlatest.vercel.app'}/admin/dashboard"
                       style="display:block;text-align:center;background:#E62329;color:white;text-decoration:none;font-size:11px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;padding:14px;border-radius:12px;">
                      View Dashboard →
                    </a>
                  </td>
                  <td style="padding:0 0 0 6px;" width="50%">
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://smartmotorlatest.vercel.app'}/admin/bookings"
                       style="display:block;text-align:center;background:#121212;color:white;text-decoration:none;font-size:11px;font-weight:900;letter-spacing:0.2em;text-transform:uppercase;padding:14px;border-radius:12px;">
                      Manage Bookings →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#121212;border-radius:0 0 20px 20px;padding:24px 48px;text-align:center;">
              <p style="margin:0 0 4px;font-size:9px;font-weight:900;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.3em;">Smart Motor Performance</p>
              <p style="margin:0;font-size:10px;color:rgba(255,255,255,0.2);">Automated daily report — ${date}</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized triggers
  const authHeader = req.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET || 'smartmotor-cron-secret'

  if (authHeader !== `Bearer ${cronSecret}`) {
    // Also allow Vercel Cron (it sends a specific header)
    const vercelCronHeader = req.headers.get('x-vercel-cron')
    if (!vercelCronHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }

  try {
    const today = new Date()
    const todayStart = new Date(today)
    todayStart.setHours(0, 0, 0, 0)
    const dateStr = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

    // Gather data in parallel
    const [bookingsSnap, subscribersSnap, urlsSnap] = await Promise.allSettled([
      adminDb.collection('bookings').get(),
      admin.database().ref('subscribers').get(),
      adminDb.collection('short_urls').orderBy('clicks', 'desc').limit(10).get(),
    ])

    // Bookings stats
    let bookingsTotal = 0, bookingsToday = 0, bookingsPending = 0
    if (bookingsSnap.status === 'fulfilled') {
      bookingsSnap.value.docs.forEach(doc => {
        const d = doc.data()
        bookingsTotal++
        if (d.status === 'pending' || d.status === 'confirmed') bookingsPending++
        const createdAt = d.createdAt?.toDate?.() || d.createdAt ? new Date(d.createdAt) : null
        if (createdAt && createdAt >= todayStart) bookingsToday++
      })
    }

    // Subscribers count
    let subscribersCount = 0
    if (subscribersSnap.status === 'fulfilled' && subscribersSnap.value.exists()) {
      const subs = subscribersSnap.value.val() as Record<string, { isActive?: boolean }>
      subscribersCount = Object.values(subs).filter(s => s.isActive !== false).length
    }

    // URL click stats
    let totalUrlClicks = 0
    const topLinks: Array<{ code: string; clicks: number; campaign?: string }> = []
    if (urlsSnap.status === 'fulfilled') {
      urlsSnap.value.docs.forEach(doc => {
        const d = doc.data()
        totalUrlClicks += d.clicks || 0
        topLinks.push({ code: d.shortCode, clicks: d.clicks || 0, campaign: d.metadata?.campaignName })
      })
    }

    // Get recipients from env
    const recipientsStr = process.env.NOTIFICATION_EMAILS || process.env.ADMIN_EMAIL || 'admin@smartmotor.ae'
    const recipients = recipientsStr.split(',').map(e => e.trim()).filter(Boolean)

    const emailData = {
      date: dateStr,
      bookings: { total: bookingsTotal, today: bookingsToday, pending: bookingsPending },
      subscribers: subscribersCount,
      urlClicks: totalUrlClicks,
      topLinks: topLinks.slice(0, 5),
      newUsers: 0,
      recentUpdates: [],
    }

    await sendEmail({
      to: recipients,
      subject: `📊 Smart Motor Daily Report — ${dateStr}`,
      html: buildDailyReportEmail(emailData),
      text: `Smart Motor Daily Report for ${dateStr}: ${bookingsToday} new bookings, ${bookingsPending} pending, ${subscribersCount} newsletter subscribers, ${totalUrlClicks} total link clicks.`,
    })

    return NextResponse.json({
      success: true,
      recipients,
      stats: emailData,
    })
  } catch (error) {
    console.error('Daily report cron error:', error)
    return NextResponse.json({ error: 'Cron failed', details: String(error) }, { status: 500 })
  }
}
