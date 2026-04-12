import { NextResponse } from "next/server"
import mongoose from "mongoose"

import { DBconnection } from "@/lib/DbConnection"
import { getCurrentUser } from "@/lib/current-user"
import { PostLikeModel } from "@/models/PostLikeModel"
import { PostModel } from "@/models/PostModel"

export async function POST(
    _request: Request,
    { params }: RouteContext<"/api/post/[id]/like">
) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login to like this video.",
                },
                { status: 401 }
            )
        }

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

        const post = await PostModel.findById(id)

        if (!post) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Post not found.",
                },
                { status: 404 }
            )
        }

        const existingLike = await PostLikeModel.findOne({
            post: post._id,
            user: user._id,
        })

        if (existingLike) {
            await PostLikeModel.deleteOne({ _id: existingLike._id })
            await PostModel.findByIdAndUpdate(post._id, {
                $inc: {
                    "stats.likes": -1,
                },
            })

            const updatedPost = await PostModel.findById(post._id).lean()

            return NextResponse.json(
                {
                    success: true,
                    message: "Like removed successfully.",
                    liked: false,
                    likes: updatedPost?.stats?.likes ?? 0,
                },
                { status: 200 }
            )
        }

        await PostLikeModel.create({
            post: post._id,
            user: user._id,
        })

        await PostModel.findByIdAndUpdate(post._id, {
            $inc: {
                "stats.likes": 1,
            },
        })

        const updatedPost = await PostModel.findById(post._id).lean()

        return NextResponse.json(
            {
                success: true,
                message: "Post liked successfully.",
                liked: true,
                likes: updatedPost?.stats?.likes ?? 0,
            },
            { status: 200 }
        )
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while updating the like.",
            },
            { status: 500 }
        )
    }
}
