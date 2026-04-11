import {
    Heart,
    MapPin,
    Settings,
} from "lucide-react"
import { RiVerifiedBadgeFill } from "react-icons/ri"

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
        duration: "00:24",
        image:
            "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: "2",
        title: "Press Break Run",
        plays: "18.9K",
        duration: "00:18",
        image:
            "https://images.unsplash.com/photo-1518604666860-9ed391f76460?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: "3",
        title: "Inside Channel Goal",
        plays: "15.4K",
        duration: "00:31",
        image:
            "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: "4",
        title: "Quick Turn Assist",
        plays: "12.7K",
        duration: "00:20",
        image:
            "https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: "5",
        title: "Counter Attack",
        plays: "10.3K",
        duration: "00:26",
        image:
            "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?q=80&w=800&auto=format&fit=crop",
    },
    {
        id: "6",
        title: "First Touch Control",
        plays: "9.6K",
        duration: "00:17",
        image:
            "https://images.unsplash.com/photo-1487466365202-1afdb86c764e?q=80&w=800&auto=format&fit=crop",
    },
]

export default function ProfileView() {
    return (
        <main className="min-h-svh bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] px-4 pb-28 md:pt-5 pt-3 sm:px-6">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
                <section className="overflow-hidden ">

                    <div className="relative  py-6">
                        <div className="flex items-end justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div
                                    aria-hidden="true"
                                    className="md:h-24 md:w-24 h-18 w-18 rounded-full border-4 border-white bg-cover bg-center"
                                    style={{
                                        backgroundImage:
                                            "url('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=80')",
                                    }}
                                />
                                <div className="pb-2">
                                    <div className="flex items-center gap-1.5">
                                        <h1 className="md:text-xl font-semibold tracking-tight text-slate-900">
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
                            <div className="flex items-end md:gap-10 gap-7 justify-between flex-col">
                                <Settings size={20} className="cursor-pointer hover:rotate-45 opacity-80 transition-all duration-300" />
                                <div className="rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                                    Profile
                                </div>
                            </div>
                        </div>

                        <p className="mt-4 text-sm md:leading-6 text-slate-600">
                            Aggressive forward with sharp movement in the box, strong
                            finishing instincts, and a calm first touch under pressure.
                            This profile is static for now and focused on the visual design.
                        </p>

                        <div className="mt-5 grid grid-cols-3 md:gap-3 gap-2">
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

                <section className="">
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

                    <div className="mt-4 grid md:grid-cols-3 grid-cols-2 gap-2.5">
                        {videoGrid.map((video) => (
                            <article
                                key={video.id}
                                className="group overflow-hidden rounded-xl bg-slate-100"
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
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
}
