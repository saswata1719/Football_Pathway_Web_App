import { betterAuth } from "better-auth"
import { mongodbAdapter } from "better-auth/adapters/mongodb"

import { client } from "@/db"
import { env } from "@/lib/env"

const db = client.db()

export const auth = betterAuth({
    baseURL: env.BETTER_AUTH_URL,
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    socialProviders: {
        google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            prompt: "select_account",
        },
    },
})
