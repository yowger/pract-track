import { format } from "date-fns"

import { useServerDate } from "@/api/use-server-date"
import LiveClock from "@/features/dtr/components/live-clock"
import { GpsStatus } from "@/features/dtr/components/gps-status"
import { StatusIndicator } from "@/features/dtr/components/status-indicator"
import { useGeolocationPermission } from "@/hooks/use-geolocation-permission"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TimePair } from "@/features/dtr/components/time-pair"

const attendanceTimes = {
    morningIn: new Date("2025-08-13T08:00:00"),
    morningOut: new Date("2025-08-13T12:00:00"),
    afternoonIn: new Date("2025-08-13T13:00:00"),
    afternoonOut: new Date("2025-08-13T17:00:00"),
}

export default function DtrPage() {
    const {
        serverDate,
        loading: isDateLoading,
        error: isDateError,
    } = useServerDate()
    const { permission, error, requestPermission } = useGeolocationPermission()

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="px-4 lg:px-6">
                <Card className="@container/card">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold tabular-nums @[250px]/card:text-2xl">
                            Daily Time Record
                        </CardTitle>
                        <CardDescription>
                            Log your attendance for today
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {permission !== "granted" && (
                            <GpsStatus onEnable={requestPermission} />
                        )}
                        {error && <p className="text-red-600 mt-2">{error}</p>}

                        <div>
                            <h3 className="mb-1">Attendance Summary</h3>

                            <TimePair
                                labelIn="Morning in"
                                timeIn={attendanceTimes.morningIn}
                                labelOut="Morning out"
                                timeOut={attendanceTimes.morningOut}
                            />
                            <TimePair
                                labelIn="Afternoon in"
                                timeIn={attendanceTimes.afternoonIn}
                                labelOut="Afternoon out"
                                timeOut={attendanceTimes.afternoonOut}
                            />
                        </div>

                        <StatusIndicator status="timedIn" />

                        <div>
                            <LiveClock />
                            <div className="text-muted-foreground text-sm">
                                {isDateLoading && "Loading date..."}
                                {isDateError && "Error loading date"}
                                {serverDate &&
                                    format(serverDate, "EEEE, MMM d, yyyy")}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <Button variant="default" size="lg">
                                Time In
                            </Button>
                            <Button variant="secondary" size="lg">
                                Time Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
