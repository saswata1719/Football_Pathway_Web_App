"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Eye, MapPin } from "lucide-react"
import Link from "next/link"
import { RiVerifiedBadgeFill } from "react-icons/ri"

import VideoPreviewDialog, { type VideoPreviewItem } from "@/components/VideoPreviewDialog"
import { Spinner } from "@/components/ui/spinner"
import { getPublicProfile } from "@/lib/api/profile"

type PublicProfileViewProps = {
    userId: string
}

type PublicPostItem = Awaited<ReturnType<typeof getPublicProfile>>["posts"][number]

function getProfileImageUrl(image: string | null | undefined, updatedAt?: string | Date | null) {
    if (!image) {
        return "/user_placeholder.jpg"
    }

    if (!updatedAt) {
        return image
    }

    const version = new Date(updatedAt).getTime()
    const separator = image.includes("?") ? "&" : "?"

    return `${image}${separator}v=${version}`
}

export default function PublicProfileView({ userId }: PublicProfileViewProps) {
    const [selectedVideo, setSelectedVideo] = useState<VideoPreviewItem | null>(null)
    const [isDialogVisible, setIsDialogVisible] = useState(false)

    const { data, isLoading, isError } = useQuery({
        queryKey: ["public-profile", userId],
        queryFn: () => getPublicProfile(userId),
    })

    const openVideoDialog = (post: PublicPostItem) => {
        const postPosition = `${post.position.charAt(0).toUpperCase()}${post.position.slice(1)}`

        setSelectedVideo({
            id: String(post._id),
            postId: String(post._id),
            title: post.caption || "Uploaded Highlight",
            subtitle: `${postPosition} • ${post.age}`,
            location: post.location,
            views: String(post.stats?.views ?? 0),
            duration: post.matchType,
            poster: post.thumbnailUrl,
            videoUrl: post.videoUrl,
            badge: "Uploaded Reel",
            description: post.caption,
            likes: String(post.stats?.likes ?? 0),
            commentsCount: String(post.stats?.comments ?? 0),
            shares: String(post.stats?.shares ?? 0),
            showDeleteAction: false,
        })
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setIsDialogVisible(true))
        })
    }

    const closeVideoDialog = () => {
        setIsDialogVisible(false)
        window.setTimeout(() => setSelectedVideo(null), 220)
    }

    if (isLoading) {
        return (
            <main className="min-h-svh bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] px-4 pb-28 pt-3 sm:px-6 md:pt-5">
                <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3 pt-16">
                    <Spinner className="size-6 text-slate-700" />
                    <p className="text-sm text-slate-500">Loading player profile...</p>
                </div>
            </main>
        )
    }

    if (isError || !data) {
        return (
            <main className="min-h-svh bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] px-4 pb-28 pt-3 sm:px-6 md:pt-5">
                <div className="mx-auto max-w-2xl rounded-2xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
                    Unable to load this player profile right now.
                </div>
            </main>
        )
    }

    const { profile, posts } = data
    const profileImage = getProfileImageUrl(profile.image, profile.updatedAt)
    const profileLocation = profile.location || "Location not added"
    const profileBio = profile.bio?.trim() || "No bio added yet."
    const positionLabel = profile.position
        ? `${profile.position.charAt(0).toUpperCase()}${profile.position.slice(1)}`
        : ""
    const ageLabel = profile.age ? String(profile.age) : ""
    const profileRoleLine =
        positionLabel && ageLabel
            ? `${ageLabel} | ${positionLabel}`
            : positionLabel || ageLabel || "Player profile"

    const totalVideos = posts.length
    const highlightsCount = posts.filter((post) => post.matchType !== "trial").length
    const matchClipsCount = posts.filter((post) => post.matchType === "match").length
    const profileStatsData = [
        { label: "Total Videos", value: String(totalVideos) },
        { label: "Highlights", value: String(highlightsCount) },
        { label: "Match Clips", value: String(matchClipsCount) },
    ]

    return (
        <>
            <main className="min-h-svh bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] px-4 pb-28 pt-3 sm:px-6 md:pt-5">
                <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
                    <section className="overflow-hidden">
                        <div className="relative py-6">
                            <div className="mb-4">
                                <Link
                                    href="/"
                                    className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-700"
                                >
                                    Back to feed
                                </Link>
                            </div>

                            <div className="flex items-end justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div
                                        aria-hidden="true"
                                        className="h-18 w-18 rounded-full border-4 border-white bg-cover bg-center md:h-24 md:w-24"
                                        style={{
                                            backgroundImage: `url('${profileImage}')`,
                                        }}
                                    />
                                    <div className="pb-2">
                                        <div className="flex items-center gap-1.5">
                                            <h1 className="font-semibold tracking-tight text-slate-900 md:text-xl">
                                                {profile.fullName}
                                            </h1>
                                            {profile.isVerified && (
                                                <RiVerifiedBadgeFill className="size-4 fill-sky-500 text-sky-500" />
                                            )}
                                        </div>
                                        <p className="mt-1 text-sm font-medium text-slate-600">
                                            {profileRoleLine}
                                        </p>
                                        <div className="md:mt-1 flex items-center gap-1 text-sm text-slate-500">
                                            <MapPin className="size-3.5" />
                                            {profileLocation}
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                                    Player
                                </div>
                            </div>

                            <p className="mt-4 text-sm text-slate-600 md:leading-6">
                                {profileBio}
                            </p>

                            <div className="mt-5 grid grid-cols-3 gap-2 md:gap-3">
                                {profileStatsData.map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-center"
                                    >
                                        <p className="text-lg font-semibold text-slate-900">
                                            {stat.value}
                                        </p>
                                        <p className="mt-1 text-[11px] font-medium text-slate-500">
                                            {stat.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                                    Video Library
                                </p>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Recent Reels
                                </h2>
                            </div>
                        </div>

                        <div className="mt-4 grid grid-cols-2 gap-2.5 md:grid-cols-3">
                            {posts.length > 0 ? (
                                posts.map((post) => (
                                    <button
                                        key={String(post._id)}
                                        type="button"
                                        onClick={() => openVideoDialog(post)}
                                        className="group w-full overflow-hidden rounded-xl bg-slate-100 text-left"
                                    >
                                        <div
                                            aria-hidden="true"
                                            className="relative aspect-[3/4] bg-cover bg-center"
                                            style={{
                                                backgroundImage: `url('${post.thumbnailUrl}')`,
                                            }}
                                        >
                                            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(15,23,42,0.72)_100%)]" />
                                            <div className="absolute right-2 top-2 rounded-full bg-black/40 px-2 py-1 text-[10px] font-medium capitalize text-white backdrop-blur-sm">
                                                {post.matchType}
                                            </div>
                                            <div className="absolute inset-x-2 bottom-2">
                                                <div className="flex items-center gap-1 text-white">
                                                    <Eye className="size-3.5" />
                                                    <span className="text-[11px] font-semibold">
                                                        {post.stats?.views ?? 0}
                                                    </span>
                                                </div>
                                                <p className="mt-1 line-clamp-2 text-[11px] font-medium text-white/92">
                                                    {post.caption}
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))
                            ) : (
                                <div className="col-span-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
                                    No videos uploaded yet.
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </main>
            <VideoPreviewDialog
                item={selectedVideo}
                isOpen={!!selectedVideo}
                isVisible={isDialogVisible}
                onClose={closeVideoDialog}
            />
        </>
    )
}
