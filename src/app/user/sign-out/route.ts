import { NextResponse } from 'next/server'

export async function GET() {
  const response = NextResponse.redirect(
    new URL('/user/login', process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000')
  )

  response.cookies.set('user-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })

  return response
}
