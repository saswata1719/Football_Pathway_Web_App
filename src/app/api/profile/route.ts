import { NextResponse } from "next/server"

import { DBconnection } from "@/lib/DbConnection"
import { getCurrentUser } from "@/lib/current-user"
import { ensureUserProfile } from "@/lib/profile"
import { ProfileModel } from "@/models/ProfileModel"
import { USerModel } from "@/models/UserModel"

type ProfileRequestBody = {
    userId?: string
}

type UpdateProfileBody = {
    fullName?: string
    image?: string | null
    age?: number | null
    position?: "striker" | "midfielder" | "defender" | "goalkeeper" | "winger" | null
    strongFoot?: "left" | "right" | "both" | null
    location?: string | null
    club?: string | null
    bio?: string | null
    topSkill?: string | null
}

export async function GET() {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized access.",
                },
                { status: 401 }
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

export async function PUT(request: Request) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized access.",
                },
                { status: 401 }
            )
        }

        const body = (await request.json()) as UpdateProfileBody
        const payload = {
            fullName: body.fullName?.trim() || user.name,
            image: body.image?.trim() || null,
            age:
                typeof body.age === "number" && Number.isFinite(body.age) ? body.age : null,
            position: body.position || null,
            strongFoot: body.strongFoot || null,
            location: body.location?.trim() || null,
            club: body.club?.trim() || null,
            bio: body.bio?.trim() || "",
            topSkill: body.topSkill?.trim() || null,
        }

        if (!payload.fullName) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Full name is required.",
                },
                { status: 400 }
            )
        }

        if (payload.age !== null && payload.age < 0) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Age must be a valid positive number.",
                },
                { status: 400 }
            )
        }

        await ensureUserProfile(user)

        const profile = await ProfileModel.findOneAndUpdate(
            { user: user._id },
            {
                $set: payload,
            },
            {
                new: true,
                runValidators: true,
            }
        ).lean()

        await USerModel.findByIdAndUpdate(user._id, {
            $set: {
                name: payload.fullName,
                image: payload.image,
            },
        })

        return NextResponse.json(
            {
                success: true,
                message: "Profile updated successfully.",
                profile,
            },
            { status: 200 }
        )
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while updating the profile.",
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
