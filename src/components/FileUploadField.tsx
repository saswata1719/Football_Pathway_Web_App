"use client"

import { useId, useState } from "react"
import { ImagePlus, UploadCloud, Video } from "lucide-react"

import { uploadFile } from "@/lib/api/upload"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

type FileUploadFieldProps = {
    label: string
    folder: string
    accept: string
    kind?: "image" | "video"
    previewType?: "avatar" | "thumbnail"
    value?: string | null
    onChange: (url: string) => void
    onUploadingChange?: (isUploading: boolean) => void
}

export default function FileUploadField({
    label,
    folder,
    accept,
    kind = "image",
    previewType = "avatar",
    value,
    onChange,
    onUploadingChange,
}: FileUploadFieldProps) {
    const inputId = useId()
    const [isUploading, setIsUploading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]

        if (!file) {
            return
        }

        setErrorMessage("")
        setIsUploading(true)
        onUploadingChange?.(true)

        try {
            const uploadedFile = await uploadFile(file, { folder, kind })
            onChange(uploadedFile.url)
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : "Unable to upload file right now."
            )
        } finally {
            setIsUploading(false)
            onUploadingChange?.(false)
            event.target.value = ""
        }
    }

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-slate-900">{label}</p>
                    <p className="text-xs text-slate-500">
                        Upload {kind === "image" ? "an image" : "a video"} from your device.
                    </p>
                </div>

                <label htmlFor={inputId}>
                    <input
                        id={inputId}
                        type="file"
                        accept={accept}
                        className="sr-only"
                        onChange={handleChange}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        asChild
                        className="cursor-pointer"
                        disabled={isUploading}
                    >
                        <span>
                            {isUploading ? (
                                <Spinner className="size-4" />
                            ) : kind === "image" ? (
                                <ImagePlus className="size-4" />
                            ) : (
                                <UploadCloud className="size-4" />
                            )}
                            {isUploading ? "Uploading..." : `Upload ${kind}`}
                        </span>
                    </Button>
                </label>
            </div>

            {kind === "image" ? (
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div
                        className={
                            previewType === "thumbnail"
                                ? "h-20 w-28 rounded-xl bg-cover bg-center bg-no-repeat"
                                : "h-20 w-20 rounded-full bg-cover bg-center bg-no-repeat"
                        }
                        style={{
                            backgroundImage: `url('${value || "/user_placeholder.jpg"}')`,
                        }}
                    />
                    <div>
                        <p className="text-sm font-medium text-slate-700">
                            {value ? "Image uploaded" : "No image selected"}
                        </p>
                        <p className="text-xs text-slate-500">
                            {value ? "Your new profile image is ready." : "Use a clear profile photo."}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                    <Video className="size-4" />
                    {value ? "File uploaded successfully." : "No file selected"}
                </div>
            )}

            {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
        </div>
    )
}
