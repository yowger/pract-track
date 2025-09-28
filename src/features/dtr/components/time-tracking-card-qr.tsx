import { format } from "date-fns"
import { MapPin } from "lucide-react"
import type { Timestamp } from "firebase/firestore"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
// import { cn } from "@/lib/utils"
import type { Attendance } from "@/types/attendance"

interface TimeTrackingCardProps {
    attendance: Attendance
    time: Date
    isClockedIn: boolean
    isInRange: boolean
    isDisabled?: boolean
    isLoading?: boolean
    onClockToggle: () => void
}

function toDate(value: Date | Timestamp): Date {
    return value instanceof Date ? value : value.toDate()
}

export default function TimeTrackingCardQr({
    attendance,
    time,
    isClockedIn,
    isInRange,
    // isDisabled = false,
    isLoading = false,
    onClockToggle,
}: TimeTrackingCardProps) {
    const formattedDate = format(time, "EEEE, MMM d yyyy")
    const formattedTime = time.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
    })
    const hasSessions = attendance?.sessions?.some(
        (schedule) => schedule.schedule.start && schedule.schedule.end
    )

    const sessionContent = hasSessions ? (
        attendance!.sessions.map((session, i) => {
            if (!session.schedule.start || !session.schedule.end) return null
            const startDate = toDate(session.schedule.start)
            const endDate = toDate(session.schedule.end)

            const startTime = format(startDate, "hh:mm a")
            const endTime = format(endDate, "hh:mm a")

            return (
                <div key={i} className="text-sm font-medium">
                    {startTime} – {endTime}
                </div>
            )
        })
    ) : (
        <div className="text-sm font-medium">No sessions today</div>
    )

    return (
        <Card className="col-span-12 md:col-span-4">
            <CardHeader className="flex items-center justify-between">
                <CardTitle>Time Tracking</CardTitle>

                {isLoading ? (
                    <Skeleton className="h-6 w-6 rounded-full" />
                ) : (
                    <Button
                        variant="outline"
                        size="icon"
                        className="cursor-pointer"
                    >
                        <MapPin className="h-5 w-5" />
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-4">
                    <div>
                        {isLoading ? (
                            <>
                                <Skeleton className="h-4 w-32 mb-1" />
                                <Skeleton className="h-12 w-40" />
                            </>
                        ) : (
                            <>
                                <div className="text-sm text-muted-foreground">
                                    {formattedDate}
                                </div>
                                <div className="text-4xl font-light font-mono">
                                    {formattedTime}
                                </div>
                            </>
                        )}
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        {isLoading ? (
                            <Skeleton className="h-4 w-24" />
                        ) : (
                            <p className="text-sm font-medium flex items-center">
                                <span
                                    className={`w-2 h-2 rounded-full mr-1.5 ${
                                        isClockedIn
                                            ? "bg-emerald-700"
                                            : "bg-red-800 dark:bg-red-700"
                                    }`}
                                />
                                {isClockedIn ? "Clocked In" : "Clocked Out"}
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Schedule
                            </p>
                        </div>
                        {isLoading ? (
                            <Skeleton className="h-24 w-full" />
                        ) : (
                            <div className="flex flex-col">
                                {sessionContent}
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Location verification
                            </p>
                        </div>
                        {isLoading ? (
                            <Skeleton className="h-4 w-24" />
                        ) : (
                            <div className="text-sm flex items-center font-medium">
                                <span
                                    className={`w-2 h-2 rounded-full mr-1.5 ${
                                        isInRange
                                            ? "bg-emerald-700"
                                            : "bg-red-800 dark:bg-red-700"
                                    }`}
                                />
                                {isInRange ? "In Range" : "Out of Range"}
                            </div>
                        )}
                    </div>

                    <div className="mt-2">
                        {isLoading ? (
                            <Skeleton className="h-10 w-full rounded-md" />
                        ) : (
                            <Button
                                className="w-full text-white bg-emerald-900 hover:bg-emerald-900"
                                // className={cn(
                                //     "w-full text-white",
                                //     isClockedIn
                                //         ? "bg-red-800 dark:bg-red-950 hover:bg-red-800 dark:hover:bg-red-950"
                                //         : "bg-emerald-900 hover:bg-emerald-900"
                                // )}
                                onClick={onClockToggle}
                                // disabled={isDisabled}
                            >
                                {/* {isClockedIn ? "Clock Out" : "Clock In"} */}
                                Clock in
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
