import {
    Activity,
    BarChart3,
    Heart,
    MessageCircle,
    PlaySquare,
    TrendingUp,
    Video,
} from "lucide-react"

const summaryStats = [
    { label: "Total Views", value: "0", icon: PlaySquare },
    { label: "Total Likes", value: "0", icon: Heart },
    { label: "Comments", value: "0", icon: MessageCircle },
    { label: "Videos", value: "0", icon: Video },
]

const growthStats = [
    {
        label: "Views Growth",
        value: "+24%",
        width: "24%",
    },
    {
        label: "Engagement Growth",
        value: "+18%",
        width: "18%",
    },
    {
        label: "Follower Growth",
        value: "+32%",
        width: "32%",
    },
]

export default function PerformanceView() {
    return (
        <main className="min-h-svh bg-white px-4 pb-28 pt-5 sm:px-6">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
                <section className="overflow-hidden">
                    <div className="py-6">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                                    <BarChart3 className="size-3.5" />
                                    Performance
                                </div>
                                <h1 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
                                    Analytics Overview
                                </h1>
                                <p className="mt-2 max-w-lg text-sm md:leading-6 text-slate-600">
                                    Track your video reach, engagement, and momentum in one
                                    place with a clear view of how your profile is performing.
                                </p>
                            </div>
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
                                <Activity className="size-5" />
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
                            {summaryStats.map((stat) => {
                                const Icon = stat.icon

                                return (
                                    <div
                                        key={stat.label}
                                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-xs font-medium text-slate-500">
                                                {stat.label}
                                            </span>
                                            <div className="flex shrink-0 h-9 w-9 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
                                                <Icon className="size-4" />
                                            </div>
                                        </div>
                                        <p className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                                            {stat.value}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </section>

                {/* <section className="grid gap-4 md:grid-cols-2">
                    <article className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-700">
                                <TrendingUp className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                    Engagement Rate
                                </p>
                                <h2 className="mt-1 text-3xl font-semibold text-slate-900">
                                    0%
                                </h2>
                            </div>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-slate-600">
                            Calculated from likes and comments vs views
                        </p>
                    </article>

                    <article className="rounded-[1.6rem] border border-slate-200 bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-700">
                                <Trophy className="size-5" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                                    Hot Prospect Score
                                </p>
                                <h2 className="mt-1 text-3xl font-semibold text-slate-900">
                                    0
                                </h2>
                            </div>
                        </div>
                        <p className="mt-4 text-sm leading-6 text-slate-600">
                            Your trending score based on recent engagement
                        </p>
                    </article>
                </section> */}

                <section className="">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 border">
                            <TrendingUp className="size-5" />
                        </div>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                                Growth Trends
                            </p>
                            <h2 className=" text-xl font-semibold text-slate-900">
                                Recent Momentum
                            </h2>
                        </div>
                    </div>

                    <div className="mt-5 space-y-4">
                        {growthStats.map((item) => (
                            <div key={item.label} className="rounded-2xl bg-slate-50 p-4">
                                <div className="flex items-center justify-between gap-3">
                                    <p className="text-sm font-medium text-slate-700">
                                        {item.label}
                                    </p>
                                    <span className="text-sm font-semibold text-slate-900">
                                        {item.value}
                                    </span>
                                </div>
                                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-200">
                                    <div
                                        className="h-full rounded-full bg-blue-500"
                                        style={{ width: item.width }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
}
