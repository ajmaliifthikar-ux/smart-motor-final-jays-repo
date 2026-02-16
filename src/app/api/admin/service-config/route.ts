import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { adminDb } from '@/lib/firebase-admin'
import { ServiceSlotConfig } from '@/lib/booking-system'

// GET: Fetch all service configurations
export async function GET(req: NextRequest) {
  try {
    const snapshot = await adminDb.collection('serviceConfigs').get()
    const configs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    return NextResponse.json(configs)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch configurations' },
      { status: 500 }
    )
  }
}

// POST: Create new service configuration
export async function POST(req: NextRequest) {
  const session = await auth()

  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const config: ServiceSlotConfig = await req.json()

    const docRef = await adminDb.collection('serviceConfigs').add({
      ...config,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ id: docRef.id, ...config })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create configuration' }, { status: 500 })
  }
}

// PUT: Update service configuration
export async function PUT(req: NextRequest) {
  const session = await auth()

  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, ...config } = await req.json()

    await adminDb.collection('serviceConfigs').doc(id).update({
      ...config,
      updatedAt: new Date(),
    })

    return NextResponse.json({ id, ...config })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update configuration' }, { status: 500 })
  }
}

// DELETE: Remove service configuration
export async function DELETE(req: NextRequest) {
  const session = await auth()

  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    await adminDb.collection('serviceConfigs').doc(id).delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete configuration' }, { status: 500 })
  }
}
