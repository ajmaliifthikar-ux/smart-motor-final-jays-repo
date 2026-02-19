import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const results: Record<string, any> = {
    env: {
      hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
      projectId: process.env.FIREBASE_PROJECT_ID?.substring(0, 10) + '...',
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL?.split('@')[0] + '@...',
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
      privateKeyLength: process.env.FIREBASE_PRIVATE_KEY?.length || 0,
      privateKeyStart: process.env.FIREBASE_PRIVATE_KEY?.substring(0, 30),
    },
    adminInit: null,
    servicesCount: null,
    error: null,
  }

  try {
    const { adminGetAllServices } = await import('@/lib/firebase-admin')
    results.adminInit = 'imported'
    const services = await adminGetAllServices()
    results.servicesCount = services.length
    results.firstService = services[0]?.name || null
  } catch (err: any) {
    results.error = err?.message || String(err)
    results.stack = err?.stack?.substring(0, 500)
  }

  return NextResponse.json(results)
}
