"use client"

import { useState } from "react"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CgGoogle } from "react-icons/cg"

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

type SignupFormState = {
    name: string
    email: string
    password: string
    confirmPassword: string
}

const initialFormState: SignupFormState = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
}

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const router = useRouter()
    const [formData, setFormData] = useState<SignupFormState>(initialFormState)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = event.target

        setFormData((previous) => ({
            ...previous,
            [id]: value,
        }))
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        setErrorMessage("")
        setSuccessMessage("")
        setIsSubmitting(true)

        try {
            const response = await axios.post("/api/signup", formData)

            setSuccessMessage(response.data.message ?? "Account created successfully.")
            setFormData(initialFormState)
            window.setTimeout(() => {
                router.push("/login")
            }, 800)
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setErrorMessage(
                    error.response?.data?.message ?? "Unable to create account right now."
                )
            } else {
                setErrorMessage("Unable to create account right now.")
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
                    <h1 className="text-2xl font-semibold">Create your account</h1>
                    <p className="text-xs text-balance text-muted-foreground">
                        Enter your details below to create your account
                    </p>
                </div>
                <Field>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </Field>
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
                    <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="........"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                    />
                </Field>

                {errorMessage && (
                    <p className="text-center text-sm font-medium text-red-500">
                        {errorMessage}
                    </p>
                )}

                {successMessage && (
                    <p className="text-center text-sm font-medium text-emerald-600">
                        {successMessage}
                    </p>
                )}

                <Field>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner className="size-4" /> : "Create account"}
                    </Button>
                </Field>
                <FieldSeparator>Or continue with</FieldSeparator>
                <Field>
                    <Button variant="outline" type="button">
                        <CgGoogle />
                        Sign up with Google
                    </Button>
                    <FieldDescription className="text-center !mt-2">
                        Already have an account?{" "}
                        <Link href="/login" className="underline underline-offset-4">
                            Login
                        </Link>
                    </FieldDescription>
                </Field>
            </FieldGroup>
        </form>
    )
}
