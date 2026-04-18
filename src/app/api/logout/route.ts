import { NextResponse } from "next/server"

import { AUTH_COOKIE_NAME } from "@/lib/auth-session"
import { appEnv } from "@/lib/env"

export async function POST() {
    const response = NextResponse.json(
        {
            success: true,
            message: "Logout successful.",
        },
        { status: 200 }
    )

    response.cookies.set(AUTH_COOKIE_NAME, "", {
        httpOnly: true,
        sameSite: "lax",
        secure: appEnv.isProduction,
        path: "/",
        maxAge: 0,
    })

    return response
}
