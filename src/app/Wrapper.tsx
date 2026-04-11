import BottomBar from '@/components/BottomBar'
import React from 'react'

interface Props {
    children: React.ReactNode
}


export default function Wrapper({ children }: Props) {
    return (
        <div className="relative min-h-svh bg-[#050816] text-white">
            {children}
            <BottomBar />
        </div>
    )
}
