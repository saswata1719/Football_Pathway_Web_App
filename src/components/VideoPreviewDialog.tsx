"use client"

import { useState } from "react"
import { Eye, Heart, MapPin, MessageCircle, Play, Share2, Trash2, X } from "lucide-react"

import CommentsDrawer, { type CommentItem } from "@/components/CommentsDrawer"
import { Button } from "./ui/button"

type VideoPreviewItem = {
    id: string
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
}

export type { VideoPreviewItem }

export default function VideoPreviewDialog({
    item,
    isOpen,
    isVisible,
    onClose,
}: VideoPreviewDialogProps) {
    const [isCommentsVisible, setIsCommentsVisible] = useState(false)
    const [isCommentsOpen, setIsCommentsOpen] = useState(false)

    if (!isOpen || !item) {
        return null
    }

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

    const handleDialogClose = () => {
        setIsCommentsVisible(false)
        setIsCommentsOpen(false)
        onClose()
    }

    const actionItems: ActionItem[] = [
        { key: "likes", label: "Likes", value: item.likes ?? "0", icon: Heart },
        {
            key: "comments",
            label: "Comments",
            value: item.commentsCount ?? "0",
            icon: MessageCircle,
            onClick: openComments,
        },
        { key: "shares", label: "Shares", value: item.shares ?? "0", icon: Share2 },
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
                                {item.title}
                            </h2>
                            {item.subtitle && (
                                <p className="text-sm text-slate-500">{item.subtitle}</p>
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
                                        poster={item.poster}
                                        preload="metadata"
                                    >
                                        <source src={item.videoUrl} type="video/mp4" />
                                    </video>

                                    {item.duration && (
                                        <div className="absolute right-3 top-3 hidden rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm md:block">
                                            {item.duration}
                                        </div>
                                    )}
                                    {item.badge && (
                                        <div className="absolute left-3 top-3 hidden rounded-full bg-white/14 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm md:block">
                                            {item.badge}
                                        </div>
                                    )}

                                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08)_0%,rgba(0,0,0,0)_35%,rgba(0,0,0,0.82)_100%)] md:hidden" />

                                    <div className="absolute bottom-4 left-4 right-20 md:hidden">
                                        <div className="space-y-1">
                                            <h2 className="text-base font-semibold text-white">
                                                {item.title}
                                            </h2>
                                            {item.subtitle && (
                                                <p className="text-sm text-white/82">
                                                    {item.subtitle}
                                                </p>
                                            )}
                                            {item.location && (
                                                <div className="flex items-center gap-1.5 text-xs text-white/75">
                                                    <MapPin className="size-3.5" />
                                                    {item.location}
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
                                                            className="flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-xl border border-white/12 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/55"
                                                            aria-label={`Open ${action.label.toLowerCase()}`}
                                                        >
                                                            <Icon size={20} />
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

                                    {item.showDeleteAction && (
                                        <button
                                            type="button"
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
                            {item.showDeleteAction && (
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        className="w-full cursor-pointer"
                                        variant={"destructive"}
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
                                                className="rounded-[1.15rem] border border-slate-200 bg-white px-3 py-3 text-left shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition-colors hover:bg-slate-50"
                                            >
                                                <div className="flex items-center justify-between text-slate-500">
                                                    <Icon className="size-4.5" />
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
                                        {item.description && (
                                            <p className="mt-1 text-sm leading-6 text-slate-600">
                                                {item.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 rounded-[1.35rem] border border-slate-200 bg-white p-4">
                                {item.location && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <MapPin className="size-4 text-slate-400" />
                                        {item.location}
                                    </div>
                                )}
                                {item.views && (
                                    <div className="flex items-center gap-2 text-sm text-slate-600">
                                        <Eye className="size-4 text-slate-400" />
                                        {item.views} views
                                    </div>
                                )}
                                {item.badge && (
                                    <div className="inline-flex rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                                        {item.badge}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <CommentsDrawer
                comments={item.commentsData ?? []}
                isVisible={isCommentsVisible}
                isOpen={isCommentsOpen}
                onClose={closeComments}
                zIndexClass="z-[80]"
            />
        </>
    )
}
