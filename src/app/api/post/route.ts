import { NextResponse } from "next/server"

import { getCurrentUser } from "@/lib/current-user"
import { PostModel } from "@/models/PostModel"

type CreatePostBody = {
    position?: "striker" | "midfielder" | "defender" | "goalkeeper" | "winger"
    age?: number
    location?: string
    strongFoot?: "left" | "right" | "both"
    matchType?: "match" | "practice" | "trial"
    caption?: string
    tags?: string[] | string
    videoUrl?: string
    thumbnailUrl?: string
}

export async function POST(request: Request) {
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

        const body = (await request.json()) as CreatePostBody
        const tags =
            typeof body.tags === "string"
                ? body.tags
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                : Array.isArray(body.tags)
                  ? body.tags.map((tag) => tag.trim()).filter(Boolean)
                  : []

        if (
            !body.position ||
            typeof body.age !== "number" ||
            !body.location?.trim() ||
            !body.strongFoot ||
            !body.matchType ||
            !body.caption?.trim() ||
            !body.videoUrl?.trim() ||
            !body.thumbnailUrl?.trim()
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please fill all required post fields.",
                },
                { status: 400 }
            )
        }

        const post = await PostModel.create({
            user: user._id,
            position: body.position,
            age: body.age,
            location: body.location.trim(),
            strongFoot: body.strongFoot,
            matchType: body.matchType,
            caption: body.caption.trim(),
            tags,
            videoUrl: body.videoUrl.trim(),
            thumbnailUrl: body.thumbnailUrl.trim(),
        })

        return NextResponse.json(
            {
                success: true,
                message: "Post created successfully.",
                post,
            },
            { status: 201 }
        )
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while creating the post.",
            },
            { status: 500 }
        )
    }
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

        const posts = await PostModel.find({ user: user._id }).sort({ createdAt: -1 }).lean()

        return NextResponse.json(
            {
                success: true,
                message: "Posts fetched successfully.",
                posts,
            },
            { status: 200 }
        )
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while fetching posts.",
            },
            { status: 500 }
        )
    }
}
