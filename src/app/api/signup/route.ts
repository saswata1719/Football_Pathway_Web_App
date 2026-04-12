import bcryptjs from "bcryptjs"

import { DBconnection } from "@/lib/DbConnection"
import { USerModel } from "@/models/UserModel"

type SignupRequestBody = {
    name?: string
    email?: string
    password?: string
    confirmPassword?: string
}

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as SignupRequestBody
        const name = body.name?.trim()
        const email = body.email?.trim().toLowerCase()
        const password = body.password?.trim()
        const confirmPassword = body.confirmPassword?.trim()

        if (!name || !email || !password) {
            return Response.json(
                {
                    success: false,
                    message: "Name, email, and password are required.",
                },
                { status: 400 }
            )
        }

        if (password.length < 6) {
            return Response.json(
                {
                    success: false,
                    message: "Password must be at least 6 characters long.",
                },
                { status: 400 }
            )
        }

        if (confirmPassword && password !== confirmPassword) {
            return Response.json(
                {
                    success: false,
                    message: "Password and confirm password do not match.",
                },
                { status: 400 }
            )
        }

        await DBconnection()

        const existingUser = await USerModel.findOne({ email })

        if (existingUser) {
            return Response.json(
                {
                    success: false,
                    message: "User already exists with this email.",
                },
                { status: 409 }
            )
        }

        const user = await USerModel.create({
            name,
            email,
            password: await bcryptjs.hash(password, 10),
            provider: "credentials",
        })

        return Response.json(
            {
                success: true,
                message: "Account created successfully.",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    provider: user.provider,
                },
            },
            { status: 201 }
        )
    } catch {
        return Response.json(
            {
                success: false,
                message: "Something went wrong while creating the account.",
            },
            { status: 500 }
        )
    }
}
