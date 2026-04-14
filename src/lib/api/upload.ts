import axios from "axios"

type UploadFileOptions = {
    folder: string
}

export async function uploadFile(file: File, options: UploadFileOptions) {
    const formData = new FormData()

    formData.append("file", file)
    formData.append("folder", options.folder)

    try {
        const res = await axios.post("/api/upload", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        })

        if (!res.data?.success) {
            throw new Error(res.data?.message || "Failed to upload file")
        }

        return res.data.file as { url: string; pathname: string }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const statusCode = error.response?.status
            const apiMessage = error.response?.data?.message

            if (statusCode === 413) {
                throw new Error(
                    "This file is too large to upload with the current setup. Please use a smaller file or compress the video and try again."
                )
            }

            if (statusCode === 400) {
                throw new Error(apiMessage || "Please select a valid file and try again.")
            }

            if (statusCode === 401 || statusCode === 403) {
                throw new Error("You do not have permission to upload this file right now.")
            }

            if (statusCode && statusCode >= 500) {
                throw new Error(
                    "The upload service is unavailable right now. Please try again in a moment."
                )
            }

            if (error.code === "ERR_NETWORK") {
                throw new Error(
                    "The upload could not be completed due to a network issue. Please check your connection and try again."
                )
            }

            throw new Error(apiMessage || "Unable to upload this file right now.")
        }

        throw new Error("Unable to upload this file right now.")
    }
}
