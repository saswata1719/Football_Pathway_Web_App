import { ProfileModel } from "@/models/ProfileModel"

type BaseProfileUser = {
    _id: string | { toString(): string }
    name?: string | null
    image?: string | null
}

export async function ensureUserProfile(user: BaseProfileUser) {
    const userId = String(user._id)

    const profile = await ProfileModel.findOneAndUpdate(
        { user: userId },
        {
            $setOnInsert: {
                user: userId,
                fullName: user.name?.trim() || "New Player",
                image: user.image ?? null,
                age: null,
                position: null,
                strongFoot: null,
                location: null,
                club: null,
                bio: "",
                topSkill: null,
                profileType: "Player Profile",
                isVerified: false,
                stats: {
                    totalVideos: 0,
                    highlights: 0,
                    matchClips: 0,
                },
            },
        },
        {
            new: true,
            upsert: true,
        }
    )

    return profile
}
