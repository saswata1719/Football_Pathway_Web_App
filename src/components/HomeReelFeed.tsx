"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Heart, MapPin, MessageCircle, Pause, Play, Share2, Sparkles } from "lucide-react"
import Link from "next/link"
import { RiVerifiedBadgeFill } from "react-icons/ri"
import { toast } from "sonner"

import CommentsDrawer from "@/components/CommentsDrawer"
import { getFeed } from "@/lib/api/feed"
import {
    addPostComment,
    getPostComments,
    sharePost,
    togglePostLike,
    trackPostView,
} from "@/lib/api/post"
import type { FeedItem } from "@/lib/api/feed"
import { hasViewedPostInSession, markPostAsViewedInSession } from "@/lib/post-view"

const statMeta = [
    { key: "likes", icon: Heart, label: "Likes" },
    { key: "comments", icon: MessageCircle, label: "Comments" },
    { key: "shares", icon: Share2, label: "Shares" },
] as const

function formatPosition(value: FeedItem["position"]) {
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
}

function formatCount(value: number) {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`
    }

    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`
    }

    return String(value)
}

export default function HomeReelFeed() {
    const queryClient = useQueryClient()
    const { data: feed = [], isLoading, isError } = useQuery({
        queryKey: ["feed"],
        queryFn: () => getFeed(),
    })

    const [playingId, setPlayingId] = useState<string | null>(null)
    const [activeCommentsFor, setActiveCommentsFor] = useState<string | null>(null)
    const [isCommentsVisible, setIsCommentsVisible] = useState(false)
    const [likedOverrides, setLikedOverrides] = useState<Record<string, boolean>>({})
    const [likesOverrides, setLikesOverrides] = useState<Record<string, number>>({})
    const [commentsOverrides, setCommentsOverrides] = useState<Record<string, number>>({})
    const [sharesOverrides, setSharesOverrides] = useState<Record<string, number>>({})
    const [pendingLikeId, setPendingLikeId] = useState<string | null>(null)
    const [pendingShareId, setPendingShareId] = useState<string | null>(null)
    const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})
    const articleRefs = useRef<Record<string, HTMLElement | null>>({})
    const feedRef = useRef<HTMLDivElement | null>(null)

    const activePost = useMemo(
        () => feed.find((item) => item.id === activeCommentsFor) ?? null,
        [feed, activeCommentsFor]
    )

    const { data: activeComments = [], isFetching: isCommentsLoading } = useQuery({
        queryKey: ["post-comments", activeCommentsFor],
        queryFn: () => getPostComments(activeCommentsFor!),
        enabled: Boolean(activeCommentsFor),
    })

    const likeMutation = useMutation({
        mutationFn: async (postId: string) => togglePostLike(postId),
        onSuccess: (data, postId) => {
            setLikedOverrides((previous) => ({
                ...previous,
                [postId]: data.liked,
            }))
            setLikesOverrides((previous) => ({
                ...previous,
                [postId]: data.likes,
            }))
            setPendingLikeId(null)
            queryClient.invalidateQueries({ queryKey: ["feed"] })
        },
        onError: (error: Error) => {
            setPendingLikeId(null)
            toast.error(error.message || "Unable to update like")
        },
    })

    const commentMutation = useMutation({
        mutationFn: async ({ postId, text }: { postId: string; text: string }) =>
            addPostComment(postId, text),
        onSuccess: async (_data, variables) => {
            setCommentsOverrides((previous) => ({
                ...previous,
                [variables.postId]: (previous[variables.postId] ?? activePost?.stats.comments ?? 0) + 1,
            }))
            await queryClient.invalidateQueries({
                queryKey: ["post-comments", variables.postId],
            })
            await queryClient.invalidateQueries({ queryKey: ["feed"] })
            toast.success("Comment added")
        },
        onError: (error: Error) => {
            toast.error(error.message || "Unable to add comment")
        },
    })

    const shareMutation = useMutation({
        mutationFn: async (postId: string) => sharePost(postId),
        onSuccess: async (data, postId) => {
            setSharesOverrides((previous) => ({
                ...previous,
                [postId]: data.shares,
            }))
            setPendingShareId(null)
            await queryClient.invalidateQueries({ queryKey: ["feed"] })

            if (navigator.share) {
                try {
                    await navigator.share({
                        title: "Football Pathway Reel",
                        url: data.shareUrl,
                    })
                    return
                } catch {}
            }

            await navigator.clipboard.writeText(data.shareUrl)
            toast.success("Link copied")
        },
        onError: (error: Error) => {
            setPendingShareId(null)
            toast.error(error.message || "Unable to share this reel")
        },
    })

    const pauseAllVideos = (exceptId?: string) => {
        Object.entries(videoRefs.current).forEach(([videoId, videoElement]) => {
            if (videoId !== exceptId && videoElement && !videoElement.paused) {
                videoElement.pause()
            }
        })
    }

    const togglePlayback = async (id: string) => {
        const currentVideo = videoRefs.current[id]

        if (!currentVideo) {
            return
        }

        if (playingId === id && !currentVideo.paused) {
            currentVideo.pause()
            setPlayingId(null)
            return
        }

        pauseAllVideos(id)

        try {
            currentVideo.muted = false
            currentVideo.volume = 1
            await currentVideo.play()
            setPlayingId(id)
        } catch {
            setPlayingId(null)
        }
    }

    useEffect(() => {
        if (feed.length === 0) {
            return
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const mostVisibleEntry = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0]

                if (!mostVisibleEntry) {
                    return
                }

                const nextId = mostVisibleEntry.target.getAttribute("data-reel-id")

                if (!nextId) {
                    return
                }

                pauseAllVideos(nextId)

                const nextVideo = videoRefs.current[nextId]

                if (!nextVideo) {
                    return
                }

                void nextVideo.play()
                    .then(() => {
                        setPlayingId(nextId)
                    })
                    .catch(() => {
                        setPlayingId(null)
                    })

                if (!hasViewedPostInSession(nextId)) {
                    markPostAsViewedInSession(nextId)

                    void trackPostView(nextId)
                        .then(() => {
                            queryClient.invalidateQueries({ queryKey: ["feed"] })
                            queryClient.invalidateQueries({ queryKey: ["explore"] })
                            queryClient.invalidateQueries({ queryKey: ["performance"] })
                        })
                        .catch(() => {})
                }
            },
            {
                root: feedRef.current,
                threshold: [0.6, 0.8],
            }
        )

        Object.values(articleRefs.current).forEach((article) => {
            if (article) {
                observer.observe(article)
            }
        })

        return () => observer.disconnect()
    }, [feed, queryClient])

    const openComments = (id: string) => {
        pauseAllVideos()
        setPlayingId(null)
        setActiveCommentsFor(id)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setIsCommentsVisible(true))
        })
    }

    const closeComments = () => {
        setIsCommentsVisible(false)
        window.setTimeout(() => {
            setActiveCommentsFor(null)
        }, 220)
    }

    const handleLike = (postId: string) => {
        if (pendingLikeId) {
            return
        }

        setPendingLikeId(postId)
        likeMutation.mutate(postId)
    }

    const handleShare = (postId: string) => {
        if (pendingShareId) {
            return
        }

        setPendingShareId(postId)
        shareMutation.mutate(postId)
    }

    if (isLoading) {
        return (
            <main className="flex h-svh items-center justify-center bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] px-4">
                <p className="text-sm text-slate-500">Loading feed...</p>
            </main>
        )
    }

    if (isError) {
        return (
            <main className="flex h-svh items-center justify-center bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] px-4">
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    Unable to load feed right now.
                </div>
            </main>
        )
    }

    if (feed.length === 0) {
        return (
            <main className="flex h-svh items-center justify-center bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] px-4">
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-center text-sm text-slate-500">
                    No reels available yet. Ask users to upload posts first.
                </div>
            </main>
        )
    }

    return (
        <main className="h-svh overflow-hidden bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] sm:px-4 sm:pt-5">
            <div className="mx-auto h-[calc(100svh-4rem)] w-full max-w-md overflow-hidden md:h-[calc(100svh-7.5rem)]">
                <div
                    ref={feedRef}
                    className="no-scrollbar h-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain"
                >
                    {feed.map((item) => {
                        const isPlaying = playingId === item.id
                        const isLiked = likedOverrides[item.id] ?? item.likedByCurrentUser
                        const likesCount = likesOverrides[item.id] ?? item.stats.likes
                        const commentsCount =
                            commentsOverrides[item.id] ?? item.stats.comments
                        const sharesCount = sharesOverrides[item.id] ?? item.stats.shares
                        const roleLine = `${item.age} | ${formatPosition(item.position)}`

                        return (
                            <article
                                key={item.id}
                                ref={(element) => {
                                    articleRefs.current[item.id] = element
                                }}
                                data-reel-id={item.id}
                                className="flex h-[calc(100svh-4rem)] snap-start items-center overflow-hidden md:h-[calc(100svh-7.5rem)] md:rounded-2xl"
                            >
                                <section className="relative h-full w-full overflow-hidden border border-slate-200 bg-white shadow-[0_20px_45px_rgba(15,23,42,0.18)] md:rounded-2xl">
                                    <video
                                        ref={(element) => {
                                            videoRefs.current[item.id] = element
                                        }}
                                        className="absolute inset-0 h-full w-full object-cover"
                                        controls={false}
                                        controlsList="nodownload noplaybackrate"
                                        disablePictureInPicture
                                        autoPlay
                                        loop
                                        playsInline
                                        poster={item.thumbnailUrl}
                                        preload="auto"
                                        onClick={() => void togglePlayback(item.id)}
                                        onPause={() => {
                                            if (playingId === item.id) {
                                                setPlayingId(null)
                                            }
                                        }}
                                        onPlay={() => setPlayingId(item.id)}
                                    >
                                        <source src={item.videoUrl} type="video/mp4" />
                                    </video>

                                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,13,0)_0%,rgba(4,7,13,0)_58%,rgba(4,7,13,0.18)_72%,rgba(4,7,13,0.82)_100%)]" />
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_26%)]" />

                                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                                        <Sparkles size={13} />
                                        {item.matchType === "match"
                                            ? "Match Reel"
                                            : item.matchType === "practice"
                                              ? "Practice Clip"
                                              : "Trial Reel"}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => void togglePlayback(item.id)}
                                        className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-md transition-colors hover:bg-black/45"
                                        aria-label={isPlaying ? "Pause video" : "Play video"}
                                    >
                                        {isPlaying ? (
                                            <Pause className="size-4 fill-current" />
                                        ) : (
                                            <Play className="ml-0.5 size-4 fill-current" />
                                        )}
                                    </button>

                                    {!isPlaying && (
                                        <button
                                            type="button"
                                            onClick={() => void togglePlayback(item.id)}
                                            className="absolute left-1/2 top-[42%] flex h-[3.8rem] w-[3.8rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white shadow-[0_12px_36px_rgba(0,0,0,0.42)] backdrop-blur-md transition-transform hover:scale-105"
                                            aria-label="Play highlight"
                                        >
                                            <Play className="ml-1 fill-current" />
                                        </button>
                                    )}

                                    <div className="absolute bottom-5 left-5 right-20">
                                        <Link
                                            href={`/players/${item.playerUserId}`}
                                            className="flex items-center gap-2"
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={item.playerImage || "/user_placeholder.jpg"}
                                                alt={item.playerName}
                                                className="h-12 w-12 shrink-0 rounded-full object-cover"
                                                onError={(event) => {
                                                    event.currentTarget.src = "/user_placeholder.jpg"
                                                }}
                                            />
                                            <div className="space-y-1.5">
                                                <div>
                                                    <div className="flex items-center gap-1">
                                                        <h1 className="text-lg font-semibold tracking-tight text-white">
                                                            {item.playerName}
                                                        </h1>
                                                        {item.isVerified && (
                                                            <RiVerifiedBadgeFill className="size-3.5 text-sky-400" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-white/78">
                                                        {roleLine}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-xs text-white/72">
                                                        <MapPin className="size-3" />
                                                        {item.location}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>

                                        <p className="mt-2 max-w-xs line-clamp-2 text-xs text-white/88 sm:max-w-sm">
                                            {item.caption}
                                        </p>
                                    </div>

                                    <aside className="absolute bottom-4 right-2 flex flex-col items-center gap-4">
                                        {statMeta.map((stat) => {
                                            const Icon = stat.icon
                                            const countValue =
                                                stat.key === "likes"
                                                    ? likesCount
                                                    : stat.key === "comments"
                                                      ? commentsCount
                                                      : sharesCount
                                            const isComments = stat.key === "comments"
                                            const isLikes = stat.key === "likes"
                                            const isShares = stat.key === "shares"
                                            const isPending =
                                                (isLikes && pendingLikeId === item.id) ||
                                                (isShares && pendingShareId === item.id)

                                            return (
                                                <div
                                                    key={stat.label}
                                                    className="flex w-16 flex-col items-center gap-1.5"
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            if (isComments) {
                                                                openComments(item.id)
                                                                return
                                                            }

                                                            if (isLikes) {
                                                                handleLike(item.id)
                                                                return
                                                            }

                                                            if (isShares) {
                                                                handleShare(item.id)
                                                            }
                                                        }}
                                                        disabled={Boolean(isPending)}
                                                        className={`flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-xl border backdrop-blur-md transition-colors ${
                                                            isLikes && isLiked
                                                                ? "border-red-400/30 bg-red-500/20 text-red-300"
                                                                : "border-white/12 bg-black/40 text-white hover:bg-black/55"
                                                        } ${isPending ? "cursor-not-allowed opacity-60" : ""}`}
                                                        aria-label={`${stat.label} for ${item.playerName}`}
                                                    >
                                                        <Icon
                                                            size={20}
                                                            className={
                                                                isLikes && isLiked
                                                                    ? "fill-current"
                                                                    : ""
                                                            }
                                                        />
                                                    </button>
                                                    <span className="text-xs font-medium text-white">
                                                        {formatCount(countValue)}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </aside>
                                </section>
                            </article>
                        )
                    })}
                </div>
            </div>
            <CommentsDrawer
                comments={activeComments}
                isVisible={isCommentsVisible}
                isOpen={!!activeCommentsFor}
                onClose={closeComments}
                onSubmit={
                    activeCommentsFor
                        ? async (text) => {
                              await commentMutation.mutateAsync({
                                  postId: activeCommentsFor,
                                  text,
                              })
                          }
                        : undefined
                }
                isSubmitting={commentMutation.isPending || isCommentsLoading}
            />
        </main>
    )
}
