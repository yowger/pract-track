import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "./theme/use-theme"

export function ModeToggle() {
    const { theme, setTheme } = useTheme()

    const toggleTheme = () => {
        const isSystemDark = window.matchMedia(
            "(prefers-color-scheme: dark)"
        ).matches

        if (theme === "system") {
            setTheme(isSystemDark ? "light" : "dark")
        } else {
            setTheme(theme === "dark" ? "light" : "dark")
        }
    }

    return (
        <Button variant="outline" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] transition-all dark:hidden" />
            <Moon className="hidden h-[1.2rem] w-[1.2rem] dark:block transition-all" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}
