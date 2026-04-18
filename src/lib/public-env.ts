function readPublicEnvValue(key: string) {
    return process.env[key]?.trim() || ""
}

export const publicEnv = {
    NEXT_PUBLIC_BETTER_AUTH_URL: readPublicEnvValue("NEXT_PUBLIC_BETTER_AUTH_URL"),
}
