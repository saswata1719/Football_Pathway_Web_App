import axios from "axios"

export type PerformanceData = {
    totals: {
        views: number
        likes: number
        comments: number
        videos: number
    }
    engagementRate: number
    hotProspectScore: number
    growth: {
        views: number
        engagement: number
    }
}

export async function getPerformance() {
    const res = await axios.get("/api/performance")

    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to fetch performance")
    }

    return res.data.performance as PerformanceData
}
