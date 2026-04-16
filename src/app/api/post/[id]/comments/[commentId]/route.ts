import { NextResponse } from "next/server"
import mongoose from "mongoose"

import { DBconnection } from "@/lib/DbConnection"
import { getCurrentUser } from "@/lib/current-user"
import { CommentModel } from "@/models/CommentModel"
import { PostModel } from "@/models/PostModel"

export async function DELETE(
    _request: Request,
    { params }: RouteContext<"/api/post/[id]/comments/[commentId]">
) {
    try {
        const user = await getCurrentUser()

        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Please login to delete comments.",
                },
                { status: 401 }
            )
        }

        const { id, commentId } = await params
        console.log("[API] delete comment request received", {
            postId: id,
            commentId,
            userId: String(user._id),
        })

        if (
            !mongoose.Types.ObjectId.isValid(id) ||
            !mongoose.Types.ObjectId.isValid(commentId)
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid comment request.",
                },
                { status: 400 }
            )
        }

        await DBconnection()

        const [post, comment] = await Promise.all([
            PostModel.findById(id).select("user"),
            CommentModel.findOne({ _id: commentId, post: id }).select("post user"),
        ])

        if (!post) {
            console.log("[API] delete comment failed: post not found", {
                postId: id,
                commentId,
            })
            return NextResponse.json(
                {
                    success: false,
                    message: "Post not found.",
                },
                { status: 404 }
            )
        }

        if (!comment) {
            console.log("[API] delete comment failed: comment not found", {
                postId: id,
                commentId,
            })
            return NextResponse.json(
                {
                    success: false,
                    message: "Comment not found.",
                },
                { status: 404 }
            )
        }

        const isCommentOwner = String(comment.user) === String(user._id)
        const isPostOwner = String(post.user) === String(user._id)

        if (!isCommentOwner && !isPostOwner) {
            console.log("[API] delete comment forbidden", {
                postId: id,
                commentId,
                userId: String(user._id),
            })
            return NextResponse.json(
                {
                    success: false,
                    message: "You can only delete your own comments on this content.",
                },
                { status: 403 }
            )
        }

        await Promise.all([
            CommentModel.findByIdAndDelete(commentId),
            PostModel.findByIdAndUpdate(id, {
                $inc: {
                    "stats.comments": -1,
                },
            }),
        ])

        console.log("[API] delete comment success", {
            postId: id,
            commentId,
        })

        return NextResponse.json(
            {
                success: true,
                message: "Comment deleted successfully.",
            },
            { status: 200 }
        )
    } catch (error) {
        console.log("[API] delete comment error", {
            error,
        })
        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error && error.message
                        ? error.message
                        : "Something went wrong while deleting the comment.",
            },
            { status: 500 }
        )
    }
}
