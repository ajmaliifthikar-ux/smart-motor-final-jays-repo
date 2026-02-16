import { auth } from '@/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Admin routes protection
  if (pathname.startsWith('/admin')) {
    const session = await auth()

    if (!session?.user) {
      // Redirect to login with return URL
      const loginUrl = new URL('/auth', req.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Check if user is admin
    if (session.user.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
