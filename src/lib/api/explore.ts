import axios from "axios"

export type ExploreItem = {
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

export type ExploreFilters = {
    search: string
    position: string
    ageGroup: string
    location: string
    club: string
}

export async function getExplore(filters: ExploreFilters) {
    const res = await axios.get("/api/explore", {
        params: filters,
    })

    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to fetch explore data")
    }

    return res.data.explore as {
        risingTalent: ExploreItem[]
        trending: ExploreItem[]
    }
}
