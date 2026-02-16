import { NextRequest, NextResponse } from 'next/server'

/**
 * CREATE TEST USER ENDPOINT
 * This endpoint helps create Firebase test users for development
 * Only works in development mode
 */

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: 'This endpoint is only available in development' },
      { status: 403 }
    )
  }

  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Use Firebase REST API to create user
    const response = await fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' +
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          returnSecureToken: true,
        }),
      }
    )

    if (!response.ok) {
      const error = await response.json()
      
      // Handle specific Firebase errors
      if (error.error?.message === 'EMAIL_EXISTS') {
        return NextResponse.json(
          { 
            success: false,
            message: 'User already exists',
            email,
            password,
            info: '⚠️ The user account already exists. Use the credentials below to login.'
          },
          { status: 200 }
        )
      }
      
      throw new Error(error.error?.message || 'Failed to create user')
    }

    const data = await response.json()

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      email,
      password,
      uid: data.localId,
      info: '✅ New user account created. Use the credentials below to login at /auth'
    })
  } catch (error) {
    console.error('Create user error:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}
