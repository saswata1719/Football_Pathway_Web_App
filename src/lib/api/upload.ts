import axios from "axios"

type UploadFileOptions = {
    folder: string
}

export async function uploadFile(file: File, options: UploadFileOptions) {
    const formData = new FormData()

    formData.append("file", file)
    formData.append("folder", options.folder)

    const res = await axios.post("/api/upload", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    })

    if (!res.data?.success) {
        throw new Error(res.data?.message || "Failed to upload file")
    }

    return res.data.file as { url: string; pathname: string }
}
