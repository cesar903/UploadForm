"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  return (
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full h-9 w-9 "
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={isDark ? "Mudar para modo claro" : "Mudar para modo escuro"}
    >
      {isDark ? (
        <Moon className="h-[1.2rem] w-[1.2rem] text-amber-400" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem] text-blue-900" />
      )}
    </Button>
  )
}