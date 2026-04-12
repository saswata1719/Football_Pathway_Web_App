"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
    Eye,
    Filter,
    MapPin,
    Search,
    Sparkles,
    Star,
    StarIcon,
    Trophy,
    Users,
} from "lucide-react"
import Link from "next/link"

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
import VideoPreviewDialog, { type VideoPreviewItem } from "@/components/VideoPreviewDialog"
import { getExplore, type ExploreFilters, type ExploreItem } from "@/lib/api/explore"

function formatCount(value: number) {
    if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`
    }

    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}K`
    }

    return String(value)
}

function formatPosition(value: string) {
    return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
}

const initialFilters: ExploreFilters = {
    search: "",
    position: "all-position",
    ageGroup: "all-age",
    location: "all-location",
    club: "all-clubs",
}

export default function ExploreView() {
    const [selectedVideo, setSelectedVideo] = useState<VideoPreviewItem | null>(null)
    const [isDialogVisible, setIsDialogVisible] = useState(false)
    const [filters, setFilters] = useState<ExploreFilters>(initialFilters)

    const { data, isLoading, isError } = useQuery({
        queryKey: ["explore", filters],
        queryFn: () => getExplore(filters),
    })

    const openVideoDialog = (item: ExploreItem) => {
        setSelectedVideo({
            id: item.id,
            postId: item.id,
            title: item.playerName,
            subtitle: `${formatPosition(item.position)} • ${item.age}`,
            location: item.location,
            views: formatCount(item.stats.views),
            duration: item.matchType,
            poster: item.thumbnailUrl,
            videoUrl: item.videoUrl,
            badge: item.club || "Player Reel",
            description: item.caption,
            likes: String(item.stats.likes),
            commentsCount: String(item.stats.comments),
            shares: String(item.stats.shares),
        })
        requestAnimationFrame(() => {
            requestAnimationFrame(() => setIsDialogVisible(true))
        })
    }

    const closeVideoDialog = () => {
        setIsDialogVisible(false)
        window.setTimeout(() => setSelectedVideo(null), 220)
    }

    const risingTalent = data?.risingTalent ?? []
    const trending = data?.trending ?? []

    return (
        <>
            <main className="min-h-svh bg-white px-4 pb-28 pt-8 sm:px-6">
                <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
                    <section className="space-y-4">
                        <div className="flex flex-col gap-1 md:flex-row md:items-center">
                            <div className="relative flex-1">
                                <Search
                                    size={15}
                                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <Input
                                    type="text"
                                    placeholder="Search players, clubs or skills"
                                    className="pl-9"
                                    value={filters.search}
                                    onChange={(event) =>
                                        setFilters((previous) => ({
                                            ...previous,
                                            search: event.target.value,
                                        }))
                                    }
                                />
                            </div>
                            <button
                                type="button"
                                className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100 md:inline-flex"
                                aria-label="Open filters"
                            >
                                <Filter className="size-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                            <Select
                                value={filters.position}
                                onValueChange={(value) =>
                                    setFilters((previous) => ({
                                        ...previous,
                                        position: value,
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="size-4" />
                                        <SelectValue placeholder="Position" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Position</SelectLabel>
                                        <SelectItem value="all-position">Position</SelectItem>
                                        <SelectItem value="striker">Striker</SelectItem>
                                        <SelectItem value="midfielder">Midfielder</SelectItem>
                                        <SelectItem value="defender">Defender</SelectItem>
                                        <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
                                        <SelectItem value="winger">Winger</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.ageGroup}
                                onValueChange={(value) =>
                                    setFilters((previous) => ({
                                        ...previous,
                                        ageGroup: value,
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <div className="flex items-center gap-2">
                                        <Users className="size-4" />
                                        <SelectValue placeholder="Age Group" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Age Group</SelectLabel>
                                        <SelectItem value="all-age">Age Group</SelectItem>
                                        <SelectItem value="u16">Under 16</SelectItem>
                                        <SelectItem value="u18">Under 18</SelectItem>
                                        <SelectItem value="u21">Under 21</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.location}
                                onValueChange={(value) =>
                                    setFilters((previous) => ({
                                        ...previous,
                                        location: value,
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="size-4" />
                                        <SelectValue placeholder="Location" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Location</SelectLabel>
                                        <SelectItem value="all-location">Location</SelectItem>
                                        <SelectItem value="mumbai">Mumbai</SelectItem>
                                        <SelectItem value="delhi">Delhi</SelectItem>
                                        <SelectItem value="goa">Goa</SelectItem>
                                        <SelectItem value="pune">Pune</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <Select
                                value={filters.club}
                                onValueChange={(value) =>
                                    setFilters((previous) => ({
                                        ...previous,
                                        club: value,
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <div className="flex items-center gap-2">
                                        <Star className="size-4" />
                                        <SelectValue placeholder="Club" />
                                    </div>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Club</SelectLabel>
                                        <SelectItem value="all-clubs">Club</SelectItem>
                                        <SelectItem value="mumbai-city">Mumbai City FC</SelectItem>
                                        <SelectItem value="goa-fc">FC Goa</SelectItem>
                                        <SelectItem value="mohun-bagan">Mohun Bagan</SelectItem>
                                        <SelectItem value="bengaluru-fc">Bengaluru FC</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                                    Rising Talent India
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Discover players getting noticed right now
                                </p>
                            </div>
                            <Link href="/">
                                <button
                                    type="button"
                                    className="shrink-0 cursor-pointer text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                                >
                                    View All
                                </button>
                            </Link>
                        </div>

                        {isLoading ? (
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                                Loading explore players...
                            </div>
                        ) : isError ? (
                            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-10 text-center text-sm text-red-600">
                                Unable to load explore data right now.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 xl:grid-cols-4">
                                {risingTalent.length > 0 ? (
                                    risingTalent.map((player) => (
                                        <button
                                            key={player.id}
                                            type="button"
                                            onClick={() => openVideoDialog(player)}
                                            className="relative overflow-hidden rounded-xl p-4 text-left text-white shadow-[0_18px_40px_rgba(37,99,235,0.18)]"
                                        >
                                            <div
                                                aria-hidden="true"
                                                className="absolute inset-0 bg-cover bg-center"
                                                style={{
                                                    backgroundImage: `url('${player.thumbnailUrl}')`,
                                                }}
                                            />

                                            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.80)_100%)]" />

                                            <div className="relative flex h-full min-h-56 flex-col justify-between">
                                                <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-900/35 px-3 py-1 text-xs backdrop-blur-sm">
                                                    <Sparkles size={13} />
                                                    Trending
                                                </div>

                                                <div>
                                                    <h3 className="font-semibold tracking-tight">
                                                        {player.playerName}
                                                    </h3>
                                                    <p className="mt-1 text-xs text-white/85">
                                                        {formatPosition(player.position)} •{" "}
                                                        {player.age}
                                                    </p>
                                                    <div className="mt-1 flex items-center gap-1 text-xs text-white/90">
                                                        <Eye className="size-4" />
                                                        {formatCount(player.stats.views)}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="col-span-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                                        No players found for these filters.
                                    </div>
                                )}
                            </div>
                        )}
                    </section>

                    <section className="mt-5 space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                                    Trending This Week
                                </h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Most watched players across the platform
                                </p>
                            </div>
                            <Link href="/">
                                <button
                                    type="button"
                                    className="shrink-0 cursor-pointer text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                                >
                                    View All
                                </button>
                            </Link>
                        </div>

                        {!isLoading && !isError && (
                            <div className="grid gap-2 lg:grid-cols-2">
                                {trending.length > 0 ? (
                                    trending.map((player) => (
                                        <button
                                            key={player.id}
                                            type="button"
                                            onClick={() => openVideoDialog(player)}
                                            className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <div className="inline-flex rounded-md bg-blue-500 px-3 py-1 text-xs tracking-wider text-white">
                                                        #{formatPosition(player.position)}
                                                    </div>
                                                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-900">
                                                        {player.playerName}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-slate-600">
                                                        {formatPosition(player.position)} •{" "}
                                                        {player.age}
                                                    </p>
                                                    <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                                                        <MapPin className="size-3.5" />
                                                        {player.location}
                                                    </div>
                                                    <div className="mt-4 flex items-center gap-1.5 text-sm text-slate-500">
                                                        <Eye className="size-4" />
                                                        {formatCount(player.stats.views)}
                                                    </div>
                                                </div>

                                                <div className="inline-flex items-center justify-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-xs font-semibold text-white">
                                                    <StarIcon
                                                        fill="#fdc700"
                                                        size={10}
                                                        className="text-yellow-400"
                                                    />
                                                    {player.score.toFixed(1)}
                                                </div>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="col-span-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                                        No trending players found right now.
                                    </div>
                                )}
                            </div>
                        )}
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
