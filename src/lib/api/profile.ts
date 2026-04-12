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
