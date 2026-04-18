import { createAuthClient } from "better-auth/react"
import { publicEnv } from "@/lib/public-env"

export const authClient = createAuthClient(
    publicEnv.NEXT_PUBLIC_BETTER_AUTH_URL
        ? {
            baseURL: publicEnv.NEXT_PUBLIC_BETTER_AUTH_URL,
        }
        : {}
)
