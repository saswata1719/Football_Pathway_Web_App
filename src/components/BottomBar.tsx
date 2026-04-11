"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    BarChart3,
    Compass,
    House,
    Plus,
    UserRound,
} from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
    { href: "/", label: "Home", icon: House },
    { href: "/explore", label: "Explore", icon: Compass },
    { href: "/post", label: "Post", icon: Plus, featured: true },
    { href: "/performance", label: "Performance", icon: BarChart3 },
    { href: "/profile", label: "Profile", icon: UserRound },
]

export default function BottomBar() {
    const pathname = usePathname()

    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
            <nav className="pointer-events-auto flex w-full items-center justify-between md:rounded-t-[2rem] border-t border-slate-200/80 bg-white px-2 text-slate-700 shadow-[0_-10px_35px_rgba(15,23,42,0.14)] sm:px-6">
                {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive =
                        item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "group flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-center text-[11px] font-medium transition-all duration-200",
                                isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-700",
                                item.featured && "self-stretch"
                            )}
                        >
                            <span
                                className={cn(
                                    "flex items-center justify-center transition-all duration-200",
                                    item.featured
                                        ? "size-12 rounded-full bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 text-white shadow-[0_10px_22px_rgba(37,99,235,0.28)] group-hover:scale-105"
                                        : "size-10 rounded-full",
                                    isActive && !item.featured && "bg-blue-50 text-blue-600"
                                )}
                            >
                                <Icon className={cn(item.featured ? "size-6" : "size-5")} />
                            </span>
                            <span className="truncate md:block hidden">{item.label}</span>
                        </Link>
                    )
                })}
            </nav>
        </div>
    )
}
