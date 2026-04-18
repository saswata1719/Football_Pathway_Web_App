const FALLBACK_AUTH_SECRET = "change-this-auth-secret"
const FALLBACK_BASE_URL = "http://localhost:3000"

function readEnvValue(key: string) {
    return process.env[key]?.trim()
}

function getRequiredEnvValue(key: string) {
    const value = readEnvValue(key)

    if (!value) {
        throw new Error(`${key} is not defined in environment variables.`)
    }

    return value
}

export const env = {
    MONGODB_URI: getRequiredEnvValue("mongodb+srv://saswata1719_db_user:lbJgjbsg7XrY0NEn@cluster0.1qbmnqv.mongodb.net/Web_App"),
    BLOB_READ_WRITE_TOKEN: getRequiredEnvValue("vercel_blob_rw_CzOfLzQuCoIHT3JF_5UkPYvEDZJZORXv5rIWu2bMnPouZrf"),
    BETTER_AUTH_SECRET: getRequiredEnvValue("tdoXOGUIxYDZHpc7lZ9Wn4Elg9SaHbpN"),
    BETTER_AUTH_URL: getRequiredEnvValue("https://football-pathway-web-app.vercel.app/"),
    GOOGLE_CLIENT_ID: getRequiredEnvValue("517041865033-dom7g2lk68majmd623k5f91j2pc17vlu.apps.googleusercontent.com"),
    GOOGLE_CLIENT_SECRET: getRequiredEnvValue("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"),
    NEXT_PUBLIC_BETTER_AUTH_URL:
        readEnvValue("https://football-pathway-web-app.vercel.app") || readEnvValue("BETTER_AUTH_URL") || "",
    AUTH_SECRET: readEnvValue("AUTH_SECRET") || FALLBACK_AUTH_SECRET,
    VERCEL_URL: readEnvValue("VERCEL_URL") || "",
    NODE_ENV: readEnvValue("NODE_ENV") || "development",
}

export const appEnv = {
    isProduction: env.NODE_ENV === "production",
    authBaseUrl: env.NEXT_PUBLIC_BETTER_AUTH_URL || env.BETTER_AUTH_URL || FALLBACK_BASE_URL,
}
