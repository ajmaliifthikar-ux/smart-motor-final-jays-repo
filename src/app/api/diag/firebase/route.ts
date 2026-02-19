import { NextResponse } from 'next/server'
import admin from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

export async function GET() {
  const results: Record<string, any> = {
    env: {
      hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
      projectId: process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
      privateKeyStart: process.env.FIREBASE_PRIVATE_KEY?.substring(0, 50),
    },
    namedDb: { servicesCount: null, error: null },
    defaultDb: { servicesCount: null, error: null },
  }

  // Test named DB 'smartmotordb'
  try {
    const { adminGetAllServices } = await import('@/lib/firebase-admin')
    const services = await adminGetAllServices()
    results.namedDb.servicesCount = services.length
    results.namedDb.firstService = services[0]?.name || null
  } catch (err: any) {
    results.namedDb.error = err?.message || String(err)
  }

  // Test default Firestore DB directly
  try {
    const app = admin.apps[0]
    if (app) {
      const defaultDb = getFirestore(app) // no databaseId = default
      const snap = await defaultDb.collection('services').where('active', '==', true).get()
      results.defaultDb.servicesCount = snap.docs.length
      results.defaultDb.firstService = snap.docs[0]?.data()?.name || null
    } else {
      results.defaultDb.error = 'No admin app initialized'
    }
  } catch (err: any) {
    results.defaultDb.error = err?.message || String(err)
  }

  return NextResponse.json(results)
}
