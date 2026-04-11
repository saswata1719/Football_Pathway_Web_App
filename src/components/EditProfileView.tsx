import Link from "next/link"
import {
    ChevronLeft,
    ImagePlus,
    MapPin,
    ShieldCheck,
    Sparkles,
    UserRound,
} from "lucide-react"
import { RiVerifiedBadgeFill } from "react-icons/ri"

import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function EditProfileView() {
    return (
        <main className="min-h-svh bg-white px-4 pb-28 md:pt-9 pt-8 sm:px-6">
            <div className="mx-auto flex w-full max-w-2xl flex-col gap-2">
                <section className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/profile"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50"
                        >
                            <ChevronLeft className="size-4.5" />
                        </Link>
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Profile Settings
                            </p>
                            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                                Edit Profile
                            </h1>
                        </div>
                    </div>
                    <div className="inline-flex rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700">
                        Live Profile
                    </div>
                </section>

                <section className="rounded-xl border border-slate-200 mt-3 bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center">
                        <div
                            aria-hidden="true"
                            className="h-24 w-24 rounded-full border-4 border-white bg-cover bg-center shadow-[0_12px_30px_rgba(15,23,42,0.12)]"
                            style={{
                                backgroundImage:
                                    "url('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&auto=format&fit=crop&q=80')",
                            }}
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-semibold text-slate-900">
                                    Saswata Roy
                                </h2>
                                <RiVerifiedBadgeFill className="size-4 text-sky-500" />
                            </div>
                            <p className="mt-1 text-sm text-slate-500">
                                Update your image, basic details, and player profile information.
                            </p>
                        </div>
                        <label
                            htmlFor="profileImage"
                            className="inline-flex justify-center cursor-pointer items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
                        >
                            <ImagePlus className="size-4" />
                            Change Image
                            <input
                                id="profileImage"
                                type="file"
                                accept="image/*"
                                className="sr-only"
                            />
                        </label>
                    </div>
                </section>

                <section className="rounded-xl md:border md:border-slate-200 md:bg-white md:p-5 p-3 pt-5 md:shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
                    <form className="space-y-5">
                        <FieldGroup>
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                    Basic Information
                                </p>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Personal Details
                                </h2>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
                                    <Input id="fullName" type="text" defaultValue="Saswata Roy" />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="age">Age</FieldLabel>
                                    <Input id="age" type="number" defaultValue="27" />
                                </Field>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="position">Position</FieldLabel>
                                    <Select defaultValue="striker">
                                        <SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white">
                                            <SelectValue placeholder="Select position" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Position</SelectLabel>
                                                <SelectItem value="striker">Striker</SelectItem>
                                                <SelectItem value="midfielder">Midfielder</SelectItem>
                                                <SelectItem value="defender">Defender</SelectItem>
                                                <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
                                                <SelectItem value="winger">Winger</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="strongFoot">Strong Foot</FieldLabel>
                                    <Select defaultValue="right">
                                        <SelectTrigger className="h-10 w-full rounded-lg border-slate-200 bg-white">
                                            <SelectValue placeholder="Select strong foot" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Strong Foot</SelectLabel>
                                                <SelectItem value="left">Left</SelectItem>
                                                <SelectItem value="right">Right</SelectItem>
                                                <SelectItem value="both">Both</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="location">Location</FieldLabel>
                                    <div className="relative">
                                        <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            id="location"
                                            type="text"
                                            defaultValue="Mumbai, India"
                                            className="pl-9"
                                        />
                                    </div>
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="club">Club / Academy</FieldLabel>
                                    <div className="relative">
                                        <ShieldCheck className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            id="club"
                                            type="text"
                                            defaultValue="Rising Talent Academy"
                                            className="pl-9"
                                        />
                                    </div>
                                </Field>
                            </div>
                        </FieldGroup>

                        <FieldGroup>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Profile Bio
                                </p>
                                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                                    About You
                                </h2>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                                <textarea
                                    id="bio"
                                    rows={5}
                                    defaultValue="Aggressive forward with sharp movement in the box, strong finishing instincts, and a calm first touch under pressure."
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                />
                                <FieldDescription>
                                    Tell scouts and coaches what makes your game stand out.
                                </FieldDescription>
                            </Field>
                        </FieldGroup>

                        <FieldGroup>
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                    Preferences
                                </p>
                                <h2 className="mt-1 text-lg font-semibold text-slate-900">
                                    Profile Highlights
                                </h2>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Sparkles className="size-4" />
                                        <p className="text-sm font-semibold">Top Skill</p>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-600">Finishing</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <UserRound className="size-4" />
                                        <p className="text-sm font-semibold">Profile Type</p>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-600">Player Profile</p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <ShieldCheck className="size-4" />
                                        <p className="text-sm font-semibold">Verification</p>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-600">Verified</p>
                                </div>
                            </div>
                        </FieldGroup>

                        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                            <Button type="submit" className="">
                                Save Changes
                            </Button>
                            <Button asChild type="button" variant="outline" className="">
                                <Link href="/profile">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    )
}
