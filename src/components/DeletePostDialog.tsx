"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"

type DeletePostDialogProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    isPending?: boolean
}

export default function DeletePostDialog({
    open,
    onOpenChange,
    onConfirm,
    isPending = false,
}: DeletePostDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete this video?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will remove the video from your profile and delete all related likes
                        and comments.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onConfirm} disabled={isPending}>
                        {isPending ? <Spinner className="size-4" /> : "Delete"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
