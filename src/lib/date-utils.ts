import { format, formatDistanceToNow, parse } from "date-fns"
import type { FieldValue, Timestamp } from "firebase/firestore"

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

export function toDateSafe(
    value: Date | Timestamp | FieldValue | null
): Date | null {
    if (!value) return null
    if (value instanceof Date) return value
    if ((value as Timestamp).toDate) return (value as Timestamp).toDate()
    return null
}

export function formatDate(date: Date): string {
    return format(date, "MMM d, yyyy")
}

export function formatDateSafe(
    value: Date | Timestamp | FieldValue | null,
    dateFormat: string = "MMM d, yyyy"
): string {
    const date = toDateSafe(value)
    if (!date) return "—"
    return format(date, dateFormat)
}

export function formatTimeSafe(
    value: Date | Timestamp | FieldValue | null,
    timeFormat: string = "hh:mm a"
): string {
    const date = toDateSafe(value)
    if (!date) return "—"
    return format(date, timeFormat)
}

export function getRelativeTime(
    value: Date | Timestamp | FieldValue | null
): string {
    const date = toDateSafe(value)
    if (!date) return "N/A"

    const diff = Date.now() - date.getTime()
    if (diff < 0) return formatDate(date)
    if (diff < 1000 * 60 * 60 * 24 * 7) {
        return formatDistanceToNow(date, { addSuffix: true })
    }
    return formatDate(date)
}
