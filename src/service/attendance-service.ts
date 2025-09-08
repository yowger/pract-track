import { serverTimestamp } from "firebase/firestore"

import { updateAttendance } from "@/api/attendance"
import { firebaseTimestampToDate } from "@/lib/date-utils"
import type {
    Attendance,
    AttendanceSession,
    GeoLocation,
} from "@/types/attendance"

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
}): boolean {
    const { checkIn, scheduledStart, lateThresholdMins } = params

    if (!checkIn || !scheduledStart) return false

    const thresholdStart = new Date(
        scheduledStart.getTime() + lateThresholdMins * 60000
    )

    return checkIn > thresholdStart
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

        const earlyClockInMins = session.schedule.earlyClockInMins ?? 0
        const earliestClockIn = new Date(
            scheduleStart.getTime() - earlyClockInMins * 60000
        )

        if (now >= earliestClockIn && now <= scheduleEnd) {
            return { session, reason: undefined }
        }

        if (now < earliestClockIn) {
            const reason = `You can clock in starting ${scheduleStart.toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit",
                }
            )} (earliest ${earliestClockIn.toLocaleTimeString([], {
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

    const scheduledStart = firebaseTimestampToDate(
        currentSession.schedule.start
    )
    const scheduledEnd = firebaseTimestampToDate(currentSession.schedule.end)

    const updatedSessions: AttendanceSession[] = attendance.sessions.map(
        (updatedSession) => {
            if (updatedSession !== currentSession) return updatedSession

            if (!userHasCheckedIn) {
                const checkIn = now
                const userIsLate = isLate({
                    checkIn,
                    lateThresholdMins:
                        updatedSession.schedule.lateThresholdMins || 0,
                    scheduledStart,
                })

                return {
                    ...updatedSession,
                    checkIn,
                    geoLocation: geo,
                    address,
                    status: userIsLate ? ["late"] : ["present"],
                }
            }

            if (!userHasCheckedOut) {
                const checkOut = now
                const userIsUndertime = isUndertime({
                    checkOut,
                    undertimeThresholdMins:
                        updatedSession.schedule.undertimeThresholdMins || 0,
                    scheduledEnd,
                })

                return {
                    ...updatedSession,
                    checkOut,
                    geoLocation: geo,
                    address,
                    status: userIsUndertime
                        ? [...(updatedSession.status || []), "undertime"]
                        : updatedSession.status,
                }
            }

            throw new Error("You have already completed this session.")
        }
    )

    const totalWorkMinutes = calculateTotalMinutes(updatedSessions)

    const allStatuses = updatedSessions.flatMap((s) => s.status || [])
    const overallStatus = allStatuses.includes("late")
        ? "late"
        : allStatuses.includes("present")
        ? "present"
        : "absent"

    const updatedAttendance: Attendance = {
        ...attendance,
        sessions: updatedSessions,
        totalWorkMinutes,
        overallStatus,
    }

    updateAttendance(updatedAttendance.id, {
        sessions: updatedAttendance.sessions,
        totalWorkMinutes: updatedAttendance.totalWorkMinutes,
        overallStatus: updatedAttendance.overallStatus,
        updatedAt: serverTimestamp(),
    })

    return {
        updatedAttendance,
        updatedSessions: updatedSessions.find(
            (s) => s.id === currentSession.id
        ),
    }
}

// if (!userHasCheckedIn) {
//     session.checkIn = now
//     session.geoLocation = geo
//     session.address = address

//     const userIsLate = isLate({
//         checkIn: session.checkIn,
//         lateThresholdMins: session.schedule.lateThresholdMins || 0,
//         scheduledStart,
//     })

//     session.status = userIsLate ? ["late"] : ["present"]
// } else if (!userHasCheckedOut) {
//     session.checkOut = now
//     session.geoLocation = geo
//     session.address = address

//     const userIsUndertime = isUndertime({
//         checkOut: session.checkOut,
//         undertimeThresholdMins:
//             session.schedule.undertimeThresholdMins || 0,
//         scheduledEnd,
//     })

//     session.status = userIsUndertime
//         ? [...(session.status || []), "undertime"]
//         : session.status
// } else {
//     throw new Error("You have already completed this session.")
// }
