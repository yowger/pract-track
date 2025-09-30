import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function capitalize(word?: string) {
    if (!word) return ""
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
}

export function capitalizeWords(name: string | undefined | null): string {
    if (!name) return ""
    return name
        .split(" ")
        .map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ")
}
