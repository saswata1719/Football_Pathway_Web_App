import { NextResponse } from "next/server"
import { del } from "@vercel/blob"
import mongoose from "mongoose"

import { DBconnection } from "@/lib/DbConnection"
import { getCurrentUser } from "@/lib/current-user"
import { CommentModel } from "@/models/CommentModel"
import { PostLikeModel } from "@/models/PostLikeModel"
import { PostModel } from "@/models/PostModel"

export async function GET(
    _request: Request,
    { params }: RouteContext<"/api/post/[id]">
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

        const [post, currentUser] = await Promise.all([
            PostModel.findById(id).lean(),
            getCurrentUser(),
        ])

        if (!post) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Post not found.",
                },
                { status: 404 }
            )
        }

        const likedByCurrentUser = currentUser
            ? Boolean(
                  await PostLikeModel.findOne({
                      post: post._id,
                      user: currentUser._id,
                  }).lean()
              )
            : false

        return NextResponse.json(
            {
                success: true,
                message: "Post fetched successfully.",
                post: {
                    ...post,
                    likedByCurrentUser,
                },
            },
            { status: 200 }
        )
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while fetching the post.",
            },
            { status: 500 }
        )
    }
}

export async function DELETE(
    _request: Request,
    { params }: RouteContext<"/api/post/[id]">
) {
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

        if (String(post.user) !== String(user._id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "You can only delete your own posts.",
                },
                { status: 403 }
            )
        }

        await CommentModel.deleteMany({ post: post._id })
        await PostLikeModel.deleteMany({ post: post._id })

        try {
            await del([post.videoUrl, post.thumbnailUrl])
        } catch {}

        await PostModel.findByIdAndDelete(post._id)

        return NextResponse.json(
            {
                success: true,
                message: "Post deleted successfully.",
            },
            { status: 200 }
        )
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while deleting the post.",
            },
            { status: 500 }
        )
    }
}
