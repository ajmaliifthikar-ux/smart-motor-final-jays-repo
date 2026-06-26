/**
 * Secure endpoint to provide Gemini API key to frontend
 * Never expose in .env.local - only server-side
 */

import { NextResponse, NextRequest } from 'next/server'
import { auth } from '@/auth'
import { adminAuth } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    // 🛡️ SECURITY: Prevent unauthenticated credential exposure
    // This endpoint provides a sensitive API key to the client.
    // It must strictly enforce authentication to ensure only logged-in users
    // can retrieve the credentials, preventing anonymous access and potential abuse.

    // 1. Check for NextAuth session
    const session = await auth()

    // 2. Fallback to Firebase user-token cookie if no NextAuth session
    let firebaseUser = null
    if (!session) {
      const token = req.cookies.get('user-token')?.value
      if (token) {
        try {
          firebaseUser = await adminAuth.verifyIdToken(token)
        } catch (error) {
          // Token verification failed, leave firebaseUser as null
        }
      }
    }

    // 🛡️ SECURITY: Fail securely with 401 if unauthorized
    if (!session && !firebaseUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const apiKey = process.env.GEMINI_API_KEY

    // 🛡️ SECURITY: Validate environment variable existence
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    return NextResponse.json({ key: apiKey })
  } catch (error) {
    // 🛡️ SECURITY: Do not leak stack traces or internal errors
    return NextResponse.json(
      { error: 'Failed to retrieve API key' },
      { status: 500 }
    )
  }
}
