import { NextResponse } from "next/server"
import { cookies } from "next/headers"

import { auth } from "@/lib/auth"
import { AUTH_COOKIE_NAME, verifyAuthToken } from "@/lib/auth-session"
import { DBconnection } from "@/lib/DbConnection"
import { ensureUserProfile } from "@/lib/profile"
import { ProfileModel } from "@/models/ProfileModel"
import { USerModel } from "@/models/UserModel"

type ProfileRequestBody = {
    userId?: string
}

export async function GET() {
    try {
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
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized access.",
                },
                { status: 401 }
            )
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

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found.",
                },
                { status: 404 }
            )
        }

        const ensuredProfile = await ensureUserProfile(user)
        const profile = await ProfileModel.findById(ensuredProfile._id).lean()

        return NextResponse.json(
            {
                success: true,
                message: "Profile fetched successfully.",
                profile,
            },
            { status: 200 }
        )
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while fetching the profile.",
            },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as ProfileRequestBody
        const userId = body.userId?.trim()

        if (!userId) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User id is required.",
                },
                { status: 400 }
            )
        }

        await DBconnection()

        const user = await USerModel.findById(userId)

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "User not found.",
                },
                { status: 404 }
            )
        }

        const profile = await ensureUserProfile(user)

        return NextResponse.json(
            {
                success: true,
                message: "Profile is ready.",
                profile,
            },
            { status: 200 }
        )
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while preparing the profile.",
            },
            { status: 500 }
        )
    }
}
