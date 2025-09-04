import { useRef, useState } from "react"
import { type UseFormReturn } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

import { saveSchedule } from "@/api/scheduler"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { WeeklySchedule } from "../components/weekly-schedule"
import OverrideSchedule from "../components/override-schedule"
import {
    ScheduleForm,
    type ScheduleFormValues,
} from "../components/schedule-form"
import type { DaySchedule, Scheduler, WeekDay } from "@/types/scheduler"
import { TypographyH3, TypographyP } from "@/components/typography"
import { TypographyH4 } from "../../../components/typography"
import { useUser } from "@/hooks/use-user"
import { isAgency } from "@/types/user"

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
        <div className="p-6 space-y-6">
            <TypographyH3 className="mb-8">Create new schedule</TypographyH3>

            <div className="flex flex-col mb-8 w-fit">
                <TypographyH4 className="mb-4">Schedule Details</TypographyH4>

                <ScheduleForm formRef={formRef} onSubmit={handleSubmit} />
            </div>

            <div className="flex flex-col mb-8">
                <TypographyH4 className="mb-4">Weekly Schedule</TypographyH4>

                <ScrollArea className="w-full whitespace-nowrap mb-2">
                    <WeeklySchedule value={schedule} onChange={setSchedule} />
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {scheduleError && (
                    <p className="text-red-500 dark:text-red-400 text-sm mt-1">
                        {scheduleError}
                    </p>
                )}

                <div className="flex justify-end mt-4">
                    <Button onClick={handleExternalSubmit} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Schedule"}
                    </Button>
                </div>
            </div>

            <div>
                <TypographyH4 className="mb-2">Override Schedule</TypographyH4>

                <div className="w-[56ch] mb-4">
                    <TypographyP className="text-muted-foreground">
                        Here you can create a custom schedule for a specific
                        day. These will override the default schedule.
                    </TypographyP>
                </div>
            </div>

            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex flex-col w-fit space-y-5">
                    <OverrideSchedule />
                    <ScrollBar orientation="horizontal" />
                </div>
            </ScrollArea>
        </div>
    )
}
