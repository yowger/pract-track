import { endOfDay, format, startOfDay } from "date-fns"
import { useEffect, useState } from "react"

import { useSchedule } from "@/api/hooks/use-fetch-schedule-by-id"
import { useServerTime } from "@/api/hooks/use-get-server-time"
import { useAttendances } from "@/api/hooks/use-fetch-attendance"
import { saveAttendance } from "@/api/attendance"
import TimeTrackingCard from "../components/time-tracking-card"
import { AttendanceList } from "../components/attendance-list"
import { useUser } from "@/hooks/use-user"
import { isStudent } from "@/types/user"
import { firebaseTimestampToDate, parseScheduleTime } from "@/lib/date-utils"
import type { Attendance } from "@/types/attendance"
import type { Session } from "@/types/scheduler"

function getCurrentOrNextSession(
    sessions: Session[],
    now: Date
): Session | undefined {
    if (!sessions || sessions.length === 0) return undefined

    const inProgress = sessions.find(
        (s) =>
            now >= firebaseTimestampToDate(s.start)! &&
            now <= firebaseTimestampToDate(s.end)!
    )

    if (inProgress) return inProgress

    const upcoming = sessions.find(
        (s) => now < firebaseTimestampToDate(s.start)!
    )
    if (upcoming) return upcoming

    return sessions[sessions.length - 1]
}

export default function Attendance() {
    const { user } = useUser()
    const { serverTime } = useServerTime()
    const [attendanceRecord, setAttendanceRecord] = useState<Attendance | null>(
        null
    )
    const [currentTime, setCurrentTime] = useState(serverTime || null)

    const attendance =
        user && isStudent(user) ? user.studentData.assignedSchedule : null

    const { schedule, loading: isScheduleLoading } = useSchedule(
        attendance?.id,
        { enabled: !!attendance }
    )
    const { data: attendanceList, loading: isAttendancesLoading } =
        useAttendances(
            serverTime && user?.uid
                ? {
                      userId: user.uid,
                      from: startOfDay(serverTime),
                      to: endOfDay(serverTime),
                  }
                : {},
            { enabled: !!serverTime && !!user?.uid }
        )

    const [isClockedIn, setIsClockedIn] = useState(false)

    const today = format(new Date(), "EEEE").toLowerCase()
    const todaysSchedule = schedule?.weeklySchedule.find(
        (day) => day.day === today
    )
    const hasSession = todaysSchedule?.sessions.some((s) => s.start && s.end)

    const isInRange = true
    // const isClockedIn = false

    async function handleClockToggle() {
        if (
            !user ||
            !todaysSchedule ||
            !schedule ||
            !currentTime ||
            !hasSession
        )
            return

        const todaysDate = serverTime || new Date()

        const currentSessions = getCurrentOrNextSession(
            todaysSchedule.sessions,
            todaysDate
        )

        if (!currentSessions) return

        if (!attendanceRecord) {
            const sessionStart =
                typeof currentSessions?.start === "string"
                    ? parseScheduleTime(currentSessions.start, todaysDate)
                    : firebaseTimestampToDate(currentSessions.start!)

            const sessionEnd =
                typeof currentSessions?.end === "string"
                    ? parseScheduleTime(currentSessions.end, todaysDate)
                    : firebaseTimestampToDate(currentSessions.end!)

            const newAttendance: Omit<
                Attendance,
                "id" | "createdAt" | "updatedAt"
            > = {
                schedule: {
                    id: schedule.id,
                    name: schedule.scheduleName,
                    date: todaysDate,
                },
                user: {
                    id: user.uid,
                    name: user.firstName + " " + user.lastName,
                    photoUrl: user.photoUrl || "",
                },
                sessions: [
                    {
                        schedule: {
                            start: sessionStart!,
                            end: sessionEnd!,
                            photoStart: currentSessions.photoStart,
                            photoEnd: currentSessions.photoEnd,
                        },
                        checkIn: currentTime,
                        status: "present",
                        // checkOut: null,
                        // remarks: null,
                        // geoLocation: null,
                        // photoUrl: null,
                    },
                ],
                markedBy: "self",
            }

            const result = await saveAttendance(newAttendance)
            console.log("🚀 ~ handleClockToggle ~ result:", result)
        }
    }

    useEffect(() => {
        const todayAttendance = attendanceList?.[0] || null
        const clockedIn = !!todayAttendance?.sessions?.some(
            (s) => s.checkIn && !s.checkOut
        )
        setIsClockedIn(clockedIn)
    }, [attendanceList])

    useEffect(() => {
        if (!serverTime) return

        const offset = serverTime.getTime() - Date.now()

        const timer = setInterval(() => {
            setCurrentTime(new Date(Date.now() + offset))
        }, 1000)

        return () => clearInterval(timer)
    }, [serverTime])

    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Attendance
                    </h1>
                    <p className="text-muted-foreground">
                        Track your clock-ins and clock-outs, and monitor your
                        daily schedule.
                    </p>
                </div>
            </div>

            <div className="grid auto-rows-auto grid-cols-12 gap-5">
                <TimeTrackingCard
                    todaysSchedule={todaysSchedule}
                    time={currentTime || new Date()}
                    isClockedIn={isClockedIn}
                    isInRange={isInRange}
                    onClockToggle={handleClockToggle}
                    isDisabled={!todaysSchedule || !isInRange || !hasSession}
                    isLoading={!currentTime}
                />

                <AttendanceList attendances={attendanceList || []} />
            </div>
        </div>
    )
}
