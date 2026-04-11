import {
    ImagePlus,
    MapPin,
    Tag,
    Trophy,
    Upload,
    Video,
} from "lucide-react"

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

export default function PostComposer() {
    return (
        <main className="min-h-svh bg-white px-4 pb-28 pt-14 ">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
                <section className="">
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

                <section className="">
                    <form className="space-y-5">
                        <FieldGroup>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="position">Position</FieldLabel>
                                    <Select defaultValue="striker">
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
                                    <Input id="age" type="number" placeholder="27" />
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
                                            className=" pl-9"
                                        />
                                    </div>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="foot">Strong Foot</FieldLabel>
                                    <Select defaultValue="right">
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
                                    <Select defaultValue="match">
                                        <SelectTrigger className=" w-full rounded-lg border-slate-200 bg-white">
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
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                />
                            </Field>
                        </FieldGroup>

                        <FieldSeparator className="my-5">Media Upload</FieldSeparator>

                        <FieldGroup>
                            <div className="grid gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="videoUpload">Video Upload</FieldLabel>
                                    <label
                                        htmlFor="videoUpload"
                                        className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition-colors hover:border-slate-400 hover:bg-slate-100"
                                    >
                                        <Video className="size-8 text-slate-500" />
                                        <p className="mt-3 text-sm font-semibold text-slate-700">
                                            Upload Video
                                        </p>
                                        <FieldDescription className="!mt-1 text-xs text-center">
                                            MP4, MOV, or highlight reel clip
                                        </FieldDescription>
                                        <input
                                            id="videoUpload"
                                            type="file"
                                            accept="video/*"
                                            className="sr-only"
                                        />
                                    </label>
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="thumbnailUpload">Thumbnail Upload</FieldLabel>
                                    <label
                                        htmlFor="thumbnailUpload"
                                        className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition-colors hover:border-slate-400 hover:bg-slate-100"
                                    >
                                        <ImagePlus className="size-8 text-slate-500" />
                                        <p className="mt-3 text-sm font-semibold text-slate-700">
                                            Upload Thumbnail
                                        </p>
                                        <FieldDescription className="!mt-1 text-xs text-center">
                                            Add a clean cover image for the post
                                        </FieldDescription>
                                        <input
                                            id="thumbnailUpload"
                                            type="file"
                                            accept="image/*"
                                            className="sr-only"
                                        />
                                    </label>
                                </Field>
                            </div>
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
                                    Striker
                                </div>
                                <div className="rounded-xl bg-white px-3 py-3">
                                    <span className="font-medium text-slate-900">Match Type:</span>{" "}
                                    Match
                                </div>
                                <div className="rounded-xl bg-white px-3 py-3">
                                    <span className="font-medium text-slate-900">Strong Foot:</span>{" "}
                                    Right
                                </div>
                                <div className="rounded-xl bg-white px-3 py-3">
                                    <span className="font-medium text-slate-900">Tags:</span>{" "}
                                    #finishing #matchday
                                </div>
                            </div>
                        </section>

                        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                            <Button type="submit" className="w-full py-5">
                                Create Post
                            </Button>
                            {/* <Button
                                type="button"
                                variant="outline"
                                className="h-10 flex-1 rounded-xl"
                            >
                                Save Draft
                            </Button> */}
                        </div>
                    </form>
                </section>
            </div>
        </main>
    )
}
