"use client"

import { useRef, useState } from "react"
import {
    Heart,
    MapPin,
    MessageCircle,
    Pause,
    Play,
    Share2,
    Sparkles,
} from "lucide-react"
import { RiVerifiedBadgeFill } from "react-icons/ri"

const demoVideo = {
    source: "https://www.pexels.com/download/video/32305343/",
    poster:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    reference:
        "https://www.pexels.com/video/woman-enjoying-scenic-ocean-view-on-a-cliff-32305343/",
}

const reelItems = [
    {
        id: "saswata-roy",
        name: "Saswata Roy",
        ageRole: "27 | Striker",
        location: "Mumbai",
        headline: "Hot Prospect",
        duration: "00:24",
        description:
            "Quick feet, calm first touch, and a clean finish from the left side. This reel is set up as a demo card with a playable highlight.",
        likes: "18.4K",
        comments: "642",
        shares: "1.2K",
        initials: "SR",
    },
    {
        id: "maya-fernandez",
        name: "Maya Fernandez",
        ageRole: "22 | Winger",
        location: "Goa",
        headline: "Trending Reel",
        duration: "00:24",
        description:
            "Strong carry into space, sharp change of pace, and a composed final ball. Same demo video, different scouting profile data.",
        likes: "12.8K",
        comments: "314",
        shares: "920",
        initials: "MF",
    },
    {
        id: "zayan-khan",
        name: "Zayan Khan",
        ageRole: "19 | Midfielder",
        location: "Lahore",
        headline: "Scout Pick",
        duration: "00:24",
        description:
            "Reads the game well, breaks the line with his first pass, and controls the tempo. This is a static feed item for layout behavior.",
        likes: "9.7K",
        comments: "211",
        shares: "508",
        initials: "ZK",
    },
    {
        id: "arjun-mehta",
        name: "Arjun Mehta",
        ageRole: "24 | Fullback",
        location: "Delhi",
        headline: "Top Form",
        duration: "00:24",
        description:
            "Recovery run, tackle timing, and instant transition forward. The home page stays fixed while only these video cards scroll.",
        likes: "7.1K",
        comments: "154",
        shares: "366",
        initials: "AM",
    },
]

const statMeta = [
    { key: "likes", icon: Heart, label: "Likes" },
    { key: "comments", icon: MessageCircle, label: "Comments" },
    { key: "shares", icon: Share2, label: "Shares" },
] as const

export default function HomeReelFeed() {
    const [playingId, setPlayingId] = useState<string | null>(null)
    const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({})

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
            await currentVideo.play()
            setPlayingId(id)
        } catch {
            setPlayingId(null)
        }
    }

    return (
        <main className="h-svh overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.16),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.14),_transparent_28%),linear-gradient(180deg,_#08111f_0%,_#04070d_100%)]  sm:px-6 sm:pt-5">
            <div className="mx-auto md:h-[calc(100svh-7.5rem)] h-[calc(100svh-4rem)] w-full max-w-md overflow-hidden">
                <div
                    className="no-scrollbar h-full snap-y snap-mandatory overflow-y-auto overscroll-y-contain"
                    onScroll={() => {
                        pauseAllVideos()
                        setPlayingId(null)
                    }}
                >
                    {reelItems.map((item) => {
                        const isPlaying = playingId === item.id

                        return (
                            <article
                                key={item.id}
                                className="flex md:h-[calc(100svh-7.5rem)] h-[calc(100svh-4rem)] snap-start items-center md:py-3"
                            >
                                <section className="relative h-full w-full overflow-hidden md:rounded-[1.4rem] border border-white/10 bg-white/5 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
                                    <video
                                        ref={(element) => {
                                            videoRefs.current[item.id] = element
                                        }}
                                        className="absolute inset-0 h-full w-full object-cover"
                                        controls={false}
                                        controlsList="nodownload noplaybackrate"
                                        disablePictureInPicture
                                        loop
                                        muted
                                        playsInline
                                        poster={demoVideo.poster}
                                        preload="auto"
                                        onClick={() => void togglePlayback(item.id)}
                                        onPause={() => {
                                            if (playingId === item.id) {
                                                setPlayingId(null)
                                            }
                                        }}
                                        onPlay={() => setPlayingId(item.id)}
                                    >
                                        <source src={demoVideo.source} type="video/mp4" />
                                    </video>

                                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,13,0.18)_0%,rgba(4,7,13,0.06)_35%,rgba(4,7,13,0.82)_100%)]" />
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_26%)]" />

                                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-red-500 px-3 py-1.5 text-xs font-medium text-white ">
                                        <Sparkles size={13} />
                                        {item.headline}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => void togglePlayback(item.id)}
                                        className="absolute left-1/2 top-[42%] flex h-[4.5rem] w-[4.5rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/45 text-white shadow-[0_12px_36px_rgba(0,0,0,0.42)] backdrop-blur-md transition-transform hover:scale-105"
                                        aria-label={isPlaying ? "Pause highlight" : "Play highlight"}
                                    >
                                        {isPlaying ? (
                                            <Pause className="size-8 fill-current" />
                                        ) : (
                                            <Play className="ml-1 size-8 fill-current" />
                                        )}
                                    </button>

                                    <div className="absolute bottom-5 left-5 right-20">
                                        <div className="flex items-center gap-2">
                                            <div
                                                aria-hidden="true"
                                                className="h-12 w-12 shrink-0 rounded-full bg-cover bg-center"
                                                style={{
                                                    backgroundImage:
                                                        "url('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D')",
                                                }}
                                            >
                                            </div>
                                            <div className="space-y-1.5">
                                                <div className="">
                                                    <div className="flex items-center gap-1">
                                                        <h1 className="text-lg font-semibold tracking-tight text-white">
                                                            {item.name}
                                                        </h1>
                                                        <RiVerifiedBadgeFill className="size-3.5  text-sky-400" />
                                                    </div>
                                                    <p className="text-xs text-white/78">
                                                        {item.ageRole}
                                                    </p>
                                                    <div className="flex items-center gap-1 text-xs text-white/72">
                                                        <MapPin className="size-3" />
                                                        {item.location}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="max-w-xs  mt-2 text-xs line-clamp-2 text-white/88 sm:max-w-sm">
                                            {item.description}
                                        </p>

                                        <a
                                            href={demoVideo.reference}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex text-xs font-medium text-white/55 transition-colors hover:text-white/80"
                                        >
                                            Reference clip link
                                        </a>
                                    </div>

                                    <aside className="absolute bottom-4 right-2 flex flex-col items-center gap-4">
                                        {statMeta.map((stat) => {
                                            const Icon = stat.icon

                                            return (
                                                <div
                                                    key={stat.label}
                                                    className="flex w-16 flex-col items-center gap-1.5"
                                                >
                                                    <div className="flex h-13 w-13 items-center justify-center rounded-xl border border-white/12 bg-black/40 text-white backdrop-blur-md">
                                                        <Icon size={20} />
                                                    </div>
                                                    <span className="text-xs font-medium text-white">
                                                        {item[stat.key]}
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
        </main >
    )
}
