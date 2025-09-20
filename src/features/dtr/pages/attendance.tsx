import { format } from "date-fns"
import { useEffect, useState } from "react"
import { useGeolocated } from "react-geolocated"
import { toast } from "sonner"

import { useSchedule } from "@/api/hooks/use-fetch-schedule-by-id"
import { useServerTime } from "@/api/hooks/use-get-server-time"
import { useGetOrCreateAttendance } from "@/api/hooks/use-get-or-create-attendance"
import { useCreateAttendance } from "@/api/hooks/use-create-attendance"
import TimeTrackingCard from "../components/time-tracking-card"
import { AttendanceList } from "../components/attendance-list"
import { useUser } from "@/hooks/use-user"
import { isStudent } from "@/types/user"
import type { Attendance } from "@/types/attendance"

export default function Attendance() {
    const { user } = useUser()
    const { serverTime } = useServerTime()

    const [currentTime, setCurrentTime] = useState(serverTime || null)
    const [isClockedIn] = useState(false)
    // console.log("🚀 ~ Attendance ~ setIsClockedIn:", setIsClockedIn)
    const isInRange = true

    const { coords } = useGeolocated({
        positionOptions: { enableHighAccuracy: false },
        userDecisionTimeout: 5000,
    })

    const today = format(new Date(), "EEEE").toLowerCase()
    const attendance =
        user && isStudent(user) ? user.studentData.assignedSchedule : null
    const { schedule, loading: loadingSchedule } = useSchedule(attendance?.id, {
        enabled: !!attendance,
    })
    const todaysSchedule = schedule?.weeklySchedule.find(
        (day) => day.day === today
    )
    const hasSession = todaysSchedule?.sessions.some((s) => s.start && s.end)
    const hasData = !!user && !!serverTime && !loadingSchedule

    const {
        attendance: attendanceList,
        loading: loadingAttendance,
        refetch: refetchAttendance,
    } = useGetOrCreateAttendance(
        {
            user: {
                id: user?.uid || "",
                name: user?.displayName || "",
                photoUrl: user?.photoUrl || "",
            },
            scheduler: schedule || undefined,

            today: serverTime || undefined,
        },
        {
            enabled: hasData,
        }
    )

    const {
        loading: loadingCreateAttendance,
        error: errorCreateAttendance,
        handleToggleClock,
    } = useCreateAttendance()

    useEffect(() => {
        if (errorCreateAttendance) toast.error(errorCreateAttendance)
    }, [errorCreateAttendance])

    async function handleClockToggle() {
        if (
            !user ||
            !todaysSchedule ||
            !schedule ||
            !currentTime ||
            !hasSession ||
            !coords
        )
            return

        if (!attendanceList) {
            return toast.error("You are not assigned to any schedule")
        }

        await handleToggleClock({
            attendance: attendanceList,
            date: serverTime || new Date(),
            geo: {
                lat: coords.latitude,
                lng: coords.longitude,
            },
        })

        refetchAttendance()
    }

    useEffect(() => {
        if (!serverTime) return
        const offset = serverTime.getTime() - Date.now()
        const timer = setInterval(
            () => setCurrentTime(new Date(Date.now() + offset)),
            1000
        )

        return () => clearInterval(timer)
    }, [serverTime])

    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col items-start justify-between space-y-2 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Clock-in & Out
                    </h1>
                    <p className="text-muted-foreground">
                        Manage your work sessions and track your daily schedule.
                    </p>
                </div>
            </div>

            <div className="grid auto-rows-auto grid-cols-12 gap-5">
                <TimeTrackingCard
                    attendance={attendanceList!}
                    time={currentTime || new Date()}
                    isClockedIn={isClockedIn}
                    isInRange={isInRange}
                    onClockToggle={handleClockToggle}
                    isLoading={!hasData}
                    isDisabled={
                        !attendanceList ||
                        !isInRange ||
                        !hasSession ||
                        loadingAttendance ||
                        loadingCreateAttendance
                    }
                />

                <AttendanceList
                    attendances={attendanceList}
                    loading={!hasData}
                />
            </div>
        </div>
    )
}
