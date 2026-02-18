import { NextRequest, NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { verifySession } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

// Toggle active state or delete a short URL
export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value
    const session = await verifySession(token)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, active } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await adminDb.collection('short_urls').doc(id).update({ active })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('URL manage PATCH error:', error)
    return NextResponse.json({ error: 'Failed to update URL' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin-token')?.value
    const session = await verifySession(token)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 })

    await adminDb.collection('short_urls').doc(id).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('URL manage DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete URL' }, { status: 500 })
  }
}
