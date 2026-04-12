"use client"

import { useState } from "react"
import { SendHorizontal, X } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

type CommentItem = {
    id: string
    name: string
    time: string
    text: string
}

interface CommentsDrawerProps {
    comments: CommentItem[]
    isVisible: boolean
    isOpen: boolean
    onClose: () => void
    zIndexClass?: string
    onSubmit?: (text: string) => Promise<void> | void
    isSubmitting?: boolean
}

export type { CommentItem }

function formatCommentTime(value: string) {
    const parsedDate = new Date(value)

    if (Number.isNaN(parsedDate.getTime())) {
        return value
    }

    const diffMs = Date.now() - parsedDate.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 1) {
        return "Just now"
    }

    if (diffMinutes < 60) {
        return `${diffMinutes}m ago`
    }

    if (diffHours < 24) {
        return `${diffHours}h ago`
    }

    if (diffDays < 7) {
        return `${diffDays}d ago`
    }

    return parsedDate.toLocaleDateString()
}

export default function CommentsDrawer({
    comments,
    isVisible,
    isOpen,
    onClose,
    zIndexClass = "z-[60]",
    onSubmit,
    isSubmitting = false,
}: CommentsDrawerProps) {
    const [commentText, setCommentText] = useState("")

    if (!isOpen) {
        return null
    }

    const handleSubmit = async () => {
        const text = commentText.trim()

        if (!text) {
            toast.error("Please write a comment first")
            return
        }

        try {
            await onSubmit?.(text)
            setCommentText("")
        } catch {}
    }

    return (
        <div className={`fixed inset-0 ${zIndexClass} flex items-end`}>
            <button
                type="button"
                className="absolute inset-0"
                aria-label="Close comments"
                onClick={onClose}
            />

            <div
                className={`absolute inset-0 bg-black/35 backdrop-blur-[1px] transition-opacity duration-200 ${
                    isVisible ? "opacity-100" : "opacity-0"
                }`}
            />

            <section
                className={`relative z-10 w-full rounded-t-[1.75rem] bg-white px-4 pb-6 pt-4 shadow-[0_-18px_50px_rgba(15,23,42,0.18)] transition-transform duration-300 ease-out ${
                    isVisible ? "translate-y-0" : "translate-y-full"
                }`}
            >
                <div className="mx-auto flex w-full max-w-2xl flex-col">
                    <div className="mx-auto h-1.5 w-14 rounded-full bg-slate-200" />

                    <div className="mt-4 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Comments
                            </h2>
                            <p className="text-sm text-slate-500">
                                Join the conversation on this highlight
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100"
                            aria-label="Close comments drawer"
                        >
                            <X className="size-4.5" />
                        </button>
                    </div>

                    <div className="mt-5 max-h-[48svh] space-y-3 overflow-y-auto pr-1">
                        {comments.map((comment) => (
                            <article
                                key={comment.id}
                                className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                                        {comment.name
                                            .split(" ")
                                            .map((part) => part[0])
                                            .join("")
                                            .slice(0, 2)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-semibold text-slate-900">
                                                {comment.name}
                                            </h3>
                                            <span className="text-xs text-slate-400">
                                                {formatCommentTime(comment.time)}
                                            </span>
                                        </div>
                                        <p className="mt-1 text-sm leading-6 text-slate-600">
                                            {comment.text}
                                        </p>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>

                    <div className="mt-5 flex items-center gap-3 border-t border-slate-200 pt-4">
                        <Input
                            type="text"
                            placeholder="Write a comment..."
                            className="h-11 rounded-xl border-slate-200 bg-slate-50"
                            value={commentText}
                            onChange={(event) => setCommentText(event.target.value)}
                        />
                        <Button
                            type="button"
                            className="h-11 rounded-xl px-4"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <Spinner className="size-4" />
                            ) : (
                                <SendHorizontal className="size-4" />
                            )}
                            {isSubmitting ? "Posting" : "Post"}
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
