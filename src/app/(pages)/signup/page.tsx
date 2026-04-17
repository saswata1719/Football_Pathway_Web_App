import Link from "next/link"
import Image from "next/image"

import { SignupForm } from "@/components/SignupForm"

export default function SignupPage() {
    return (
        <main className="relative min-h-svh overflow-hidden bg-[#10261f]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(61,122,95,0.35),transparent_40%),linear-gradient(180deg,#173329_0%,#10261f_45%,#0c1915_100%)]" />
            <div className="animate-login-drift absolute left-1/2 top-14 h-40 w-40 -translate-x-1/2 rounded-full bg-[#ffcb11]/16 blur-3xl" />
            <div className="animate-login-float absolute right-[-2rem] top-24 h-32 w-32 rounded-full bg-emerald-300/10 blur-3xl" />
            <div
                aria-hidden="true"
                className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage:
                        "url('https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop')",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,18,14,0.28)_0%,rgba(7,18,14,0.84)_100%)]" />

            <div className="relative z-10 flex min-h-svh items-center justify-center p-4 py-12 sm:p-6">
                <div className="w-full animate-in fade-in-0 zoom-in-95 duration-700 md:max-w-md md:rounded-3xl md:border md:border-white/10 md:bg-white/[0.04] md:p-5 md:shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:backdrop-blur-xl sm:p-7">
                    <div className="mb-6 mt-4 animate-in fade-in-0 slide-in-from-top-3 duration-700 overflow-hidden rounded-none border border-white/12 bg-white/8 px-4 py-3 shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur-xl md:mt-0 md:rounded-2xl">
                        <div className="flex items-center justify-center gap-3 sm:gap-4">
                            {["/img1.jpeg", "/img2.jpeg", "/img3.jpeg"].map((src, index) => (
                                <div
                                    key={src}
                                    className="relative flex h-12 w-20 items-center justify-center rounded-xl border border-white/10 bg-white/8 px-2 py-1 backdrop-blur-md sm:h-14 sm:w-24"
                                >
                                    <Image
                                        src={src}
                                        alt={`Football Pathway logo ${index + 1}`}
                                        className="h-full w-full rounded-lg object-contain opacity-78"
                                        width={200}
                                        height={200}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8 flex animate-in fade-in-0 zoom-in-95 duration-700 justify-center">
                        <Link
                            href="/"
                            className="animate-login-float inline-flex items-center justify-center rounded-full border border-white/14 bg-white/12 px-6 py-3.5 text-sm font-medium text-white/90 shadow-[0_18px_44px_rgba(0,0,0,0.28)] backdrop-blur-xl"
                        >
                            <Image
                                src="/logo.png"
                                alt="Football Pathway"
                                width={260}
                                height={64}
                                className="h-12 w-auto object-contain sm:h-14"
                            />
                        </Link>
                    </div>

                    <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
                        <SignupForm />
                    </div>
                </div>
            </div>
        </main>
    )
}
