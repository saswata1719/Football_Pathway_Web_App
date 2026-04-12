import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getSessionCookie } from "better-auth/cookies"

import BottomBar from '@/components/BottomBar'
import { AUTH_COOKIE_NAME, verifyAuthToken } from '@/lib/auth-session'
import React from 'react'

interface Props {
    children: React.ReactNode
}


export default async function Wrapper({ children }: Props) {
    const cookieStore = await cookies()
    const authToken = cookieStore.get(AUTH_COOKIE_NAME)?.value
    const customSession = authToken ? await verifyAuthToken(authToken) : null
    const requestHeaders = new Headers()

    if (cookieStore.toString()) {
        requestHeaders.set("cookie", cookieStore.toString())
    }

    const betterAuthSession = getSessionCookie(requestHeaders)
    const session = customSession || betterAuthSession

    if (!session) {
        redirect("/login")
    }

    return (
        <div className="relative min-h-svh bg-white text-slate-900">
            {children}
            <BottomBar />
        </div>
    )
}
