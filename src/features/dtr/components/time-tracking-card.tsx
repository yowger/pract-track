import { format, parse } from "date-fns"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

interface TimeTrackingCardProps {
    todaysSchedule?: { sessions: { start: string; end: string }[] }
    time: Date
    isClockedIn: boolean
    isInRange: boolean
    isDisabled?: boolean
    isLoading?: boolean
    onClockToggle: () => void
}

export default function TimeTrackingCard({
    todaysSchedule,
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

    const hasSessions = todaysSchedule?.sessions?.some((s) => s.start && s.end)

    const sessionContent = hasSessions ? (
        todaysSchedule!.sessions.map((session, i) => {
            if (!session.start || !session.end) return null
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
    ) : (
        <div className="text-sm text-muted-foreground">No sessions today</div>
    )

    return (
        <Card className="col-span-12 md:col-span-6 lg:col-span-6 xl:col-span-8">
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
                                    size="sm"
                                    className="text-blue-600 dark:text-blue-700 text-xs"
                                >
                                    View Schedule <ArrowUpRight />
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
