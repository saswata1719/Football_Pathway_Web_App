"use client"

import { Eye, MapPin, Play, X } from "lucide-react"

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
}

interface VideoPreviewDialogProps {
    item: VideoPreviewItem | null
    isOpen: boolean
    isVisible: boolean
    onClose: () => void
}

export type { VideoPreviewItem }

export default function VideoPreviewDialog({
    item,
    isOpen,
    isVisible,
    onClose,
}: VideoPreviewDialogProps) {
    if (!isOpen || !item) {
        return null
    }

    return (
        <div className="fixed inset-0 z-[70] flex items-end justify-center md:items-center">
            <button
                type="button"
                className="absolute inset-0"
                aria-label="Close video preview"
                onClick={onClose}
            />

            <div
                className={`absolute inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-200 ${
                    isVisible ? "opacity-100" : "opacity-0"
                }`}
            />

            <section
                className={`relative z-10 w-full max-w-3xl rounded-t-[1.75rem] bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] transition-all duration-300 ease-out md:rounded-[1.75rem] ${
                    isVisible
                        ? "translate-y-0 opacity-100 md:scale-100"
                        : "translate-y-full opacity-0 md:translate-y-6 md:scale-[0.98]"
                }`}
            >
                <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 md:px-5">
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
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100"
                        aria-label="Close video dialog"
                    >
                        <X className="size-4.5" />
                    </button>
                </div>

                <div className="flex gap-5 p-4 md:p-5">
                    <div className="flex justify-center">
                        <div className="w-full max-w-[16rem] overflow-hidden rounded-[1.35rem] border border-slate-200 bg-black">
                        <div className="relative aspect-[9/16] w-full bg-black">
                            <video
                                className="h-full w-full object-contain bg-black"
                                controls
                                playsInline
                                poster={item.poster}
                                preload="metadata"
                            >
                                <source src={item.videoUrl} type="video/mp4" />
                            </video>

                            {item.duration && (
                                <div className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                    {item.duration}
                                </div>
                            )}
                            {item.badge && (
                                <div className="absolute left-3 top-3 rounded-full bg-white/14 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                                    {item.badge}
                                </div>
                            )}
                        </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-[1.35rem] border border-slate-200 bg-slate-50 p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex shrink-0 h-11 w-11 items-center justify-center rounded-full bg-slate-900 text-white">
                                    <Play className="size-4 fill-current" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-slate-900">
                                        Video Details
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
    )
}
