import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

export async function POST(request: Request) {
    try {
        const formData = await request.formData()
        const file = formData.get("file")
        const folder = String(formData.get("folder") || "uploads").trim()

        if (!(file instanceof File)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "File is required.",
                },
                { status: 400 }
            )
        }

        const safeFolder = folder.replace(/[^a-zA-Z0-9/-]/g, "") || "uploads"
        const pathname = `${safeFolder}/${Date.now()}-${file.name.replace(/\s+/g, "-")}`

        const uploadedFile = await put(pathname, file, {
            access: "public",
            addRandomSuffix: true,
        })

        return NextResponse.json(
            {
                success: true,
                message: "File uploaded successfully.",
                file: {
                    url: uploadedFile.url,
                    pathname: uploadedFile.pathname,
                },
            },
            { status: 200 }
        )
    } catch {
        return NextResponse.json(
            {
                success: false,
                message: "Something went wrong while uploading the file.",
            },
            { status: 500 }
        )
    }
}
