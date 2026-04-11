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
import Link from "next/link"

const risingTalent = [
    {
        id: "1",
        name: "Aarav Sharma",
        role: "Striker",
        age: "18",
        likes: "1.2K",
        image:
            "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=900&auto=format&fit=crop",
    },
    {
        id: "2",
        name: "Kabir Khan",
        role: "Winger",
        age: "17",
        likes: "1.5K",
        image:
            "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=900&auto=format&fit=crop",
    },
    {
        id: "3",
        name: "Vihaan Patel",
        role: "Midfielder",
        age: "18",
        likes: "980",
        image:
            "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=900&auto=format&fit=crop",
    },
    {
        id: "4",
        name: "Reyansh Mehta",
        role: "Defender",
        age: "19",
        likes: "1.1K",
        image:
            "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=900&auto=format&fit=crop",
    },
]

const trendingPlayers = [
    {
        id: "1",
        tag: "#Striker",
        name: "Arjun Verma",
        role: "Striker",
        age: "17",
        location: "Mumbai, India",
        views: "12.5K",
        score: "9.8",
    },
    {
        id: "2",
        tag: "#Winger",
        name: "Ibrahim Khan",
        role: "Winger",
        age: "18",
        location: "Delhi, India",
        views: "10.9K",
        score: "9.6",
    },
    {
        id: "3",
        tag: "#Midfielder",
        name: "Rudra Nair",
        role: "Midfielder",
        age: "17",
        location: "Goa, India",
        views: "9.7K",
        score: "9.4",
    },
    {
        id: "4",
        tag: "#Defender",
        name: "Dev Malhotra",
        role: "Defender",
        age: "19",
        location: "Pune, India",
        views: "11.1K",
        score: "9.7",
    },
]

export default function ExploreView() {
    return (
        <main className="min-h-svh bg-white px-4 pb-28 pt-8 sm:px-6">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-8">
                <section className="space-y-4">
                    <div className="flex flex-col gap-1 md:flex-row md:items-center">
                        <div className="relative flex-1">
                            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <Input
                                type="text"
                                placeholder="Search players, clubs or skills"
                                className="pl-9 "
                            />
                        </div>
                        <button
                            type="button"
                            className="md:inline-flex hidden h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition-colors hover:bg-slate-100"
                            aria-label="Open filters"
                        >
                            <Filter className="size-5" />
                        </button>
                    </div>

                    <div className="grid gap-2 md:grid-cols-4 grid-cols-2">
                        <Select defaultValue="all-position">
                            <SelectTrigger className="w-full ">
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

                        <Select defaultValue="all-age">
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

                        <Select defaultValue="all-location">
                            <SelectTrigger className=" w-full">
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

                        <Select defaultValue="all-skills">
                            <SelectTrigger className="w-full">
                                <div className="flex items-center gap-2">
                                    <Star className="size-4" />
                                    <SelectValue placeholder="Skill Type" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Skill Type</SelectLabel>
                                    <SelectItem value="all-skills">Skill Type</SelectItem>
                                    <SelectItem value="finishing">Finishing</SelectItem>
                                    <SelectItem value="dribbling">Dribbling</SelectItem>
                                    <SelectItem value="passing">Passing</SelectItem>
                                    <SelectItem value="defending">Defending</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="md:text-2xl text-xl font-semibold tracking-tight text-slate-900">
                                Rising Talent India
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Discover players getting noticed right now
                            </p>
                        </div>
                        <Link href={"/"}>
                            <button
                                type="button"
                                className="text-sm shrink-0 cursor-pointer font-medium text-blue-600 transition-colors hover:text-blue-700"
                            >
                                View All
                            </button>
                        </Link>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4 grid-cols-2">
                        {risingTalent.map((player) => (
                            <article
                                key={player.id}
                                className="relative overflow-hidden rounded-xl  p-4 text-white shadow-[0_18px_40px_rgba(37,99,235,0.18)]"
                            >
                                <div
                                    aria-hidden="true"
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: `url('${player.image}')` }}
                                />

                                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.80)_100%)]" />

                                <div className="relative flex h-full min-h-56 flex-col justify-between">
                                    <div className="inline-flex w-fit items-center gap-1.5 rounded-full bg-slate-900/35 px-3 py-1 text-xs  backdrop-blur-sm">
                                        <Sparkles size={13} />
                                        Trending
                                    </div>

                                    <div>
                                        <h3 className=" font-semibold tracking-tight">
                                            {player.name}
                                        </h3>
                                        <p className="mt-1 text-xs text-white/85">
                                            {player.role} • {player.age}
                                        </p>
                                        <div className="mt-1 flex items-center gap-1 text-xs text-white/90">
                                            <Eye className="size-4" />
                                            {player.likes}
                                        </div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="space-y-4 mt-5">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <h2 className="md:text-2xl text-xl font-semibold tracking-tight text-slate-900">
                                Trending This Week
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Most watched players across the platform
                            </p>
                        </div>
                        <Link href={"/"}>
                            <button
                                type="button"
                                className="text-sm font-medium shrink-0 cursor-pointer text-blue-600 transition-colors hover:text-blue-700"
                            >
                                View All
                            </button>
                        </Link>
                    </div>

                    <div className="grid gap-2 lg:grid-cols-2">
                        {trendingPlayers.map((player) => (
                            <article
                                key={player.id}
                                className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="inline-flex rounded-md bg-blue-500 px-3 py-1 text-xs tracking-wider text-white">
                                            {player.tag}
                                        </div>
                                        <h3 className="mt-4 text-xl font-semibold tracking-tight text-slate-900">
                                            {player.name}
                                        </h3>
                                        <p className="mt-1 text-sm text-slate-600">
                                            {player.role} • {player.age}
                                        </p>
                                        <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                                            <MapPin className="size-3.5" />
                                            {player.location}
                                        </div>
                                        <div className="mt-4 flex items-center gap-1.5 text-sm text-slate-500">
                                            <Eye className="size-4" />
                                            {player.views}
                                        </div>
                                    </div>

                                    <div className="inline-flex gap-1 py-0.5  items-center justify-center rounded-full bg-emerald-500 px-2 text-xs font-semibold text-white">
                                        <StarIcon fill="#fdc700" size={10} className="text-yellow-400" /> {player.score}
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
}
