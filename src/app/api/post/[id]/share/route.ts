import { NextResponse } from "next/server"
import mongoose from "mongoose"

import { DBconnection } from "@/lib/DbConnection"
import { appEnv, env } from "@/lib/env"
import { PostModel } from "@/models/PostModel"

function getBaseUrl() {
    if (appEnv.authBaseUrl) {
        return appEnv.authBaseUrl
    }

    if (env.VERCEL_URL) {
        return `https://${env.VERCEL_URL}`
    }

    return "http://localhost:3000"
}

export async function POST(
    _request: Request,
    { params }: RouteContext<"/api/post/[id]/share">
) {
    try {
        const { id } = await params

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid post id.",
                },
                { status: 400 }
            )
        }

        await DBconnection()

        const post = await PostModel.findByIdAndUpdate(
            id,
            {
                $inc: {
                    "stats.shares": 1,
                },
            },
            { new: true }
        ).lean()

        if (!post) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Post not found.",
                },
                { status: 404 }
            )
        }

        const shareUrl = `${getBaseUrl()}/video/${id}`

        return NextResponse.json(
            {
                success: true,
                message: "Share link ready.",
                shareUrl,
                shares: post.stats?.shares ?? 0,
                targets: {
                    whatsapp: `https://wa.me/?text=${encodeURIComponent(shareUrl)}`,
                    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}`,
                    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                },
            },
            { status: 200 }
        )
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while preparing the share link.",
            },
            { status: 500 }
        )
    }
}
