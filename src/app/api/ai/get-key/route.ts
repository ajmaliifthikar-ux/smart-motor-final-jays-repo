/**
 * Secure endpoint to provide Gemini API key to frontend
 * Never expose in .env.local - only server-side
 */

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { auth } from '@/auth'
import { adminAuth } from '@/lib/firebase-admin'

export async function GET() {
  try {
    // Enforce dual authentication pattern: check NextAuth or Firebase token
    const session = await auth()
    const cookieStore = await cookies()
    const firebaseToken = cookieStore.get('user-token')?.value

    let isAuthorized = !!session?.user

    if (!isAuthorized && firebaseToken) {
      try {
        const decoded = await adminAuth.verifyIdToken(firebaseToken)
        if (decoded) isAuthorized = true
      } catch (err) {
        console.error('Firebase token verification failed in get-key:', err)
      }
    }

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    return NextResponse.json({ key: apiKey })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to retrieve API key' },
      { status: 500 }
    )
  }
}
