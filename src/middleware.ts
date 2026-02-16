import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Only protect /admin routes
  if (pathname.startsWith('/admin')) {
    const token = request.cookies.get('firebase-token')?.value

    if (!token) {
      const url = new URL('/auth', request.url)
      url.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(url)
    }

    // We can't verify the token fully in Edge middleware without a fetch call to a custom API 
    // or using a lighter JWT library if the token is small. 
    // However, for pure Firebase logic, we'll assume the presence of the cookie is step 1.
    // The individual /admin/page.tsx files will do the final "admin-check" via the Admin SDK.
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
