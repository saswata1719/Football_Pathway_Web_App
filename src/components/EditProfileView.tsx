"use client"

import { useMemo, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    ChevronLeft,
    MapPin,
    ShieldCheck,
    Sparkles,
    UserRound,
} from "lucide-react"
import { RiVerifiedBadgeFill } from "react-icons/ri"
import { toast } from "sonner"

import FileUploadField from "@/components/FileUploadField"
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
import { Spinner } from "@/components/ui/spinner"
import { getProfile, updateProfile, type UpdateProfilePayload } from "@/lib/api/profile"

type ProfileFormState = UpdateProfilePayload

const initialFormState: ProfileFormState = {
    fullName: "",
    image: null,
    age: null,
    position: null,
    strongFoot: null,
    location: null,
    club: null,
    bio: "",
    topSkill: null,
}

function getProfileImageUrl(image: string | null | undefined, updatedAt?: string | Date) {
    if (!image) {
        return "/user_placeholder.jpg"
    }

    if (!updatedAt) {
        return image
    }

    const version = new Date(updatedAt).getTime()
    const separator = image.includes("?") ? "&" : "?"

    return `${image}${separator}v=${version}`
}

export default function EditProfileView() {
    const router = useRouter()
    const queryClient = useQueryClient()
    const [draftProfile, setDraftProfile] = useState<ProfileFormState | null>(null)
    const [isImageUploading, setIsImageUploading] = useState(false)

    const { data: profile, isLoading } = useQuery({
        queryKey: ["profile"],
        queryFn: () => getProfile(),
    })

    const profileFormData = useMemo<ProfileFormState>(() => {
        if (!profile) {
            return initialFormState
        }

        return {
            fullName: profile.fullName || "",
            image: profile.image || null,
            age: typeof profile.age === "number" ? profile.age : null,
            position: profile.position || null,
            strongFoot: profile.strongFoot || null,
            location: profile.location || null,
            club: profile.club || null,
            bio: profile.bio || "",
            topSkill: profile.topSkill || null,
        }
    }, [profile])

    const formData = draftProfile ?? profileFormData
    const profileImage =
        draftProfile?.image && draftProfile.image !== profile?.image
            ? draftProfile.image
            : getProfileImageUrl(formData.image, profile?.updatedAt)

    const { mutate, isPending } = useMutation({
        mutationFn: async (payload: UpdateProfilePayload) => {
            return updateProfile(payload)
        },
        onSuccess: async () => {
            toast.success("Profile updated successfully")
            await queryClient.invalidateQueries({ queryKey: ["profile"] })
            router.push("/profile")
        },
        onError: (error: Error) => {
            toast.error(error.message || "Something went wrong")
        },
    })

    const handleInputChange = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value } = event.target

        setDraftProfile((previous) => {
            const base = previous ?? profileFormData

            return {
                ...base,
                [id]:
                    id === "age"
                        ? value === ""
                            ? null
                            : Number(value)
                        : value,
            }
        })
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        mutate({
            ...formData,
            fullName: formData.fullName.trim(),
            location: formData.location?.trim() || null,
            club: formData.club?.trim() || null,
            bio: formData.bio?.trim() || "",
            topSkill: formData.topSkill?.trim() || null,
        })
    }

    if (isLoading) {
        return (
            <main className="flex min-h-svh items-center justify-center bg-white px-4 pb-28">
                <div className="flex flex-col items-center gap-3">
                    <Spinner className="size-6 text-slate-700" />
                    <p className="text-sm text-slate-500">Loading profile...</p>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-svh bg-white px-4 pb-28 pt-8 sm:px-6 md:pt-9">
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
                        Profile
                    </div>
                </section>

                <section className="mt-3 rounded-xl border border-slate-200 bg-white p-5 shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center">
                        <div
                            aria-hidden="true"
                            className="h-24 w-24 rounded-full border-4 border-white bg-cover bg-center shadow-[0_12px_30px_rgba(15,23,42,0.12)]"
                            style={{
                                backgroundImage: `url('${profileImage}')`,
                            }}
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-semibold text-slate-900">
                                    {formData.fullName || "Player"}
                                </h2>
                                {profile?.isVerified && (
                                    <RiVerifiedBadgeFill className="size-4 text-sky-500" />
                                )}
                            </div>
                            <p className="mt-1 text-sm text-slate-500">
                                Update your image and player details here.
                            </p>
                        </div>

                        <div className="w-full md:w-auto">
                            <FileUploadField
                                label="Profile Image"
                                folder="profiles"
                                accept="image/*"
                                kind="image"
                                value={formData.image}
                                onUploadingChange={setIsImageUploading}
                                onChange={(url) =>
                                    setDraftProfile((previous) => {
                                        const base = previous ?? profileFormData

                                        return {
                                            ...base,
                                            image: url,
                                        }
                                    })
                                }
                            />
                        </div>
                    </div>
                </section>

                <section className="rounded-xl p-3 pt-5 md:border md:border-slate-200 md:bg-white md:p-5 md:shadow-[0_14px_32px_rgba(15,23,42,0.05)]">
                    <form className="space-y-5" onSubmit={handleSubmit}>
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
                                    <Input
                                        id="fullName"
                                        type="text"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                    />
                                </Field>
                                <Field>
                                    <FieldLabel htmlFor="age">Age</FieldLabel>
                                    <Input
                                        id="age"
                                        type="number"
                                        value={formData.age ?? ""}
                                        onChange={handleInputChange}
                                    />
                                </Field>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="position">Position</FieldLabel>
                                    <Select
                                        value={formData.position ?? undefined}
                                        onValueChange={(value) =>
                                            setDraftProfile((previous) => {
                                                const base = previous ?? profileFormData

                                                return {
                                                    ...base,
                                                    position:
                                                        value as ProfileFormState["position"],
                                                }
                                            })
                                        }
                                    >
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
                                    <Select
                                        value={formData.strongFoot ?? undefined}
                                        onValueChange={(value) =>
                                            setDraftProfile((previous) => {
                                                const base = previous ?? profileFormData

                                                return {
                                                    ...base,
                                                    strongFoot:
                                                        value as ProfileFormState["strongFoot"],
                                                }
                                            })
                                        }
                                    >
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
                                            value={formData.location ?? ""}
                                            onChange={handleInputChange}
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
                                            value={formData.club ?? ""}
                                            onChange={handleInputChange}
                                            className="pl-9"
                                        />
                                    </div>
                                </Field>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <Field>
                                    <FieldLabel htmlFor="topSkill">Top Skill</FieldLabel>
                                    <Input
                                        id="topSkill"
                                        type="text"
                                        value={formData.topSkill ?? ""}
                                        onChange={handleInputChange}
                                    />
                                </Field>
                            </div>
                        </FieldGroup>

                        <FieldGroup>
                            <div>
                                <p className="mt-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                                    Profile Bio
                                </p>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    About You
                                </h2>
                            </div>

                            <Field>
                                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                                <textarea
                                    id="bio"
                                    rows={5}
                                    value={formData.bio ?? ""}
                                    onChange={handleInputChange}
                                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 outline-none transition-colors focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                                />
                                <FieldDescription>
                                    Tell scouts and coaches what makes your game stand out.
                                </FieldDescription>
                            </Field>
                        </FieldGroup>

                        <FieldGroup>
                            <div>
                                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                    Profile Highlights
                                </p>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Quick View
                                </h2>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <Sparkles className="size-4" />
                                        <p className="text-sm font-semibold">Top Skill</p>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-600">
                                        {formData.topSkill || "Add your top skill"}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <UserRound className="size-4" />
                                        <p className="text-sm font-semibold">Profile Type</p>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-600">
                                        {profile?.profileType || "Player Profile"}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                                    <div className="flex items-center gap-2 text-slate-700">
                                        <ShieldCheck className="size-4" />
                                        <p className="text-sm font-semibold">Verification</p>
                                    </div>
                                    <p className="mt-2 text-sm text-slate-600">
                                        {profile?.isVerified ? "Verified" : "Not verified"}
                                    </p>
                                </div>
                            </div>
                        </FieldGroup>

                        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                            <Button type="submit" disabled={isPending || isImageUploading}>
                                {isPending ? (
                                    <Spinner className="size-4" />
                                ) : isImageUploading ? (
                                    "Uploading image..."
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                            <Button asChild type="button" variant="outline">
                                <Link href="/profile">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </section>
            </div>
        </main>
    )
}
