import { NextResponse } from "next/server"
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as HandleUploadBody
        const jsonResponse = await handleUpload({
            body,
            request,
            onBeforeGenerateToken: async (pathname, clientPayload) => {
                const payload = clientPayload ? JSON.parse(clientPayload) : {}
                const folder =
                    typeof payload.folder === "string" && payload.folder.trim()
                        ? payload.folder.trim()
                        : "uploads"
                const kind = payload.kind === "image" ? "image" : "video"

                const safeFolder = folder.replace(/[^a-zA-Z0-9/-]/g, "") || "uploads"

                if (!pathname.startsWith(`${safeFolder}/`)) {
                    throw new Error("Invalid upload path.")
                }

                return {
                    addRandomSuffix: true,
                    maximumSizeInBytes:
                        kind === "image" ? 20 * 1024 * 1024 : 1024 * 1024 * 1024,
                    allowedContentTypes:
                        kind === "image" ? ["image/*"] : ["video/*"],
                }
            },
            onUploadCompleted: async () => {},
        })

        return NextResponse.json(jsonResponse)
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while preparing the upload.",
            },
            { status: 500 }
        )
    }
}
