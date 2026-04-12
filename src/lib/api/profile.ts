import axios from "axios"

type CreateProfilePayload = {
    userId: string
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
