"use client"

import * as React from "react"

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

function AlertDialog(props: React.ComponentProps<typeof Dialog>) {
    return <Dialog {...props} />
}

function AlertDialogTrigger(props: React.ComponentProps<typeof DialogTrigger>) {
    return <DialogTrigger {...props} />
}

function AlertDialogContent(props: React.ComponentProps<typeof DialogContent>) {
    return (
        <DialogContent
            showCloseButton={false}
            className="z-[140] max-w-md rounded-[1.6rem] border border-slate-200 bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.28)]"
            {...props}
        />
    )
}

function AlertDialogHeader(props: React.ComponentProps<typeof DialogHeader>) {
    return <DialogHeader {...props} />
}

function AlertDialogFooter(props: React.ComponentProps<typeof DialogFooter>) {
    return (
        <DialogFooter
            className="-mx-0 -mb-0 border-t-0 bg-transparent p-0 pt-4 sm:justify-end"
            {...props}
        />
    )
}

function AlertDialogTitle(props: React.ComponentProps<typeof DialogTitle>) {
    return <DialogTitle {...props} />
}

function AlertDialogDescription(props: React.ComponentProps<typeof DialogDescription>) {
    return <DialogDescription {...props} />
}

function AlertDialogAction({
    className,
    ...props
}: React.ComponentProps<typeof Button>) {
    return (
        <Button variant="destructive" className={className} {...props} />
    )
}

function AlertDialogCancel({
    className,
    ...props
}: React.ComponentProps<typeof Button>) {
    return (
        <DialogClose asChild>
            <Button variant="outline" className={className} {...props} />
        </DialogClose>
    )
}

export {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
}
