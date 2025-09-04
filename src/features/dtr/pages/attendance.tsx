import { format } from "date-fns"
import { useEffect, useState } from "react"

import { useSchedule } from "@/api/hooks/use-fetch-schedule-by-id"
import { useServerTime } from "@/api/hooks/use-get-server-time"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/hooks/use-user"
import { isStudent } from "@/types/user"
import TimeTrackingCard from "../components/time-tracking-card"

export default function Attendance() {
    const { user } = useUser()
    const { serverTime } = useServerTime()
    const [isClockedIn, setIsClockedIn] = useState(false)
    const [isInRange, setIsInRange] = useState(true)
    const [currentTime, setCurrentTime] = useState(serverTime || new Date())

    const attendance =
        user && isStudent(user) ? user.studentData.assignedSchedule : null

    const { schedule } = useSchedule(attendance?.id, { enabled: !!attendance })

    const today = format(new Date(), "EEEE").toLowerCase()

    const todaysSchedule = schedule?.weeklySchedule.find((day) => {
        return day.day === today
    })

    const handleClockToggle = () => setIsClockedIn(!isClockedIn)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

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
                    time={currentTime}
                    isClockedIn={isClockedIn}
                    isInRange={isInRange}
                    onClockToggle={handleClockToggle}
                />

                <Card className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-4">
                    <CardHeader>
                        <CardTitle>Today's Summary</CardTitle>
                    </CardHeader>
                    <CardContent>your summary content here</CardContent>
                </Card>
            </div>
        </div>
    )
}
