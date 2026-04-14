import { upload } from "@vercel/blob/client"

type UploadFileOptions = {
    folder: string
    kind?: "image" | "video"
}

export async function uploadFile(file: File, options: UploadFileOptions) {
    const safeFolder = options.folder.replace(/[^a-zA-Z0-9/-]/g, "") || "uploads"
    const safeFilename = file.name.replace(/\s+/g, "-")
    const pathname = `${safeFolder}/${Date.now()}-${safeFilename}`

    try {
        const uploadedFile = await upload(pathname, file, {
            access: "public",
            handleUploadUrl: "/api/upload",
            clientPayload: JSON.stringify({
                folder: safeFolder,
                kind: options.kind ?? (file.type.startsWith("image/") ? "image" : "video"),
            }),
            multipart: file.size > 4_500_000 || file.type.startsWith("video/"),
        })

        return {
            url: uploadedFile.url,
            pathname: uploadedFile.pathname,
        }
    } catch (error) {
        const message =
            error instanceof Error ? error.message : "Unable to upload this file right now."

        if (message.includes("status code 413")) {
            throw new Error(
                "This file is too large to upload with the current setup. Please use a smaller file or compress the video and try again."
            )
        }

        if (message.toLowerCase().includes("network")) {
            throw new Error(
                "The upload could not be completed due to a network issue. Please check your connection and try again."
            )
        }

        if (message.toLowerCase().includes("invalid upload path")) {
            throw new Error("This file could not be uploaded because the upload path is invalid.")
        }

        throw new Error(message || "Unable to upload this file right now.")
    }
}
