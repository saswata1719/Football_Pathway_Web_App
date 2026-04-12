import { cookies } from "next/headers"

import { auth } from "@/lib/auth"
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth-session"
import { DBconnection } from "@/lib/DbConnection"
import { USerModel } from "@/models/UserModel"

export async function getCurrentUser() {
    const cookieStore = await cookies()
    const authToken = cookieStore.get(AUTH_COOKIE_NAME)?.value
    const customSession = authToken ? await verifyAuthToken(authToken) : null
    const betterAuthSession = await auth.api.getSession({
        headers: new Headers({
            cookie: cookieStore.toString(),
        }),
    })
    const userId = customSession?.userId || betterAuthSession?.user?.id

    if (!customSession?.userId && !betterAuthSession?.user?.id) {
        return null
    }

    await DBconnection()

    let user = userId ? await USerModel.findById(userId) : null

    if (!user && betterAuthSession?.user?.email) {
        user = await USerModel.findOne({
            email: betterAuthSession.user.email.toLowerCase(),
        })
    }

    if (!user && betterAuthSession?.user?.email) {
        user = await USerModel.create({
            name: betterAuthSession.user.name || "Player",
            email: betterAuthSession.user.email.toLowerCase(),
            image: betterAuthSession.user.image || null,
            provider: "google",
        })
    }

    return user
}
