import { format, parse } from "date-fns"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import LiveClock from "../components/live-clock"

interface TimeTrackingCardProps {
    todaysSchedule?: { sessions: { start: string; end: string }[] }
    time: Date

    isClockedIn: boolean
    isInRange: boolean
    onClockToggle: () => void
}

export default function TimeTrackingCard({
    todaysSchedule,
    isClockedIn,
    isInRange,
    time,
    onClockToggle,
}: TimeTrackingCardProps) {
    const formattedDate = format(time, "EEEE, MMM d yyyy")
    const formattedTime = time.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    })

    const hasSessions = todaysSchedule && todaysSchedule.sessions.length > 0

    let sessionContent

    if (hasSessions) {
        sessionContent = todaysSchedule!.sessions.map((session, i) => {
            const startTime = format(
                parse(session.start, "HH:mm", new Date()),
                "hh:mm a"
            )
            const endTime = format(
                parse(session.end, "HH:mm", new Date()),
                "hh:mm a"
            )

            return (
                <div key={i} className="flex p-2">
                    <span className="text-sm">
                        {startTime} – {endTime}
                    </span>
                </div>
            )
        })
    } else {
        sessionContent = (
            <div className="text-sm text-muted-foreground">
                No sessions today
            </div>
        )
    }

    return (
        <Card className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-8">
            <CardHeader>
                <CardTitle>Time Tracking</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-5">
                    <div>
                        <div className="text-sm text-muted-foreground">
                            {formattedDate}
                        </div>
                        <div className="text-4xl font-light mb-2 font-mono">
                            {formattedTime}
                        </div>
                    </div>

                    <div>
                        <h2 className="font-bold mb-2">Status</h2>
                        <p className="text-sm">
                            {isClockedIn ? "Clocked In" : "Clocked Out"}
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-bold">Today’s Schedule</h2>
                            <Button
                                variant="link"
                                size="sm"
                                className="text-blue-600 dark:text-blue-700 text-xs"
                            >
                                View Schedule <ArrowUpRight />
                            </Button>
                        </div>

                        <div
                            className={
                                hasSessions ? "border rounded-md divide-y" : ""
                            }
                        >
                            {sessionContent}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-bold">Location verification</h2>
                            <Button
                                variant="link"
                                size="sm"
                                className="text-blue-600 dark:text-blue-700 text-xs"
                            >
                                View Map
                            </Button>
                        </div>
                        <p
                            className={`text-sm ${
                                isInRange ? "" : "text-muted-foreground"
                            }`}
                        >
                            {isInRange ? "In Range" : "Out of Range"}
                        </p>
                    </div>

                    <div className="mt-2">
                        {isClockedIn ? (
                            <Button
                                className="w-full bg-red-800 dark:bg-red-950 hover:bg-red-800 dark:hover:bg-red-950 text-white"
                                onClick={onClockToggle}
                            >
                                Clock Out
                            </Button>
                        ) : (
                            <Button
                                className="w-full bg-emerald-900 hover:bg-emerald-900 text-white"
                                onClick={onClockToggle}
                            >
                                Clock In
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
