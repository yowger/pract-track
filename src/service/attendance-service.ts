import { serverTimestamp } from "firebase/firestore"

import { updateAttendance } from "@/api/attendance"
import { firebaseTimestampToDate } from "@/lib/date-utils"
import type {
    Attendance,
    AttendanceSession,
    GeoLocation,
    StatusTypes,
} from "@/types/attendance"
import { DEFAULT_LATE_THRESHOLD } from "@/config/attendance-defaults"

export function formatTime(date: Date): string {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export async function reverseGeocode(coords?: GeoLocation): Promise<string> {
    if (!coords) return "Unknown address"

    try {
        const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${coords.lat}&lon=${coords.lng}&format=json`
        )

        if (!res.ok) throw new Error(res.statusText)
        const data = await res.json()
        return data.display_name ?? "Unknown address"
    } catch (err) {
        console.error("Reverse geocoding error:", err)

        return "Unknown address"
    }
}

export function isLate(params: {
    checkIn: Date | null
    scheduledStart: Date | null
    lateThresholdMins: number
    earlyClockInMins?: number
}): boolean {
    const {
        checkIn,
        scheduledStart,
        lateThresholdMins,
        earlyClockInMins = 0,
    } = params
    if (!checkIn || !scheduledStart) return false

    const earliestAllowed = new Date(
        scheduledStart.getTime() - earlyClockInMins * 60000
    )
    const latestAllowed = new Date(
        scheduledStart.getTime() + lateThresholdMins * 60000
    )

    if (checkIn < earliestAllowed) return false

    return checkIn > latestAllowed
}

export function isUndertime(params: {
    checkOut: Date | null
    scheduledEnd: Date | null
    undertimeThresholdMins: number
}): boolean {
    const { checkOut, scheduledEnd, undertimeThresholdMins } = params

    if (!checkOut || !scheduledEnd) return false

    const thresholdEnd = new Date(
        scheduledEnd.getTime() - undertimeThresholdMins * 60000
    )

    return checkOut < thresholdEnd
}

export function deriveSessionStatus(session: AttendanceSession): StatusTypes[] {
    const scheduledStart = firebaseTimestampToDate(session.schedule.start)
    const scheduledEnd = firebaseTimestampToDate(session.schedule.end)

    if (!scheduledStart || !scheduledEnd) return ["absent"]

    const statuses: StatusTypes[] = []

    if (session.checkIn) {
        const late = isLate({
            checkIn:
                session.checkIn instanceof Date
                    ? session.checkIn
                    : session.checkIn.toDate(),
            scheduledStart,
            lateThresholdMins: session.schedule.lateThresholdMins || 0,
            earlyClockInMins: session.schedule.earlyClockInMins,
        })
        statuses.push(late ? "late" : "present")
    } else {
        statuses.push("absent")
    }

    if (session.checkOut) {
        const undertime = isUndertime({
            checkOut:
                session.checkOut instanceof Date
                    ? session.checkOut
                    : session.checkOut.toDate(),
            scheduledEnd,
            undertimeThresholdMins:
                session.schedule.undertimeThresholdMins || 0,
        })
        if (undertime) statuses.push("undertime")
    }

    return statuses
}

export function deriveOverallStatus(
    sessions: AttendanceSession[]
): Attendance["overallStatus"] {
    const all = sessions.flatMap(deriveSessionStatus)

    if (all.includes("late")) return "late"
    if (all.includes("undertime")) return "undertime"
    if (all.includes("present")) return "present"
    return "absent"
}

export function getCurrentSession(data: {
    attendance: Attendance | null
    date?: Date
}): { session: AttendanceSession | null; reason?: string } {
    const { attendance, date: now = new Date() } = data
    if (!attendance) return { session: null, reason: "No attendance record." }

    for (const session of attendance.sessions) {
        if (!session.schedule.start || !session.schedule.end) continue

        const scheduleStart =
            session.schedule.start instanceof Date
                ? session.schedule.start
                : session.schedule.start.toDate()

        const scheduleEnd =
            session.schedule.end instanceof Date
                ? session.schedule.end
                : session.schedule.end.toDate()

        const earlyClockInMins =
            session.schedule.earlyClockInMins ?? DEFAULT_LATE_THRESHOLD
        const earliestClockIn = new Date(
            scheduleStart.getTime() - earlyClockInMins * 60000
        )

        if (session.checkIn && !session.checkOut && now > scheduleEnd) {
            return { session, reason: undefined }
        }

        if (now < earliestClockIn) {
            const reason = `You can clock in starting ${earliestClockIn.toLocaleTimeString(
                [],
                { hour: "2-digit", minute: "2-digit" }
            )} (official start: ${scheduleStart.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
            })})`

            return {
                session: null,
                reason,
            }
        }
    }

    return { session: null, reason: "No active session right now." }
}

export function calculateTotalMinutes(sessions: AttendanceSession[]): number {
    return sessions.reduce((total, s) => {
        if (s.checkIn && s.checkOut) {
            const inTime =
                s.checkIn instanceof Date ? s.checkIn : s.checkIn.toDate()
            const outTime =
                s.checkOut instanceof Date ? s.checkOut : s.checkOut.toDate()
            return (
                total +
                Math.floor((outTime.getTime() - inTime.getTime()) / 60000)
            )
        }

        return total
    }, 0)
}

export async function toggleClock(params: {
    attendance: Attendance
    date: Date
    geo: GeoLocation
}) {
    const { attendance, date: now, geo } = params

    const { session: currentSession, reason } = getCurrentSession({
        attendance,
        date: now,
    })
    if (!currentSession)
        throw new Error(reason || "No active session available")

    const userHasCheckedIn = currentSession.checkIn
    const userHasCheckedOut = currentSession.checkOut
    const address = await reverseGeocode(geo)

    const updatedSessions: AttendanceSession[] = attendance.sessions.map(
        (updatedSession) => {
            if (updatedSession !== currentSession) return updatedSession

            if (!userHasCheckedIn) {
                return {
                    ...updatedSession,
                    checkIn: now,
                    geoLocation: geo,
                    address,
                }
            }

            if (!userHasCheckedOut) {
                return {
                    ...updatedSession,
                    checkOut: now,
                    geoLocation: geo,
                    address,
                }
            }

            throw new Error("You have already completed this session.")
        }
    )

    const sessionsWithStatuses: AttendanceSession[] = updatedSessions.map(
        (session) => ({
            ...session,
            status: deriveSessionStatus(session),
        })
    )

    const totalWorkMinutes = calculateTotalMinutes(updatedSessions)
    const overallStatus = deriveOverallStatus(sessionsWithStatuses)

    const updatedAttendance: Attendance = {
        ...attendance,
        sessions: sessionsWithStatuses,
        totalWorkMinutes,
        overallStatus,
    }

    await updateAttendance(updatedAttendance.id, {
        sessions: updatedAttendance.sessions,
        totalWorkMinutes: updatedAttendance.totalWorkMinutes,
        overallStatus: updatedAttendance.overallStatus,
        updatedAt: serverTimestamp(),
    })

    return {
        updatedAttendance,
        updatedSessions: sessionsWithStatuses.find(
            (s) => s.id === currentSession.id
        ),
    }
}
