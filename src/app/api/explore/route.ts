import { NextResponse } from "next/server"

import { DBconnection } from "@/lib/DbConnection"
import { getCurrentUser } from "@/lib/current-user"
import { PostLikeModel } from "@/models/PostLikeModel"
import { PostModel } from "@/models/PostModel"
import { ProfileModel } from "@/models/ProfileModel"

type ExploreResponseItem = {
    id: string
    playerName: string
    playerImage: string
    position: string
    age: number
    club: string | null
    location: string
    caption: string
    videoUrl: string
    thumbnailUrl: string
    matchType: string
    stats: {
        views: number
        likes: number
        comments: number
        shares: number
    }
    isVerified: boolean
    likedByCurrentUser: boolean
    score: number
}

function getAgeGroup(age: number) {
    if (age < 16) {
        return "u16"
    }

    if (age < 18) {
        return "u18"
    }

    return "u21"
}

function getScore(item: ExploreResponseItem) {
    return (
        item.stats.views * 0.02 +
        item.stats.likes * 1.5 +
        item.stats.comments * 2 +
        item.stats.shares * 2.5
    )
}

export async function GET(request: Request) {
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

        const { searchParams } = new URL(request.url)
        const search = searchParams.get("search")?.trim().toLowerCase() || ""
        const position = searchParams.get("position") || "all-position"
        const ageGroup = searchParams.get("ageGroup") || "all-age"
        const location = searchParams.get("location") || "all-location"
        const club = searchParams.get("club") || "all-clubs"

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

        const allItems: ExploreResponseItem[] = posts.map((post) => {
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
            const item = {
                id: String(post._id),
                playerName: profile?.fullName || userName,
                playerImage: profile?.image || userImage || "/user_placeholder.jpg",
                position: profile?.position || post.position,
                age: profile?.age || post.age,
                club: profile?.club || null,
                location: profile?.location || post.location,
                caption: post.caption,
                videoUrl: post.videoUrl,
                thumbnailUrl: post.thumbnailUrl,
                matchType: post.matchType,
                stats: {
                    views: post.stats?.views ?? 0,
                    likes: post.stats?.likes ?? 0,
                    comments: post.stats?.comments ?? 0,
                    shares: post.stats?.shares ?? 0,
                },
                isVerified: profile?.isVerified ?? false,
                likedByCurrentUser: likedPostIds.has(String(post._id)),
                score: 0,
            }

            return {
                ...item,
                score: getScore(item),
            }
        })

        const filteredItems = allItems.filter((item) => {
            const matchesSearch =
                !search ||
                item.playerName.toLowerCase().includes(search) ||
                item.location.toLowerCase().includes(search) ||
                item.caption.toLowerCase().includes(search) ||
                item.club?.toLowerCase().includes(search)

            const matchesPosition =
                position === "all-position" || item.position === position

            const matchesAge =
                ageGroup === "all-age" || getAgeGroup(item.age) === ageGroup

            const matchesLocation =
                location === "all-location" ||
                item.location.toLowerCase().includes(location.replace("-", " "))

            const matchesClub =
                club === "all-clubs" ||
                item.club?.toLowerCase().includes(club.replace("-", " "))

            return (
                matchesSearch &&
                matchesPosition &&
                matchesAge &&
                matchesLocation &&
                matchesClub
            )
        })

        const risingTalent = [...filteredItems]
            .sort((first, second) => second.score - first.score)
            .slice(0, 4)

        const trending = [...filteredItems]
            .sort((first, second) => second.stats.views - first.stats.views)
            .slice(0, 6)

        return NextResponse.json(
            {
                success: true,
                message: "Explore data fetched successfully.",
                explore: {
                    risingTalent,
                    trending,
                },
            },
            { status: 200 }
        )
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while fetching explore data.",
            },
            { status: 500 }
        )
    }
}
