import Wrapper from "@/app/Wrapper"

export default function ProfilePage() {
    return (
        <Wrapper>
            <main className="flex min-h-svh items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.18),_transparent_30%),linear-gradient(180deg,_#08111f_0%,_#04070d_100%)] px-6 pb-28 pt-8 text-white">
                <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/6 p-8 text-center shadow-[0_24px_60px_rgba(0,0,0,0.4)] backdrop-blur-xl">
                    <p className="text-sm uppercase tracking-[0.35em] text-white/45">
                        Profile
                    </p>
                    <h1 className="mt-4 text-3xl font-semibold">Player profile placeholder</h1>
                    <p className="mt-3 text-sm leading-6 text-white/70">
                        The profile tab is connected too, so we can shape this into
                        a full player bio and highlight archive next.
                    </p>
                </div>
            </main>
        </Wrapper>
    )
}
