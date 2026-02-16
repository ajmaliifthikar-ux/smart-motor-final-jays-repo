/**
 * Secure endpoint to provide Gemini API key to frontend
 * Never expose in .env.local - only server-side
 */

import { NextResponse } from 'next/server'

export async function GET() {
  try {
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
