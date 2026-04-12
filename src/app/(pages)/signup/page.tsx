import Link from "next/link"
import { IoIosFootball } from "react-icons/io"

import { SignupForm } from "@/components/SignupForm"

export default function SignupPage() {
    return (
        <main className="relative min-h-svh overflow-hidden bg-[#10261f]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(61,122,95,0.35),transparent_40%),linear-gradient(180deg,#173329_0%,#10261f_45%,#0c1915_100%)]" />
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
                <div className="w-full md:max-w-md md:rounded-3xl md:border md:border-white/10 md:bg-white/[0.04] md:p-5 md:shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:backdrop-blur-xl sm:p-7">
                    <div className="mb-7 flex justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-4 py-2 text-sm font-medium text-white/90"
                        >
                            <div className="flex size-7 items-center justify-center rounded-full bg-[#ffcb11] text-[#1f1f12]">
                                <IoIosFootball className="size-4" />
                            </div>
                            Football Pathway
                        </Link>
                    </div>

                    <SignupForm />
                </div>
            </div>
        </main>
    )
}
