import { NextResponse } from "next/server"

import { DBconnection } from "@/lib/DbConnection"
import { getCurrentUser } from "@/lib/current-user"
import { PostLikeModel } from "@/models/PostLikeModel"
import { PostModel } from "@/models/PostModel"
import { ProfileModel } from "@/models/ProfileModel"

function shuffleItems<T>(items: T[]) {
    const copiedItems = [...items]

    for (let index = copiedItems.length - 1; index > 0; index -= 1) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const currentItem = copiedItems[index]

        copiedItems[index] = copiedItems[randomIndex]
        copiedItems[randomIndex] = currentItem
    }

    return copiedItems
}

export async function GET() {
    try {
        const currentUser = await getCurrentUser()

        if (!currentUser) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Unauthorized access.",
                },
                { status: 401 }
            )
        }

        await DBconnection()

        const posts = await PostModel.find()
            .populate("user", "name image")
            .sort({ createdAt: -1 })
            .lean()

        const userIds = posts.map((post) => String(post.user?._id || post.user))
        const profiles = await ProfileModel.find({
            user: { $in: userIds },
        }).lean()

        const likedPosts = await PostLikeModel.find({
            user: currentUser._id,
            post: { $in: posts.map((post) => post._id) },
        }).lean()

        const likedPostIds = new Set(likedPosts.map((item) => String(item.post)))
        const profileByUserId = new Map(
            profiles.map((profile) => [String(profile.user), profile])
        )

        const feed = posts.map((post) => {
            const userId = String(post.user?._id || post.user)
            const profile = profileByUserId.get(userId)
            const userName =
                typeof post.user === "object" && post.user && "name" in post.user
                    ? post.user.name
                    : "Player"
            const userImage =
                typeof post.user === "object" && post.user && "image" in post.user
                    ? post.user.image
                    : null

            return {
                id: String(post._id),
                playerUserId: userId,
                title: post.caption,
                caption: post.caption,
                videoUrl: post.videoUrl,
                thumbnailUrl: post.thumbnailUrl,
                position: post.position,
                age: post.age,
                matchType: post.matchType,
                tags: post.tags ?? [],
                location: profile?.location || post.location,
                playerName: profile?.fullName || userName,
                playerImage: profile?.image || userImage || "/user_placeholder.jpg",
                isVerified: profile?.isVerified ?? false,
                stats: {
                    views: post.stats?.views ?? 0,
                    likes: post.stats?.likes ?? 0,
                    comments: post.stats?.comments ?? 0,
                    shares: post.stats?.shares ?? 0,
                },
                likedByCurrentUser: likedPostIds.has(String(post._id)),
            }
        })

        return NextResponse.json(
            {
                success: true,
                message: "Feed fetched successfully.",
                feed: shuffleItems(feed),
            },
            { status: 200 }
        )
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while fetching the feed.",
            },
            { status: 500 }
        )
    }
}
