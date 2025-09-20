import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { type UseFormReturn } from "react-hook-form"

import { saveSchedule } from "@/api/scheduler"
import { useUser } from "@/hooks/use-user"
import { isAgency } from "@/types/user"
import type { DaySchedule, Scheduler, WeekDay } from "@/types/scheduler"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { WeeklySchedule } from "../components/weekly-schedule"
import {
    ScheduleForm,
    type ScheduleFormValues,
} from "../components/schedule-form"
// import OverrideSchedule from "../components/override-schedule"

const daysOfWeek: WeekDay[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
]

export default function CreateSchedule() {
    const { user } = useUser()

    const navigate = useNavigate()

    const formRef = useRef<UseFormReturn<ScheduleFormValues>>(null)
    const [scheduleError, setScheduleError] = useState<string>("")
    const [isLoading, setIsLoading] = useState(false)
    const [schedule, setSchedule] = useState<DaySchedule[]>(
        daysOfWeek.map((day, idx) => ({
            day,
            available: idx < 5,
            sessions:
                idx < 5
                    ? [
                          {
                              start: "08:00",
                              end: "12:00",
                              photoStart: false,
                              photoEnd: false,
                          },
                          {
                              start: "13:00",
                              end: "17:00",
                              photoStart: false,
                              photoEnd: false,
                          },
                      ]
                    : [
                          {
                              start: "",
                              end: "",
                              photoStart: false,
                              photoEnd: false,
                          },
                          {
                              start: "",
                              end: "",
                              photoStart: false,
                              photoEnd: false,
                          },
                      ],
        }))
    )

    useEffect(() => {
        if (!scheduleError) return

        toast.error(scheduleError)
    }, [scheduleError])

    if (!user || !isAgency(user)) {
        return <div>Access Denied</div>
    }

    const handleSubmit = async (values: ScheduleFormValues) => {
        const hasValidWeeklySession = schedule.some((day) =>
            day.sessions.some(
                (session) => session.start && session.end && day.available
            )
        )

        if (!hasValidWeeklySession) {
            setScheduleError(
                "Please fill at least one session with start and end time."
            )

            return
        }

        setScheduleError("")
        setIsLoading(true)

        try {
            if (!user || !isAgency(user) || !user.companyData?.ownerId) {
                return
            }

            const scheduleData: Scheduler = {
                ...values,
                companyId: user.companyData.ownerId,
                weeklySchedule: schedule,
            }

            await saveSchedule({
                ...scheduleData,
            })

            navigate("/schedules")
        } catch (error) {
            toast.error("Failed to save schedule. Please try again.")
            console.error("Failed to save schedule:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleExternalSubmit = () => {
        if (formRef.current) {
            formRef.current.handleSubmit(handleSubmit)()
        }
    }

    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Create Schedule
                    </h1>
                    <p className="text-muted-foreground">
                        Set up a new schedule for your agency.
                    </p>
                </div>
            </div>

            <div className="grid auto-rows-auto grid-cols-12 gap-5">
                <div className="col-span-12 md:col-span-4">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Schedule Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScheduleForm
                                formRef={formRef}
                                onSubmit={handleSubmit}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-12 md:col-span-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly Schedule</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="w-full whitespace-nowrap mb-2">
                                <WeeklySchedule
                                    value={schedule}
                                    onChange={setSchedule}
                                />
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                            <div className="flex justify-end mt-4">
                                <Button
                                    onClick={handleExternalSubmit}
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? "Creating..."
                                        : "Create Schedule"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* <div>
                <TypographyH4 className="mb-2">Override Schedule</TypographyH4>

                <div className="w-[56ch] mb-4">
                    <TypographyP className="text-muted-foreground">
                        Here you can create a custom schedule for a specific
                        day. These will override the default schedule.
                    </TypographyP>
                </div>
            </div> */}

            {/* <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex flex-col w-fit space-y-5">
                    <OverrideSchedule />
                    <ScrollBar orientation="horizontal" />
                </div>
            </ScrollArea> */}
        </div>
    )
}
