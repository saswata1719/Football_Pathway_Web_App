"use client"

import { useEffect, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Eye, Heart, MapPin, MessageCircle, Play, Share2, Trash2, X } from "lucide-react"
import { toast } from "sonner"

import CommentsDrawer, { type CommentItem } from "@/components/CommentsDrawer"
import DeletePostDialog from "@/components/DeletePostDialog"
import {
    addPostComment,
    deletePost,
    getPostById,
    getPostComments,
    sharePost,
    togglePostLike,
} from "@/lib/api/post"
import { Button } from "./ui/button"

type VideoPreviewItem = {
    id: string
    postId?: string
    title: string
    subtitle?: string
    location?: string
    views?: string
    duration?: string
    poster: string
    videoUrl: string
    badge?: string
    description?: string
    likes?: string
    commentsCount?: string
    shares?: string
    commentsData?: CommentItem[]
    showDeleteAction?: boolean
}

interface VideoPreviewDialogProps {
    item: VideoPreviewItem | null
    isOpen: boolean
    isVisible: boolean
    onClose: () => void
}

type ActionItem = {
    key: string
    label: string
    value: string
    icon: typeof Heart
    onClick?: () => void
    active?: boolean
    disabled?: boolean
}

export type { VideoPreviewItem }

export default function VideoPreviewDialog({
    item,
    isOpen,
    isVisible,
    onClose,
}: VideoPreviewDialogProps) {
    const activeItem = item
    const queryClient = useQueryClient()
    const [isCommentsVisible, setIsCommentsVisible] = useState(false)
    const [isCommentsOpen, setIsCommentsOpen] = useState(false)
    const [isShareVisible, setIsShareVisible] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [likesCount, setLikesCount] = useState(activeItem?.likes ?? "0")
    const [commentsCount, setCommentsCount] = useState(activeItem?.commentsCount ?? "0")
    const [sharesCount, setSharesCount] = useState(activeItem?.shares ?? "0")
    const [isLiked, setIsLiked] = useState(false)

    useEffect(() => {
        setLikesCount(activeItem?.likes ?? "0")
        setCommentsCount(activeItem?.commentsCount ?? "0")
        setSharesCount(activeItem?.shares ?? "0")
        setIsLiked(false)
        setIsShareVisible(false)
        setIsDeleteDialogOpen(false)
    }, [activeItem])

    const { data: livePost } = useQuery({
        queryKey: ["post", activeItem?.postId],
        queryFn: () => getPostById(activeItem!.postId!),
        enabled: Boolean(activeItem?.postId),
    })

    const { data: comments = activeItem?.commentsData ?? [], isFetching: isCommentsLoading } =
        useQuery({
            queryKey: ["post-comments", activeItem?.postId],
            queryFn: () => getPostComments(activeItem!.postId!),
            enabled: Boolean(activeItem?.postId),
        })

    useEffect(() => {
        if (!livePost) {
            return
        }

        setLikesCount(String(livePost.stats?.likes ?? 0))
        setCommentsCount(String(livePost.stats?.comments ?? 0))
        setSharesCount(String(livePost.stats?.shares ?? 0))
        setIsLiked(Boolean(livePost.likedByCurrentUser))
    }, [livePost])

    const likeMutation = useMutation({
        mutationFn: async () => {
            if (!activeItem?.postId) {
                throw new Error("Post id is missing.")
            }

            return togglePostLike(activeItem.postId)
        },
        onSuccess: (data) => {
            setLikesCount(String(data.likes))
            setIsLiked(data.liked)
            queryClient.invalidateQueries({ queryKey: ["post", activeItem?.postId] })
            queryClient.invalidateQueries({ queryKey: ["posts"] })
        },
        onError: (error: Error) => {
            toast.error(error.message || "Unable to update like")
        },
    })

    const commentMutation = useMutation({
        mutationFn: async (text: string) => {
            if (!activeItem?.postId) {
                throw new Error("Post id is missing.")
            }

            return addPostComment(activeItem.postId, text)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["post-comments", activeItem?.postId],
            })
            await queryClient.invalidateQueries({ queryKey: ["post", activeItem?.postId] })
            await queryClient.invalidateQueries({ queryKey: ["posts"] })
            setCommentsCount((previous) => String(Number(previous || "0") + 1))
            toast.success("Comment added")
        },
        onError: (error: Error) => {
            toast.error(error.message || "Unable to add comment")
        },
    })

    const shareMutation = useMutation({
        mutationFn: async () => {
            if (!activeItem?.postId) {
                throw new Error("Post id is missing.")
            }

            return sharePost(activeItem.postId)
        },
        onSuccess: async (data) => {
            setSharesCount(String(data.shares))
            setIsShareVisible(true)
            await queryClient.invalidateQueries({ queryKey: ["post", activeItem?.postId] })
            await queryClient.invalidateQueries({ queryKey: ["posts"] })
        },
        onError: (error: Error) => {
            toast.error(error.message || "Unable to share this post")
        },
    })

    const deleteMutation = useMutation({
        mutationFn: async () => {
            if (!activeItem?.postId) {
                throw new Error("Post id is missing.")
            }

            return deletePost(activeItem.postId)
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["posts"] })
            await queryClient.invalidateQueries({ queryKey: ["profile"] })
            toast.success("Video deleted successfully")
            setIsDeleteDialogOpen(false)
            handleDialogClose()
        },
        onError: (error: Error) => {
            toast.error(error.message || "Unable to delete this post")
        },
    })

    const openComments = () => {
        setIsCommentsOpen(true)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setIsCommentsVisible(true))
        })
    }

    const closeComments = () => {
        setIsCommentsVisible(false)
        window.setTimeout(() => {
            setIsCommentsOpen(false)
        }, 220)
    }

    const handleLike = () => {
        if (!activeItem?.postId) {
            return
        }

        likeMutation.mutate()
    }

    const handleShare = () => {
        if (!activeItem?.postId) {
            return
        }

        shareMutation.mutate()
    }

    const copyShareLink = async () => {
        const shareUrl = shareMutation.data?.shareUrl

        if (!shareUrl) {
            return
        }

        await navigator.clipboard.writeText(shareUrl)
        toast.success("Link copied")
    }

    const handleDialogClose = () => {
        setIsCommentsVisible(false)
        setIsCommentsOpen(false)
        setIsShareVisible(false)
        onClose()
    }

    if (!isOpen || !activeItem) {
        return null
    }

    const actionItems: ActionItem[] = [
        {
            key: "likes",
            label: "Likes",
            value: likesCount,
            icon: Heart,
            onClick: activeItem.postId ? handleLike : undefined,
            active: isLiked,
            disabled: likeMutation.isPending,
        },
        {
            key: "comments",
            label: "Comments",
            value: commentsCount,
            icon: MessageCircle,
            onClick: openComments,
        },
        {
            key: "shares",
            label: "Shares",
            value: sharesCount,
            icon: Share2,
            onClick: activeItem.postId ? handleShare : undefined,
            disabled: shareMutation.isPending,
        },
    ]

    return (
        <>
            <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center">
                <div
                    className={`absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-200 ${
                        isVisible ? "opacity-100" : "opacity-0"
                    }`}
                />

                <button
                    type="button"
                    className="absolute inset-0"
                    aria-label="Close video preview"
                    onClick={handleDialogClose}
                />

                <section
                    className={`relative z-10 w-full max-w-3xl rounded-t-[1.75rem] bg-transparent transition-all duration-300 ease-out md:rounded-[1.75rem] md:bg-white md:shadow-[0_24px_60px_rgba(15,23,42,0.18)] ${
                        isVisible
                            ? "translate-y-0 opacity-100 md:scale-100"
                            : "translate-y-full opacity-0 md:translate-y-6 md:scale-[0.98]"
                    }`}
                >
                    <div className="hidden items-center justify-between border-b border-slate-200 px-4 py-4 md:flex md:px-5">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                {activeItem.title}
                            </h2>
                            {activeItem.subtitle && (
                                <p className="text-sm text-slate-500">{activeItem.subtitle}</p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleDialogClose}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100"
                            aria-label="Close video dialog"
                        >
                            <X className="size-4.5" />
                        </button>
                    </div>

                    <div className="flex flex-col gap-5 p-0 md:flex-row md:p-5">
                        <div className="flex justify-center md:block">
                            <div className="relative w-full overflow-hidden bg-black md:max-w-[16rem] md:rounded-[1.35rem] md:border md:border-slate-200">
                                <button
                                    type="button"
                                    onClick={handleDialogClose}
                                    className="absolute right-3 top-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-md md:hidden"
                                    aria-label="Close video dialog"
                                >
                                    <X className="size-4.5" />
                                </button>

                                <div className="relative aspect-[9/16] w-full bg-black">
                                    <video
                                        className="h-full w-full object-contain bg-black"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                        poster={activeItem.poster}
                                        preload="metadata"
                                    >
                                        <source src={activeItem.videoUrl} type="video/mp4" />
                                    </video>

                                    {activeItem.duration && (
                                        <div className="absolute right-3 top-3 hidden rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm md:block">
                                            {activeItem.duration}
                                        </div>
                                    )}
                                    {activeItem.badge && (
                                        <div className="absolute left-3 top-3 hidden rounded-full bg-white/14 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm md:block">
                                            {activeItem.badge}
                                        </div>
                                    )}

                                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0)_35%,rgba(0,0,0,0.82)_100%)] md:hidden" />

                                    <div className="absolute bottom-4 left-4 right-20 md:hidden">
                                        <div className="space-y-1">
                                            <h2 className="text-base font-semibold text-white">
                                                {activeItem.title}
                                            </h2>
                                            {activeItem.subtitle && (
                                                <p className="text-sm text-white/82">
                                                    {activeItem.subtitle}
                                                </p>
                                            )}
                                            {activeItem.location && (
                                                <div className="flex items-center gap-1.5 text-xs text-white/75">
                                                    <MapPin className="size-3.5" />
                                                    {activeItem.location}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <aside className="absolute bottom-4 right-2 flex flex-col items-center gap-4 md:hidden">
                                        {actionItems.map((action) => {
                                            const Icon = action.icon

                                            if (action.onClick) {
                                                return (
                                                    <div
                                                        key={action.key}
                                                        className="flex w-16 flex-col items-center gap-1.5"
                                                    >
                                                        <button
                                                            type="button"
                                                            onClick={action.onClick}
                                                            disabled={action.disabled}
                                                            className={`flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-xl border backdrop-blur-md transition-colors ${
                                                                action.active
                                                                    ? "border-red-400/30 bg-red-500/20 text-red-300"
                                                                    : "border-white/12 bg-black/40 text-white hover:bg-black/55"
                                                            } ${action.disabled ? "cursor-not-allowed opacity-60" : ""}`}
                                                            aria-label={`Open ${action.label.toLowerCase()}`}
                                                        >
                                                            <Icon
                                                                size={20}
                                                                className={
                                                                    action.active
                                                                        ? "fill-current"
                                                                        : ""
                                                                }
                                                            />
                                                        </button>
                                                        <span className="text-xs font-medium text-white">
                                                            {action.value}
                                                        </span>
                                                    </div>
                                                )
                                            }

                                            return (
                                                <div
                                                    key={action.key}
                                                    className="flex w-16 flex-col items-center gap-1.5"
                                                >
                                                    <div className="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-xl border border-white/12 bg-black/40 text-white backdrop-blur-md">
                                                        <Icon size={20} />
                                                    </div>
                                                    <span className="text-xs font-medium text-white">
                                                        {action.value}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </aside>

                                    {activeItem.showDeleteAction && (
                                        <button
                                            type="button"
                                            onClick={() => setIsDeleteDialogOpen(true)}
                                            className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-red-500 px-3 py-2 text-xs font-medium text-white backdrop-blur-md md:hidden"
                                            aria-label="Delete uploaded reel"
                                        >
                                            <Trash2 className="size-3.5" />
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="hidden min-w-0 flex-1 space-y-4 md:block">
                            {activeItem.showDeleteAction && (
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        className="w-full cursor-pointer"
                                        variant={"destructive"}
                                        onClick={() => setIsDeleteDialogOpen(true)}
                                    >
                                        <Trash2 className="size-4" />
                                        Delete Reel
                                    </Button>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-2">
                                {actionItems.map((action) => {
                                    const Icon = action.icon

                                    if (action.onClick) {
                                        return (
                                            <button
                                                key={action.key}
                                                type="button"
                                                onClick={action.onClick}
                                                disabled={action.disabled}
                                                className={`rounded-[1.15rem] border px-3 py-3 text-left shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition-colors ${
                                                    action.active
                                                        ? "border-red-200 bg-red-50 hover:bg-red-100/70"
                                                        : "border-slate-200 bg-white hover:bg-slate-50"
                                                } ${action.disabled ? "cursor-not-allowed opacity-60" : ""}`}
                                            >
                                                <div
                                                    className={`flex items-center justify-between ${
                                                        action.active
                                                            ? "text-red-500"
                                                            : "text-slate-500"
                                                    }`}
                                                >
                                                    <Icon
                                                        className={`size-4.5 ${
                                                            action.active ? "fill-current" : ""
                                                        }`}
                                                    />
                                                    <span className="text-xs font-medium">{action.label}</span>
                                                </div>
                                                <p className="mt-3 text-base font-semibold text-slate-900">
                                                    {action.value}
                                                </p>
                                            </button>
                                        )
                                    }

                                    return (
                                        <div
                                            key={action.key}
                                            className="rounded-[1.15rem] border border-slate-200 bg-white px-3 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.05)]"
                                        >
                                            <div className="flex items-center justify-between text-slate-500">
                                                <Icon className="size-4.5" />
                                                <span className="text-xs font-medium">{action.label}</span>
                                            </div>
                                            <p className="mt-3 text-base font-semibold text-slate-900">
                                                {action.value}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>

                            <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-start gap-3">
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white">
                                        <Play className="size-4 fill-current" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold text-slate-900">
                                            Caption
                                        </p>
                                        {activeItem.description && (
                                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                                {activeItem.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {isShareVisible && shareMutation.data && (
                                <div className="space-y-3 rounded-[1.35rem] border border-slate-200 bg-white p-4">
                                    <p className="text-sm font-semibold text-slate-900">
                                        Share this video
                                    </p>
                                    <div className="grid grid-cols-2 gap-2">
                                        <a
                                            href={shareMutation.data.targets.whatsapp}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700"
                                        >
                                            WhatsApp
                                        </a>
                                        <a
                                            href={shareMutation.data.targets.telegram}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700"
                                        >
                                            Telegram
                                        </a>
                                        <a
                                            href={shareMutation.data.targets.facebook}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-medium text-slate-700"
                                        >
                                            Facebook
                                        </a>
                                        <button
                                            type="button"
                                            onClick={copyShareLink}
                                            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-left text-sm font-medium text-slate-700"
                                        >
                                            Copy Link
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-3 rounded-[1.35rem] border border-slate-200 bg-white p-4">
                                {activeItem.location && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <MapPin className="size-4 text-slate-400" />
                                        {activeItem.location}
                                    </div>
                                )}
                                {activeItem.views && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Eye className="size-4 text-slate-400" />
                                        {activeItem.views} views
                                    </div>
                                )}
                                {activeItem.badge && (
                                    <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                                        {activeItem.badge}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <CommentsDrawer
                comments={activeItem.postId ? comments : (activeItem.commentsData ?? [])}
                isVisible={isCommentsVisible}
                isOpen={isCommentsOpen}
                onClose={closeComments}
                zIndexClass="z-[80]"
                onSubmit={
                    activeItem.postId
                        ? async (text) => {
                              await commentMutation.mutateAsync(text)
                          }
                        : undefined
                }
                isSubmitting={commentMutation.isPending || isCommentsLoading}
            />
            <DeletePostDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                onConfirm={() => deleteMutation.mutate()}
                isPending={deleteMutation.isPending}
            />
        </>
    )
}
