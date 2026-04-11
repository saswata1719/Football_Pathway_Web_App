import Link from "next/link"
import { IoIosFootball } from "react-icons/io"

import { LoginForm } from "@/components/LoginForm"

export default function LoginPage() {
    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            <div className="flex flex-col gap-4 p-6 md:p-10">
                <div className="flex justify-center gap-2 md:justify-start">
                    <Link href="/" className="flex items-center gap-2 font-medium">
                        <div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <IoIosFootball className="size-4" />
                        </div>
                        Football Pathway
                    </Link>
                </div>
                <div className="flex flex-1 items-center justify-center">
                    <div className="w-full max-w-xs">
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden bg-muted lg:block">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-cover bg-center dark:brightness-[0.2] dark:grayscale"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1634176866089-b633f4aec882?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
                    }}
                />
            </div>
        </div>
    )
}
