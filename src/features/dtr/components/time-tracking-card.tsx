import { format } from "date-fns"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import type { Attendance } from "@/types/attendance"
import type { Timestamp } from "firebase/firestore"

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

export default function TimeTrackingCard({
    attendance,
    time,
    isClockedIn,
    isInRange,
    isDisabled = false,
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
                <div key={i} className="flex p-2">
                    <span className="text-sm">
                        {startTime} – {endTime}
                    </span>
                </div>
            )
        })
    ) : (
        <div className="text-sm text-muted-foreground">No sessions today</div>
    )

    return (
        <Card className="col-span-12 lg:col-span-4">
            <CardHeader>
                <CardTitle>Time Tracking</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-5">
                    {/* Date & Time */}
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
                                <div className="text-4xl font-light mb-2 font-mono">
                                    {formattedTime}
                                </div>
                            </>
                        )}
                    </div>

                    <div>
                        <h2 className="font-bold mb-2">Status</h2>
                        {isLoading ? (
                            <Skeleton className="h-4 w-24" />
                        ) : (
                            <p className="text-sm flex items-center">
                                <span
                                    className={`w-2 h-2 rounded-full mr-2 ${
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
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-bold">Today’s Schedule</h2>
                            {isLoading ? (
                                <Skeleton className="h-6 w-20" />
                            ) : (
                                <Button
                                    variant="link"
                                    asChild
                                    size="sm"
                                    className="text-blue-600 dark:text-blue-700 text-xs"
                                >
                                    <Link to="#">
                                        View Schedule <ArrowUpRight />
                                    </Link>
                                </Button>
                            )}
                        </div>
                        {isLoading ? (
                            <Skeleton className="h-24 w-full" />
                        ) : (
                            <div
                                className={
                                    hasSessions
                                        ? "border rounded-md divide-y"
                                        : ""
                                }
                            >
                                {sessionContent}
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-bold">Location verification</h2>
                            {isLoading ? (
                                <Skeleton className="h-6 w-20" />
                            ) : (
                                <Button
                                    variant="link"
                                    size="sm"
                                    className="text-blue-600 dark:text-blue-700 text-xs"
                                >
                                    View Map
                                </Button>
                            )}
                        </div>
                        {isLoading ? (
                            <Skeleton className="h-4 w-24" />
                        ) : (
                            <div className="text-sm flex items-center">
                                <span
                                    className={`w-2 h-2 rounded-full mr-2 ${
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
                                className={cn(
                                    "w-full text-white",
                                    isClockedIn
                                        ? "bg-red-800 dark:bg-red-950 hover:bg-red-800 dark:hover:bg-red-950"
                                        : "bg-emerald-900 hover:bg-emerald-900"
                                )}
                                onClick={onClockToggle}
                                disabled={isDisabled}
                            >
                                {isClockedIn ? "Clock Out" : "Clock In"}
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
