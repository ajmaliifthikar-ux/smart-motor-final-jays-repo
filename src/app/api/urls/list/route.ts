import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { verifySession } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    // Verify admin session
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value
    const session = await verifySession(token)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch all short URLs from Firestore
    const snapshot = await adminDb.collection('short_urls').orderBy('createdAt', 'desc').limit(200).get()

    const urls = snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        id: doc.id,
        shortCode: data.shortCode,
        originalUrl: data.originalUrl,
        customUrl: data.customUrl,
        clicks: data.clicks || 0,
        active: data.active ?? true,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        expiresAt: data.expiresAt?.toDate?.()?.toISOString() || null,
        metadata: data.metadata || {},
        analytics: {
          browsers: data.analytics?.browsers || {},
          devices: data.analytics?.devices || {},
          locations: data.analytics?.locations || {},
          referrers: data.analytics?.referrers || {},
        },
      }
    })

    return NextResponse.json({ success: true, urls })
  } catch (error) {
    console.error('URL list error:', error)
    return NextResponse.json({ error: 'Failed to fetch URLs' }, { status: 500 })
  }
}
