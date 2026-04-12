import { Spinner } from "@/components/ui/spinner"

export default function Loading() {
    return (
        <main className="flex min-h-svh flex-col items-center justify-center gap-3 bg-white px-4 text-slate-900">
            <Spinner className="size-6 text-slate-700" />
            <p className="text-sm font-medium text-slate-500">Loading</p>
        </main>
    )
}
