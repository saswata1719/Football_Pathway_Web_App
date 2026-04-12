import {
    CheckCircle2,
    Eye,
    Flame,
    Heart,
    Lightbulb,
    MessageCircle,
    TrendingUp,
    Video,
} from "lucide-react"

const summaryStats = [
    {
        label: "Total Views",
        value: "0",
        icon: Eye,
        cardClass: "bg-blue-500 text-white",
    },
    {
        label: "Total Likes",
        value: "0",
        icon: Heart,
        cardClass: "bg-red-500 text-white",
    },
    {
        label: "Comments",
        value: "0",
        icon: MessageCircle,
        cardClass: "bg-emerald-500 text-white",
    },
    {
        label: "Videos",
        value: "0",
        icon: Video,
        cardClass: "bg-amber-500 text-white",
    },
]

const growthStats = [
    {
        label: "Views Growth",
        value: "+24%",
    },
    {
        label: "Engagement Growth",
        value: "+18%",
    },
    {
        label: "Follower Growth",
        value: "+32%",
    },
]

const tips = [
    "Upload consistently to maintain visibility",
    "Add relevant tags to reach more scouts",
    "Engage with comments to boost your score",
]

export default function PerformanceView() {
    return (
        <main className="min-h-svh bg-white px-4 pb-28 pt-5 sm:px-6">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
                <section className="border-b border-slate-200 pb-5">
                    <h1 className="text-xl font-semibold tracking-tight text-slate-900 md:text-2xl">
                        Performance
                    </h1>
                </section>

                <section className="grid md:grid-cols-2 gap-2">
                    {summaryStats.map((stat) => {
                        const Icon = stat.icon

                        return (
                            <article
                                key={stat.label}
                                className={`rounded-xl px-6 py-9 shadow-[0_16px_40px_rgba(15,23,42,0.08)] ${stat.cardClass}`}
                            >
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/12">
                                        <Icon className="" size={19} />
                                    </div>
                                    <p className="mt-5 text-4xl font-medium tracking-tight">
                                        {stat.value}
                                    </p>
                                    <p className=" font-medium text-xs text-white/95 ">
                                        {stat.label}
                                    </p>
                                </div>
                            </article>
                        )
                    })}
                </section>

                <section className="grid gap-4">
                    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
                        <div className="flex items-center gap-3">
                            <TrendingUp className="size-5 text-blue-500" />
                            <h2 className="text-lg font-semibold text-slate-900 ">
                                Engagement Rate
                            </h2>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <p className="text-4xl font-medium tracking-tight text-blue-500">
                                0%
                            </p>
                        </div>

                        <div className="mt-8 h-2 overflow-hidden rounded-full bg-slate-200">
                            <div className="h-full w-0 rounded-full bg-blue-500" />
                        </div>

                        <p className="mt-5 text-center text-xs text-slate-500">
                            Calculated from likes and comments vs views
                        </p>
                    </article>

                    <article className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
                        <div className="flex items-center gap-3">
                            <Flame className="size-5 text-red-500" />
                            <h2 className="text-lg font-semibold text-slate-900 ">
                                Hot Prospect Score
                            </h2>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <div className="flex h-35 w-35 items-center justify-center rounded-full border-[6px] border-red-500 bg-red-50 text-5xl font-semibold text-red-500">
                                0
                            </div>
                        </div>

                        <p className="mt-6 text-center text-xs text-slate-500">
                            Your trending score based on recent engagement
                        </p>
                    </article>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="size-5 text-emerald-500" />
                        <h2 className="text-lg font-semibold text-slate-900">
                            Growth Trends
                        </h2>
                    </div>

                    <div className="mt-7 space-y-3">
                        {growthStats.map((item) => (
                            <div
                                key={item.label}
                                className="flex items-center justify-between gap-4"
                            >
                                <p className="text-base text-slate-900">{item.label}</p>
                                <div className="flex items-center gap-2 text-lg font-semibold text-emerald-500 ">
                                    <TrendingUp className="size-4 md:size-5" />
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.06)]">
                    <div className="flex items-center gap-3">
                        <Lightbulb className="size-5 text-amber-500" />
                        <h2 className="text-lg font-semibold text-slate-900">
                            Tips to Improve
                        </h2>
                    </div>

                    <div className="mt-7 space-y-3">
                        {tips.map((tip) => (
                            <div key={tip} className="flex items-center gap-2">
                                <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                                <p className="text-base text-slate-900">{tip}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    )
}
