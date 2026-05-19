/**
 * Secure endpoint to provide Gemini API key to frontend
 * Never expose in .env.local - only server-side
 */

import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { adminAuth } from '@/lib/firebase-admin'

export async function GET(req: NextRequest) {
  try {
    const session = await auth()

    // Support both NextAuth session and Firebase token for flexibility in transition
    const token = req.cookies.get('user-token')?.value

    let isAuthorized = false;

    if (session?.user) {
        isAuthorized = true;
    } else if (token) {
        try {
          await adminAuth.verifyIdToken(token)
          isAuthorized = true;
        } catch (e) {
          // Ignore error and fall through
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
