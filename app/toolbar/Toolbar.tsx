"use client"

import * as React from "react"
import { ModeToggle } from "@/components/mode-toggle"
import { Network } from "@/components/network"
import { TourButton } from "@/app/tourApp/components/TourButton"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

export function Toolbar() {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return <div className="h-10 w-32 sm:w-64 animate-pulse" />
    }

    return (
        <div className={cn(
            "flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5",
            "max-w-fit transition-all duration-300"
        )}>
            <div id="tour-help" className="flex items-center">
                <TourButton />
            </div>

            <Separator orientation="vertical" className="h-4 mx-0.5 sm:mx-1 opacity-50" />

            <div id="tour-theme" className="flex items-center hover:cursor-pointer">
                <ModeToggle />
            </div>

            <Separator orientation="vertical" className="h-4 mx-0.5 sm:mx-1 opacity-50" />

            <div id="tour-network" className="flex items-center">
                <Network />
            </div>
        </div>
    )
}