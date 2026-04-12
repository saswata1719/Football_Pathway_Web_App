"use client"

import { useEffect, useState } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Eye, Heart, MapPin, MessageCircle, Share2 } from "lucide-react"

import { getPostById, getPostComments, trackPostView } from "@/lib/api/post"
import { hasViewedPostInSession, markPostAsViewedInSession } from "@/lib/post-view"
import { Spinner } from "@/components/ui/spinner"

type SharedVideoViewProps = {
    postId: string
}

export default function SharedVideoView({ postId }: SharedVideoViewProps) {
    const queryClient = useQueryClient()
    const { data: post, isLoading, isError } = useQuery({
        queryKey: ["shared-post", postId],
        queryFn: () => getPostById(postId),
    })
    const [trackedViewsCount, setTrackedViewsCount] = useState<number | null>(null)

    const { data: comments = [] } = useQuery({
        queryKey: ["shared-post-comments", postId],
        queryFn: () => getPostComments(postId),
        enabled: Boolean(post),
    })

    useEffect(() => {
        if (!postId || hasViewedPostInSession(postId)) {
            return
        }

        markPostAsViewedInSession(postId)

        void trackPostView(postId)
            .then((data) => {
                setTrackedViewsCount(data.views)
                queryClient.invalidateQueries({ queryKey: ["shared-post", postId] })
                queryClient.invalidateQueries({ queryKey: ["feed"] })
                queryClient.invalidateQueries({ queryKey: ["explore"] })
                queryClient.invalidateQueries({ queryKey: ["performance"] })
            })
            .catch(() => {})
    }, [postId, queryClient])

    if (isLoading) {
        return (
            <main className="flex min-h-svh items-center justify-center bg-white px-4">
                <div className="flex flex-col items-center gap-3">
                    <Spinner className="size-6 text-slate-700" />
                    <p className="text-sm text-slate-500">Loading video...</p>
                </div>
            </main>
        )
    }

    if (isError || !post) {
        return (
            <main className="flex min-h-svh items-center justify-center bg-white px-4">
                <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
                    Unable to load this shared video right now.
                </div>
            </main>
        )
    }

    const positionLabel = `${post.position.charAt(0).toUpperCase()}${post.position.slice(1)}`
    const viewsCount = trackedViewsCount ?? (post.stats?.views ?? 0)

    return (
        <main className="min-h-svh bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] px-4 py-6">
            <div className="mx-auto flex max-w-5xl flex-col gap-5 md:flex-row">
                <section className="w-full overflow-hidden rounded-[1.75rem] border border-slate-200 bg-black md:max-w-sm">
                    <div className="relative aspect-[9/16] w-full bg-black">
                        <video
                            className="h-full w-full object-contain bg-black"
                            controls
                            autoPlay
                            playsInline
                            poster={post.thumbnailUrl}
                        >
                            <source src={post.videoUrl} type="video/mp4" />
                        </video>
                    </div>
                </section>

                <section className="flex-1 space-y-4">
                    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                        <h1 className="text-2xl font-semibold text-slate-900">{post.caption}</h1>
                        <p className="mt-2 text-sm text-slate-500">
                            {positionLabel} • {post.age}
                        </p>
                        <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                            <MapPin className="size-4" />
                            {post.location}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Eye className="size-4" />
                                <span className="text-xs font-medium">Views</span>
                            </div>
                            <p className="mt-2 text-lg font-semibold text-slate-900">
                                {viewsCount}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Heart className="size-4" />
                                <span className="text-xs font-medium">Likes</span>
                            </div>
                            <p className="mt-2 text-lg font-semibold text-slate-900">
                                {post.stats?.likes ?? 0}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="flex items-center gap-2 text-slate-500">
                                <MessageCircle className="size-4" />
                                <span className="text-xs font-medium">Comments</span>
                            </div>
                            <p className="mt-2 text-lg font-semibold text-slate-900">
                                {post.stats?.comments ?? 0}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-slate-200 bg-white p-4">
                            <div className="flex items-center gap-2 text-slate-500">
                                <Share2 className="size-4" />
                                <span className="text-xs font-medium">Shares</span>
                            </div>
                            <p className="mt-2 text-lg font-semibold text-slate-900">
                                {post.stats?.shares ?? 0}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
                        <h2 className="text-lg font-semibold text-slate-900">Comments</h2>
                        <div className="mt-4 space-y-3">
                            {comments.length > 0 ? (
                                comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                                    >
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-semibold text-slate-900">
                                                {comment.name}
                                            </p>
                                            <span className="text-xs text-slate-400">
                                                {new Date(comment.time).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm leading-6 text-slate-600">
                                            {comment.text}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500">
                                    No comments yet on this video.
                                </p>
                            )}
                        </div>
                    </div>
                </section>
            </div>
        </main>
    )
}
