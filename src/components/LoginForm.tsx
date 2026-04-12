"use client"

import { useState } from "react"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CgGoogle } from "react-icons/cg"
import { toast } from "sonner"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"
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

    return (
        <form
            className={cn("flex flex-col gap-6", className)}
            onSubmit={handleSubmit}
            {...props}
        >
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-semibold">Login to your account</h1>
                    <p className="text-xs text-balance text-muted-foreground">
                        Enter your email below to login to your account
                    </p>
                </div>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                        id="password"
                        type="password"
                        placeholder="........"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </Field>
                <Field>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner className="size-4" /> : "Login"}
                    </Button>
                </Field>
                <FieldSeparator>Or continue with</FieldSeparator>
                <Field>
                    <Button variant="outline" type="button">
                        <CgGoogle />
                        Login with Google
                    </Button>
                    <FieldDescription className="text-center !mt-2">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline underline-offset-4">
                            Sign up
                        </Link>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    )
}
