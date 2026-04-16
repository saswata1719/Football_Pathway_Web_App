import { NextResponse } from "next/server"
import mongoose from "mongoose"

import { DBconnection } from "@/lib/DbConnection"
import { getCurrentUser } from "@/lib/current-user"
import { CommentModel } from "@/models/CommentModel"
import { PostModel } from "@/models/PostModel"

type CreateCommentBody = {
    text?: string
}

export async function GET(
    _request: Request,
    { params }: RouteContext<"/api/post/[id]/comments">
) {
    try {
        const { id } = await params
        const currentUser = await getCurrentUser()

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

        const post = await PostModel.findById(id).select("user").lean()

        if (!post) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Post not found.",
                },
                { status: 404 }
            )
        }

        const isPostOwner =
            currentUser && String(post.user) === String(currentUser._id)

        const comments = await CommentModel.find({ post: id })
            .populate("user", "name image")
            .sort({ createdAt: -1 })
            .lean()

        return NextResponse.json(
            {
                success: true,
                message: "Comments fetched successfully.",
                comments: comments.map((comment) => ({
                    id: String(comment._id),
                    name:
                        typeof comment.user === "object" &&
                        comment.user &&
                        "name" in comment.user
                            ? comment.user.name
                            : "Player",
                    image:
                        typeof comment.user === "object" &&
                        comment.user &&
                        "image" in comment.user
                            ? comment.user.image
                            : null,
                    text: comment.text,
                    time: comment.createdAt,
                    canDelete:
                        Boolean(currentUser) &&
                        (isPostOwner ||
                            (typeof comment.user === "object" &&
                                comment.user &&
                                "_id" in comment.user &&
                                String(comment.user._id) === String(currentUser?._id))),
                })),
            },
            { status: 200 }
        )
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while fetching comments.",
            },
            { status: 500 }
        )
    }
}

export async function POST(
    request: Request,
    { params }: RouteContext<"/api/post/[id]/comments">
) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login to comment.",
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

        const body = (await request.json()) as CreateCommentBody
        const text = body.text?.trim()

        if (!text) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Comment text is required.",
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

        const comment = await CommentModel.create({
            post: post._id,
            user: user._id,
            text,
        })

        await PostModel.findByIdAndUpdate(post._id, {
            $inc: {
                "stats.comments": 1,
            },
        })

        return NextResponse.json(
            {
                success: true,
                message: "Comment added successfully.",
                comment: {
                    id: String(comment._id),
                    name: user.name,
                    image: user.image || null,
                    text: comment.text,
                    time: comment.createdAt,
                },
            },
            { status: 201 }
        )
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while adding the comment.",
            },
            { status: 500 }
        )
    }
}
