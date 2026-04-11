"use client"

import { useState } from "react"
import { Heart, MapPin, Settings } from "lucide-react"
import Link from "next/link"
import { RiVerifiedBadgeFill } from "react-icons/ri"

import VideoPreviewDialog, { type VideoPreviewItem } from "@/components/VideoPreviewDialog"

const profileStats = [
    { label: "Total Videos", value: "24" },
    { label: "Highlights", value: "12" },
    { label: "Match Clips", value: "08" },
]

const videoGrid = [
    {
        id: "1",
        title: "Winning Finish",
        plays: "24.2K",
        likes: "5.4K",
        commentsCount: "184",
        shares: "612",
        duration: "00:24",
        image:
            "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop",
        role: "Striker • 17",
        location: "Mumbai, India",
        description: "Quick release, sharp movement, and a composed finish in traffic.",
        commentsData: [
            {
                id: "profile-comment-1",
                name: "Coach Nikhil",
                time: "4m ago",
                text: "Love the timing of the run here. Very clean finish.",
            },
            {
                id: "profile-comment-2",
                name: "Talent Scout",
                time: "15m ago",
                text: "Strong movement between the center-backs. Keep posting match clips like this.",
            },
        ],
    },
    {
        id: "2",
        title: "Press Break Run",
        plays: "18.9K",
        likes: "4.1K",
        commentsCount: "126",
        shares: "388",
        duration: "00:18",
        image:
            "https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=800&auto=format&fit=crop",
        role: "Winger • 18",
        location: "Delhi, India",
        description: "Burst of pace down the line and a clean final action in transition.",
        commentsData: [
            {
                id: "profile-comment-3",
                name: "Aarush",
                time: "8m ago",
                text: "That first step is elite. Defender had no chance.",
            },
        ],
    },
    {
        id: "3",
        title: "Inside Channel Goal",
        plays: "15.4K",
        likes: "3.7K",
        commentsCount: "98",
        shares: "244",
        duration: "00:31",
        image:
            "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
        role: "Striker • 17",
        location: "Pune, India",
        description: "Smart run off the shoulder and a tidy finish across goal.",
        commentsData: [
            {
                id: "profile-comment-4",
                name: "Match Review",
                time: "11m ago",
                text: "Good body shape before the shot. Nice composure.",
            },
        ],
    },
    {
        id: "4",
        title: "Quick Turn Assist",
        plays: "12.7K",
        likes: "2.9K",
        commentsCount: "76",
        shares: "190",
        duration: "00:20",
        image:
            "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop",
        role: "Midfielder • 18",
        location: "Goa, India",
        description: "Turns out of pressure well and releases the runner at the right moment.",
        commentsData: [
            {
                id: "profile-comment-5",
                name: "Playmaker Hub",
                time: "6m ago",
                text: "Sharp awareness. The turn creates the whole move.",
            },
        ],
    },
    {
        id: "5",
        title: "Counter Attack",
        plays: "10.3K",
        likes: "2.1K",
        commentsCount: "54",
        shares: "161",
        duration: "00:26",
        image:
            "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800&auto=format&fit=crop",
        role: "Winger • 19",
        location: "Bengaluru, India",
        description: "Direct carry into space with strong acceleration and end product.",
        commentsData: [
            {
                id: "profile-comment-6",
                name: "Fast Break",
                time: "9m ago",
                text: "Really direct and positive. Great pace over distance.",
            },
        ],
    },
    {
        id: "6",
        title: "First Touch Control",
        plays: "9.6K",
        likes: "1.8K",
        commentsCount: "43",
        shares: "124",
        duration: "00:17",
        image:
            "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?q=80&w=800&auto=format&fit=crop",
        role: "Striker • 18",
        location: "Chennai, India",
        description: "Excellent first touch under pressure before setting up the next action.",
        commentsData: [
            {
                id: "profile-comment-7",
                name: "Coach Panel",
                time: "17m ago",
                text: "That first touch gives you the whole next action. Very tidy.",
            },
        ],
    },
]

export default function ProfileView() {
    const [selectedVideo, setSelectedVideo] = useState<VideoPreviewItem | null>(null)
    const [isDialogVisible, setIsDialogVisible] = useState(false)

    const openVideoDialog = (video: (typeof videoGrid)[number]) => {
        setSelectedVideo({
            id: video.id,
            title: video.title,
            subtitle: video.role,
            location: video.location,
            views: video.plays,
            duration: video.duration,
            poster: video.image,
            videoUrl: "https://www.pexels.com/download/video/32305343/",
            badge: "Uploaded Reel",
            description: video.description,
            likes: video.likes,
            commentsCount: video.commentsCount,
            shares: video.shares,
            commentsData: video.commentsData,
        })
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setIsDialogVisible(true))
        })
    }

    const closeVideoDialog = () => {
        setIsDialogVisible(false)
        window.setTimeout(() => setSelectedVideo(null), 220)
    }

    return (
        <>
            <main className="min-h-svh bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] px-4 pb-28 pt-3 sm:px-6 md:pt-5">
                <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
                    <section className="overflow-hidden">
                        <div className="relative py-6">
                            <div className="flex items-end justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div
                                        aria-hidden="true"
                                        className="h-18 w-18 rounded-full border-4 border-white bg-cover bg-center md:h-24 md:w-24"
                                        style={{
                                            backgroundImage:
                                                "url('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=80')",
                                        }}
                                    />
                                    <div className="pb-2">
                                        <div className="flex items-center gap-1.5">
                                            <h1 className="font-semibold tracking-tight text-slate-900 md:text-xl">
                                                Saswata Roy
                                            </h1>
                                            <RiVerifiedBadgeFill className="size-4 fill-sky-500 text-sky-500" />
                                        </div>
                                        <p className="mt-1 text-sm font-medium text-slate-600">
                                            27 | Striker
                                        </p>
                                        <div className="md:mt-1 flex items-center gap-1 text-sm text-slate-500">
                                            <MapPin className="size-3.5" />
                                            Mumbai, India
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end justify-between gap-7 md:gap-10">
                                    <Link
                                        href="/edit-profile"
                                        className="cursor-pointer opacity-80 transition-all duration-300 hover:rotate-45"
                                        aria-label="Open edit profile page"
                                    >
                                        <Settings size={20} />
                                    </Link>
                                    <div className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                                        Profile
                                    </div>
                                </div>
                            </div>

                            <p className="mt-4 text-sm text-slate-600 md:leading-6">
                                Aggressive forward with sharp movement in the box, strong
                                finishing instincts, and a calm first touch under pressure.
                            </p>

                            <div className="mt-5 grid grid-cols-3 gap-2 md:gap-3">
                                {profileStats.map((stat) => (
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
                            {videoGrid.map((video) => (
                                <button
                                    key={video.id}
                                    type="button"
                                    onClick={() => openVideoDialog(video)}
                                    className="group overflow-hidden rounded-xl bg-slate-100 text-left"
                                >
                                    <div
                                        aria-hidden="true"
                                        className="relative aspect-[3/4] bg-cover bg-center"
                                        style={{ backgroundImage: `url('${video.image}')` }}
                                    >
                                        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(15,23,42,0.72)_100%)]" />
                                        <div className="absolute right-2 top-2 rounded-full bg-black/40 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                                            {video.duration}
                                        </div>
                                        <div className="absolute inset-x-2 bottom-2">
                                            <div className="flex items-center gap-1 text-white">
                                                <Heart className="size-3.5 fill-current" />
                                                <span className="text-[11px] font-semibold">
                                                    {video.plays}
                                                </span>
                                            </div>
                                            <p className="mt-1 line-clamp-2 text-[11px] font-medium text-white/92">
                                                {video.title}
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
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
