import mongoose from "mongoose"
import { NextResponse } from "next/server"

import { DBconnection } from "@/lib/DbConnection"
import { ProfileModel } from "@/models/ProfileModel"
import { PostModel } from "@/models/PostModel"
import { USerModel } from "@/models/UserModel"

export async function GET(
    _request: Request,
    { params }: RouteContext<"/api/profile/[userId]">
) {
    try {
        const { userId } = await params

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid user id.",
                },
                { status: 400 }
            )
        }

        await DBconnection()

        const [user, profile, posts] = await Promise.all([
            USerModel.findById(userId).lean(),
            ProfileModel.findOne({ user: userId }).lean(),
            PostModel.find({ user: userId }).sort({ createdAt: -1 }).lean(),
        ])

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Player not found.",
                },
                { status: 404 }
            )
        }

        return NextResponse.json(
            {
                success: true,
                message: "Player profile fetched successfully.",
                profile: {
                    userId,
                    fullName: profile?.fullName || user.name || "Player",
                    image: profile?.image || user.image || null,
                    age: profile?.age ?? null,
                    position: profile?.position ?? null,
                    strongFoot: profile?.strongFoot ?? null,
                    location: profile?.location ?? null,
                    club: profile?.club ?? null,
                    bio: profile?.bio ?? "",
                    topSkill: profile?.topSkill ?? null,
                    profileType: profile?.profileType ?? "Player Profile",
                    isVerified: profile?.isVerified ?? false,
                    updatedAt: profile?.updatedAt ?? user.updatedAt ?? null,
                },
                posts,
            },
            { status: 200 }
        )
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while fetching the player profile.",
            },
            { status: 500 }
        )
    }
}
