import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { WeeklySchedule, type DaySchedule } from "../components/weekly-schedule"

const daysOfWeek = [
    "Mondays",
    "Tuesdays",
    "Wednesdays",
    "Thursdays",
    "Fridays",
    "Saturdays",
    "Sundays",
]

export default function CreateSchedule() {
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

    const handleSubmit = () => {
        console.log("Final schedule:", schedule)
    }

    return (
        <div className="p-6 space-y-6">
            <h2 className="text-lg font-medium">Create new schedule</h2>

            <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex flex-col w-fit space-y-5">
                    <WeeklySchedule value={schedule} onChange={setSchedule} />

                    <div className="flex justify-end">
                        <Button onClick={handleSubmit}>Save Schedule</Button>
                    </div>
                    <ScrollBar orientation="horizontal" />
                </div>
            </ScrollArea>

            <h2 className="text-lg font-medium">Create new schedule</h2>
        </div>
    )
}
