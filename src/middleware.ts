import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import NextAuth from "next-auth"
import { authConfig } from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req: NextRequest & { auth: any }) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth
    const role = req.auth?.user?.role

    // 1. Security Headers
    const response = NextResponse.next()
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()")

    // 2. Auth Logic
    const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth")
    const isPublicRoute = [
        "/",
        "/auth",
        "/services",
        "/api/bookings",
        "/api/recaptcha",
        "/privacy",
        "/terms"
    ].includes(nextUrl.pathname) ||
        nextUrl.pathname.startsWith("/services/") ||
        nextUrl.pathname.startsWith("/new-home")
    const isAdminRoute = nextUrl.pathname.startsWith("/admin")

    if (isApiAuthRoute) return response

    if (isAdminRoute) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/auth", nextUrl))
        }
        if (role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", nextUrl))
        }
        return response
    }

    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL("/auth", nextUrl))
    }

    return response
})

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
