/**
 * Internal click tracking endpoint
 * Logs CTA / social / newsletter link clicks to Firebase RTDB
 * Lightweight — writes are non-blocking, data used in daily reports
 */

import { NextRequest, NextResponse } from 'next/server'
import admin from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { href, source, medium, campaign, label } = body

    if (!href) return NextResponse.json({ ok: false }, { status: 400 })

    const db = admin.database()
    const timestamp = Date.now()
    const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

    // Store in RTDB under click_events/<date>/<push>
    await db.ref(`click_events/${today}`).push({
      href,
      source: source || null,
      medium: medium || null,
      campaign: campaign || null,
      label: label || null,
      timestamp,
      ua: req.headers.get('user-agent')?.slice(0, 120) || null,
      referer: req.headers.get('referer') || null,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    // Swallow errors — this is analytics, never break the user experience
    console.error('Track click error:', error)
    return NextResponse.json({ ok: false })
  }
}
