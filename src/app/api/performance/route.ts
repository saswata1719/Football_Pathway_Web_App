import { NextResponse } from "next/server"

import { DBconnection } from "@/lib/DbConnection"
import { getCurrentUser } from "@/lib/current-user"
import { PostModel } from "@/models/PostModel"

function getGrowth(current: number, previous: number) {
    if (previous === 0) {
        return current > 0 ? 100 : 0
    }

    return Math.round(((current - previous) / previous) * 100)
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

        await DBconnection()

        const posts = await PostModel.find({ user: user._id }).lean()
        const now = Date.now()
        const sevenDaysMs = 7 * 24 * 60 * 60 * 1000
        const currentStart = now - sevenDaysMs
        const previousStart = now - sevenDaysMs * 2

        let totalViews = 0
        let totalLikes = 0
        let totalComments = 0
        let totalShares = 0

        let currentViews = 0
        let previousViews = 0
        let currentEngagement = 0
        let previousEngagement = 0

        for (const post of posts) {
            const views = post.stats?.views ?? 0
            const likes = post.stats?.likes ?? 0
            const comments = post.stats?.comments ?? 0
            const shares = post.stats?.shares ?? 0
            const engagement = likes + comments + shares
            const createdAt = new Date(post.createdAt).getTime()

            totalViews += views
            totalLikes += likes
            totalComments += comments
            totalShares += shares

            if (createdAt >= currentStart) {
                currentViews += views
                currentEngagement += engagement
            } else if (createdAt >= previousStart) {
                previousViews += views
                previousEngagement += engagement
            }
        }

        const totalVideos = posts.length
        const engagementRate =
            totalViews > 0
                ? Number(
                      (((totalLikes + totalComments + totalShares) / totalViews) * 100).toFixed(1)
                  )
                : 0

        const hotProspectScore = Math.min(
            100,
            Math.round(
                totalViews * 0.02 +
                    totalLikes * 1.5 +
                    totalComments * 2.5 +
                    totalShares * 3
            )
        )

        return NextResponse.json(
            {
                success: true,
                message: "Performance fetched successfully.",
                performance: {
                    totals: {
                        views: totalViews,
                        likes: totalLikes,
                        comments: totalComments,
                        videos: totalVideos,
                    },
                    engagementRate,
                    hotProspectScore,
                    growth: {
                        views: getGrowth(currentViews, previousViews),
                        engagement: getGrowth(currentEngagement, previousEngagement),
                    },
                },
            },
            { status: 200 }
        )
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while fetching performance.",
            },
            { status: 500 }
        )
    }
}
