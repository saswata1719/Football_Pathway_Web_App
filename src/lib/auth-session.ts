import { env } from "@/lib/env"

type SessionPayload = {
    userId: string
    email: string
    exp: number
}

const AUTH_COOKIE_NAME = "auth-token"
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000

function getAuthSecret() {
    return env.AUTH_SECRET
}

function toBase64Url(input: string) {
    return btoa(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function fromBase64Url(input: string) {
    const normalized = input.replace(/-/g, "+").replace(/_/g, "/")
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")

    return atob(padded)
}

async function createSignature(value: string, secret: string) {
    const key = await crypto.subtle.importKey(
        "raw",
        new TextEncoder().encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    )

    const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        new TextEncoder().encode(value)
    )

    const bytes = Array.from(new Uint8Array(signature))
    const binary = bytes.map((byte) => String.fromCharCode(byte)).join("")

    return toBase64Url(binary)
}

export async function createAuthToken(user: { userId: string; email: string }) {
    const payload: SessionPayload = {
        userId: user.userId,
        email: user.email,
        exp: Date.now() + SESSION_DURATION_MS,
    }

    const payloadString = JSON.stringify(payload)
    const encodedPayload = toBase64Url(payloadString)
    const signature = await createSignature(encodedPayload, getAuthSecret())

    return `${encodedPayload}.${signature}`
}

export async function verifyAuthToken(token: string) {
    const [encodedPayload, signature] = token.split(".")

    if (!encodedPayload || !signature) {
        return null
    }

    const expectedSignature = await createSignature(encodedPayload, getAuthSecret())

    if (signature !== expectedSignature) {
        return null
    }

    try {
        const payload = JSON.parse(fromBase64Url(encodedPayload)) as SessionPayload

        if (payload.exp < Date.now()) {
            return null
        }

        return payload
    } catch {
        return null
    }
}

export { AUTH_COOKIE_NAME }
