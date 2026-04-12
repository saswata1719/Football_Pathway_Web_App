import axios from "axios"

export type FeedItem = {
    id: string
    title: string
    caption: string
    videoUrl: string
    thumbnailUrl: string
    position: "striker" | "midfielder" | "defender" | "goalkeeper" | "winger"
    age: number
    matchType: "match" | "practice" | "trial"
    tags: string[]
    location: string
    playerName: string
    playerImage: string
    isVerified: boolean
    stats: {
        views: number
        likes: number
        comments: number
        shares: number
    }
    likedByCurrentUser: boolean
}

export async function getFeed() {
    const res = await axios.get("/api/feed")

    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to fetch feed")
    }

    return res.data.feed as FeedItem[]
}
