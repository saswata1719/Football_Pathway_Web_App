"use client"

import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { MapPin, Tag, Trophy, Upload } from "lucide-react"
import { toast } from "sonner"

import FileUploadField from "@/components/FileUploadField"
import { createPost, type CreatePostPayload } from "@/lib/api/post"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"

type PostFormState = {
    position: CreatePostPayload["position"]
    age: string
    location: string
    strongFoot: CreatePostPayload["strongFoot"]
    matchType: CreatePostPayload["matchType"]
    tags: string
    caption: string
    videoUrl: string
    thumbnailUrl: string
}

const initialFormState: PostFormState = {
    position: "striker",
    age: "",
    location: "",
    strongFoot: "right",
    matchType: "match",
    tags: "",
    caption: "",
    videoUrl: "",
    thumbnailUrl: "",
}

export default function PostComposer() {
    const queryClient = useQueryClient()
    const [formData, setFormData] = useState<PostFormState>(initialFormState)

    const { mutate, isPending } = useMutation({
        mutationFn: async (payload: CreatePostPayload) => {
            return createPost(payload)
        },
        onSuccess: async () => {
            toast.success("Post created successfully")
            setFormData(initialFormState)
            await queryClient.invalidateQueries({ queryKey: ["posts"] })
        },
        onError: (error: Error) => {
            toast.error(error.message || "Something went wrong")
        },
    })

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value } = event.target

        setFormData((previous) => ({
            ...previous,
            [id]: value,
        }))
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!formData.videoUrl || !formData.thumbnailUrl) {
            toast.error("Please upload video and thumbnail first")
            return
        }

        const age = Number(formData.age)

        if (!Number.isFinite(age) || age < 0) {
            toast.error("Please enter a valid age")
            return
        }

        mutate({
            position: formData.position,
            age,
            location: formData.location.trim(),
            strongFoot: formData.strongFoot,
            matchType: formData.matchType,
            caption: formData.caption.trim(),
            tags: formData.tags
                .split(/[\s,]+/)
                .map((tag) => tag.trim())
                .filter(Boolean),
            videoUrl: formData.videoUrl,
            thumbnailUrl: formData.thumbnailUrl,
        })
    }

    const previewTags = formData.tags.trim() || "No tags added"

    return (
        <main className="min-h-svh bg-white px-4 pb-28 pt-14">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
                <section>
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                                <Upload className="size-3.5" />
                                Create Post
                            </div>
                            <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
                                Upload New Highlight
                            </h1>
                            <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">
                                Add your player details, match context, media files, and
                                caption so your post is ready to publish.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <FieldGroup>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="position">Position</FieldLabel>
                                    <Select
                                        value={formData.position}
                                        onValueChange={(value) =>
                                            setFormData((previous) => ({
                                                ...previous,
                                                position: value as PostFormState["position"],
                                            }))
                                        }
                                    >
                                        <SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white">
                                            <SelectValue placeholder="Select position" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Position</SelectLabel>
                                                <SelectItem value="striker">Striker</SelectItem>
                                                <SelectItem value="midfielder">Midfielder</SelectItem>
                                                <SelectItem value="defender">Defender</SelectItem>
                                                <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
                                                <SelectItem value="winger">Winger</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="age">Age</FieldLabel>
                                    <Input
                                        id="age"
                                        type="number"
                                        placeholder="27"
                                        value={formData.age}
                                        onChange={handleInputChange}
                                    />
                                </Field>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="location">Location</FieldLabel>
                                    <div className="relative">
                                        <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            id="location"
                                            type="text"
                                            placeholder="Mumbai, India"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            className="pl-9"
                                        />
                                    </div>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="strongFoot">Strong Foot</FieldLabel>
                                    <Select
                                        value={formData.strongFoot}
                                        onValueChange={(value) =>
                                            setFormData((previous) => ({
                                                ...previous,
                                                strongFoot: value as PostFormState["strongFoot"],
                                            }))
                                        }
                                    >
                                        <SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white">
                                            <SelectValue placeholder="Select strong foot" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Strong Foot</SelectLabel>
                                                <SelectItem value="left">Left</SelectItem>
                                                <SelectItem value="right">Right</SelectItem>
                                                <SelectItem value="both">Both</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="matchType">Match Type</FieldLabel>
                                    <Select
                                        value={formData.matchType}
                                        onValueChange={(value) =>
                                            setFormData((previous) => ({
                                                ...previous,
                                                matchType: value as PostFormState["matchType"],
                                            }))
                                        }
                                    >
                                        <SelectTrigger className="w-full rounded-lg border-slate-200 bg-white">
                                            <SelectValue placeholder="Select match type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Match Type</SelectLabel>
                                                <SelectItem value="match">Match</SelectItem>
                                                <SelectItem value="practice">Practice</SelectItem>
                                                <SelectItem value="trial">Trial</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="tags">Tags</FieldLabel>
                                    <div className="relative">
                                        <Tag className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            id="tags"
                                            type="text"
                                            placeholder="#finishing #trial #striker"
                                            value={formData.tags}
                                            onChange={handleInputChange}
                                            className="pl-9"
                                        />
                                    </div>
                                </Field>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="caption">Caption</FieldLabel>
                                <textarea
                                    id="caption"
                                    rows={4}
                                    placeholder="Describe the moment, performance, or key action from this clip..."
                                    value={formData.caption}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                />
                            </Field>
                        </FieldGroup>

                        <FieldSeparator className="my-5">Media Upload</FieldSeparator>

                        <FieldGroup>
                            <div className="grid gap-4 md:grid-cols-2">
                                <FileUploadField
                                    label="Video Upload"
                                    folder="posts/videos"
                                    accept="video/*"
                                    kind="video"
                                    value={formData.videoUrl}
                                    onChange={(url) =>
                                        setFormData((previous) => ({
                                            ...previous,
                                            videoUrl: url,
                                        }))
                                    }
                                />

                                <FileUploadField
                                    label="Thumbnail Upload"
                                    folder="posts/thumbnails"
                                    accept="image/*"
                                    kind="image"
                                    previewType="thumbnail"
                                    value={formData.thumbnailUrl}
                                    onChange={(url) =>
                                        setFormData((previous) => ({
                                            ...previous,
                                            thumbnailUrl: url,
                                        }))
                                    }
                                />
                            </div>
                            <FieldDescription className="text-xs">
                                Upload your highlight video and a clean thumbnail before posting.
                            </FieldDescription>
                        </FieldGroup>

                        <FieldSeparator className="my-5">Preview Summary</FieldSeparator>

                        <section className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-center gap-2 text-slate-700">
                                <Trophy className="size-4.5" />
                                <h3 className="text-sm font-semibold">Post Preview</h3>
                            </div>
                            <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
                                <div className="rounded-xl bg-white px-3 py-3">
                                    <span className="font-medium text-slate-900">Position:</span>{" "}
                                    {formData.position}
                                </div>
                                <div className="rounded-xl bg-white px-3 py-3">
                                    <span className="font-medium text-slate-900">Match Type:</span>{" "}
                                    {formData.matchType}
                                </div>
                                <div className="rounded-xl bg-white px-3 py-3">
                                    <span className="font-medium text-slate-900">Strong Foot:</span>{" "}
                                    {formData.strongFoot}
                                </div>
                                <div className="rounded-xl bg-white px-3 py-3">
                                    <span className="font-medium text-slate-900">Tags:</span>{" "}
                                    {previewTags}
                                </div>
                            </div>
                        </section>

                        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                            <Button type="submit" className="w-full py-5" disabled={isPending}>
                                {isPending ? <Spinner className="size-4" /> : "Create Post"}
                            </Button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    )
}
