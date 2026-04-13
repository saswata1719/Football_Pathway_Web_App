import axios from "axios"

type CreateProfilePayload = {
    userId: string
}

export type UpdateProfilePayload = {
    fullName: string
    image: string | null
    age: number | null
    position: "striker" | "midfielder" | "defender" | "goalkeeper" | "winger" | null
    strongFoot: "left" | "right" | "both" | null
    location: string | null
    club: string | null
    bio: string | null
    topSkill: string | null
}

export type PublicProfileResponse = {
    profile: {
        userId: string
        fullName: string
        image: string | null
        age: number | null
        position: "striker" | "midfielder" | "defender" | "goalkeeper" | "winger" | null
        strongFoot: "left" | "right" | "both" | null
        location: string | null
        club: string | null
        bio: string
        topSkill: string | null
        profileType: string
        isVerified: boolean
        updatedAt: string | null
    }
    posts: Array<{
        _id: string
        position: "striker" | "midfielder" | "defender" | "goalkeeper" | "winger"
        age: number
        location: string
        matchType: "match" | "practice" | "trial"
        caption: string
        videoUrl: string
        thumbnailUrl: string
        stats?: {
            views?: number
            likes?: number
            comments?: number
            shares?: number
        }
    }>
}

export async function createProfile(payload: CreateProfilePayload) {
    const res = await axios.post("/api/profile", payload)

    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to prepare profile")
    }

    return res.data.profile
}

export async function getProfile() {
    const res = await axios.get("/api/profile")

    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to fetch profile")
    }

    return res.data.profile
}

export async function updateProfile(payload: UpdateProfilePayload) {
    const res = await axios.put("/api/profile", payload)

    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to update profile")
    }

    return res.data.profile
}

export async function getPublicProfile(userId: string) {
    const res = await axios.get(`/api/profile/${userId}`)

    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to fetch player profile")
    }

    return {
        profile: res.data.profile,
        posts: res.data.posts,
    } as PublicProfileResponse
}
