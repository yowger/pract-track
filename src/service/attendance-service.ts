import type { Attendance, AttendanceSession } from "@/types/attendance"
import type { DaySchedule } from "@/types/scheduler"

export function getCurrentSession(data: {
    attendance: Attendance
    schedule: DaySchedule
    date?: Date
}): AttendanceSession | null {
    const { attendance, date: now = new Date(), schedule } = data

    if (!attendance) return null
    console.log("🚀 ~ getCurrentSession ~ schedule:", schedule)

    for (const session of attendance.sessions) {
        const hasSession = session.checkIn

        if (hasSession) return session

        if (session.schedule.start && session.schedule.end) {
            const scheduleStart =
                session.schedule.start instanceof Date
                    ? session.schedule.start
                    : session.schedule.start.toDate()

            const scheduleEnd =
                session.schedule.end instanceof Date
                    ? session.schedule.end
                    : session.schedule.end.toDate()

            const isInprogress =
                now >= scheduleStart && now <= scheduleEnd && !session.checkOut

            if (isInprogress) return session
        }
    }

    return null
}
