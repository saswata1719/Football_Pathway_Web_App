import mongoose from "mongoose"
import { NextResponse } from "next/server"

import { DBconnection } from "@/lib/DbConnection"
import { PostModel } from "@/models/PostModel"

export async function POST(
    _request: Request,
    { params }: RouteContext<"/api/post/[id]/view">
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
                    "stats.views": 1,
                },
            },
            {
                new: true,
            }
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

        return NextResponse.json(
            {
                success: true,
                message: "View added successfully.",
                views: post.stats?.views ?? 0,
            },
            { status: 200 }
        )
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while updating the view.",
            },
            { status: 500 }
        )
    }
}
