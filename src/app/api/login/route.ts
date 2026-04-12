import bcryptjs from "bcryptjs"
import { NextResponse } from "next/server"

import { AUTH_COOKIE_NAME, createAuthToken } from "@/lib/auth-session"
import { DBconnection } from "@/lib/DbConnection"
import { USerModel } from "@/models/UserModel"

type LoginRequestBody = {
    email?: string
    password?: string
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as LoginRequestBody
        const email = body.email?.trim().toLowerCase()
        const password = body.password?.trim()

        if (!email || !password) {
            return Response.json(
                {
                    success: false,
                    message: "Email and password are required.",
                },
                { status: 400 }
            )
        }

        await DBconnection()

        const user = await USerModel.findOne({ email })

        if (!user || !user.password) {
            return Response.json(
                {
                    success: false,
                    message: "Invalid email or password.",
                },
                { status: 401 }
            )
        }

        const isPasswordValid = await bcryptjs.compare(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid email or password.",
                },
                { status: 401 }
            )
        }

        const token = await createAuthToken({
            userId: String(user._id),
            email: user.email,
        })

        const response = NextResponse.json(
            {
                success: true,
                message: "Login successful.",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    provider: user.provider,
                },
            },
            { status: 200 }
        )

        response.cookies.set(AUTH_COOKIE_NAME, token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        })

        return response
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while logging in.",
            },
            { status: 500 }
        )
    }
}
