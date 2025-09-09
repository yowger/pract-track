import { parse } from "date-fns"
import type { Timestamp } from "firebase/firestore"

type ToDateInput = Date | Timestamp | number | string | null | undefined

export function firebaseTimestampToDate(value: ToDateInput): Date | null {
    if (!value) return null
    if (value instanceof Date) return value
    if ((value as Timestamp).toDate) return (value as Timestamp).toDate()
    if (typeof value === "number" || typeof value === "string") {
        return new Date(value)
    }
    return null
}

export function parseScheduleTime(timeStr: string, baseDate: Date): Date {
    return parse(timeStr, "HH:mm", baseDate)
}

export function formatTime(date: Date | null) {
    if (!date) return "-"

    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export function formatDate(date: Date | null) {
    if (!date) return "-"

    return date.toLocaleDateString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}
