import Link from "next/link"
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

export function SignupForm({
    className,
    ...props
}: React.ComponentProps<"form">) {
    return (
        <form className={cn("flex flex-col gap-6", className)} {...props}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-semibold">Create your account</h1>
                    <p className="text-xs text-balance text-muted-foreground">
                        Enter your details below to create your account
                    </p>
                </div>
                <Field>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input id="name" type="text" placeholder="John Doe" required />
                </Field>
                <Field>
                    <FieldLabel htmlFor="signup-email">Email</FieldLabel>
                    <Input
                        id="signup-email"
                        type="email"
                        placeholder="m@example.com"
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                    <Input
                        id="signup-password"
                        type="password"
                        placeholder="••••••••"
                        required
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                    <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        required
                    />
                </Field>
                <Field>
                    <Button type="submit">Create account</Button>
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
