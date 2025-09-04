import { useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useUser } from "@/hooks/use-user"
import { isStudent } from "@/types/user"
import { useSchedule } from "@/api/hooks/use-fetch-schedule-by-id"
import { format, parse } from "date-fns"
import TimeTrackingCard from "../components/time-tracking-card"

export default function Attendance() {
    const { user } = useUser()

    const attendance =
        user && isStudent(user) ? user.studentData.assignedSchedule : null

    const [isClockedIn, setIsClockedIn] = useState(false)
    const [isInRange, setIsInRange] = useState(true)

    const { schedule } = useSchedule(attendance?.id, { enabled: !!attendance })

    const today = format(new Date(), "EEEE").toLowerCase()

    const todaysSchedule = schedule?.weeklySchedule.find((day) => {
        return day.day === today
    })

    const handleClockToggle = () => setIsClockedIn(!isClockedIn)

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
