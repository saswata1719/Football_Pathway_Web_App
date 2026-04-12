import { NextResponse, type NextRequest } from "next/server"
import { getSessionCookie } from "better-auth/cookies"

import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth-session"

const publicRoutes = ["/login", "/signup"]

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl
    const authToken = request.cookies.get(AUTH_COOKIE_NAME)?.value
    const customSession = authToken ? await verifyAuthToken(authToken) : null
    const betterAuthSession = getSessionCookie(request)
    const session = customSession || betterAuthSession
    const isPublicRoute = publicRoutes.some((route) => pathname === route)

    if (isPublicRoute && session) {
        return NextResponse.redirect(new URL("/", request.url))
    }

    if (!isPublicRoute && !session) {
        return NextResponse.redirect(new URL("/login", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
}
