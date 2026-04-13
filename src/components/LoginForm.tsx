"use client"

import { useState } from "react"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LockKeyhole, Mail } from "lucide-react"
import { CgGoogle } from "react-icons/cg"
import { toast } from "sonner"

import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"

type LoginFormState = {
    email: string
    password: string
}

const initialFormState: LoginFormState = {
    email: "",
    password: "",
}

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const router = useRouter()
    const [formData, setFormData] = useState<LoginFormState>(initialFormState)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isGoogleLoading, setIsGoogleLoading] = useState(false)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target

        setFormData((previous) => ({
            ...previous,
            [id]: value,
        }))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await axios.post("/api/login", formData)
            toast(response.data.message ?? "Login successful.")
            setFormData(initialFormState)
            router.push("/")
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast(error.response?.data?.message ?? "Unable to login right now.")
            } else {
                toast("Unable to login right now.")
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true)

        try {
            await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            })
        } catch {
            setIsGoogleLoading(false)
            toast("Unable to continue with Google right now.")
        }
    }

    return (
        <form
            className={cn("flex flex-col gap-5", className)}
            onSubmit={handleSubmit}
            {...props}
        >
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="max-w-xs text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
                    Show Your Game. Get Discovered.
                </h1>
                <p className="max-w-xs text-sm text-white/70">
                    Sign in to share clips, grow your profile and stay visible.
                </p>
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/65" />
                    <Input
                        id="email"
                        type="email"
                        placeholder="Email or Phone"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="h-13 rounded-2xl border-white/12 bg-white/10 pl-11 text-white placeholder:text-white/45 focus-visible:border-white/20 focus-visible:ring-white/10"
                    />
                </div>

                <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/65" />
                    <Input
                        id="password"
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="h-13 rounded-2xl border-white/12 bg-white/10 pl-11 text-white placeholder:text-white/45 focus-visible:border-white/20 focus-visible:ring-white/10"
                    />
                </div>
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className="h-13 rounded-2xl bg-[#ffcb11] text-base font-semibold text-[#1f1f12] hover:bg-[#f0bf0a]"
            >
                {isSubmitting ? <Spinner className="size-4 text-[#1f1f12]" /> : "Log In"}
            </Button>

            <Link
                href="/signup"
                className="flex h-13 items-center justify-center rounded-2xl border border-white/14 bg-transparent text-base font-semibold text-white transition-colors hover:bg-white/6"
            >
                Sign Up
            </Link>

            <div className="flex items-center gap-3 text-xs uppercase tracking-[0.24em] text-white/45">
                <div className="h-px flex-1 bg-white/10" />
                <span>Or</span>
                <div className="h-px flex-1 bg-white/10" />
            </div>

            <Button
                variant="outline"
                type="button"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
                className="h-13 rounded-2xl border-white/12 bg-white/10 text-base font-medium text-white hover:bg-white/14 hover:text-white"
            >
                {isGoogleLoading ? (
                    <Spinner className="size-4 text-white" />
                ) : (
                    <CgGoogle className="size-5" />
                )}
                {isGoogleLoading ? "Please wait..." : "Continue with Google"}
            </Button>

            <p className="pt-2 text-center text-sm text-white/50">Football Pathway</p>
        </form>
    )
}
