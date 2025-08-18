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
// import AttendanceHistory from "../components/attendance-history"
// import DataTableDemo from "../components/table-test"
import DataTable from "../../chair-person/components/tables/users/student-data-table"
import {
    type DTR,
    type ShiftEntry,
    getColumns,
} from "../components/tables/attendance-history/columns"
import { useEffect, useState } from "react"
import { DTRMap } from "../components/map"
import { GeoFenceMap } from "../components/geoFenceMap"
import { CheckCircle, CheckCircle2, CheckIcon, XCircle } from "lucide-react"
import { IconCheck, IconCheckbox, IconChecks } from "@tabler/icons-react"

const attendanceTimes = {
    morningIn: new Date("2025-08-13T08:00:00"),
    morningOut: new Date("2025-08-13T12:00:00"),
    afternoonIn: new Date("2025-08-13T13:00:00"),
    afternoonOut: new Date("2025-08-13T17:00:00"),
}

export async function getData(): Promise<DTR[]> {
    const data: DTR[] = Array.from({ length: 10 }).map((_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - i) // past 10 days

        const formatTime = (hour: number, minute: number) =>
            `${hour.toString().padStart(2, "0")}:${minute
                .toString()
                .padStart(2, "0")}`

        const entries: ShiftEntry[] = [
            {
                name: "Morning In",
                time: formatTime(
                    8 + Math.floor(Math.random() * 2),
                    Math.floor(Math.random() * 60)
                ),
            },
            {
                name: "Morning Out",
                time: formatTime(
                    11 + Math.floor(Math.random() * 2),
                    Math.floor(Math.random() * 60)
                ),
            },
            {
                name: "Afternoon In",
                time: formatTime(
                    13 + Math.floor(Math.random() * 2),
                    Math.floor(Math.random() * 60)
                ),
            },
            {
                name: "Afternoon Out",
                time: formatTime(
                    17 + Math.floor(Math.random() * 2),
                    Math.floor(Math.random() * 60)
                ),
            },
        ]

        return {
            date: date.toISOString().split("T")[0],
            entries,
        }
    })

    return data
}

export default function DtrPage() {
    const {
        serverDate,
        loading: isDateLoading,
        error: isDateError,
    } = useServerDate()
    const { permission, error, requestPermission } = useGeolocationPermission()

    const [data, setData] = useState<DTR[]>([])

    const columns = getColumns(data)

    useEffect(() => {
        getData().then(setData)
    }, [])

    const inZone = false

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

                    <CardContent className="">
                        <div className="flex gap-4">
                            <div className="w-2/3 space-y-4">
                                {permission !== "granted" && (
                                    <GpsStatus onEnable={requestPermission} />
                                )}
                                {error && (
                                    <p className="text-red-600 mt-2">{error}</p>
                                )}

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

                                <div>
                                    <LiveClock />
                                    <div className="text-muted-foreground text-sm">
                                        {isDateLoading && "Loading date..."}
                                        {isDateError && "Error loading date"}
                                        {serverDate &&
                                            format(
                                                serverDate,
                                                "EEEE, MMM d, yyyy"
                                            )}
                                    </div>
                                </div>

                                <StatusIndicator status="timedIn" />

                                <div className="flex gap-4">
                                    <Button variant="default" size="lg">
                                        Time In
                                    </Button>
                                    <Button variant="secondary" size="lg">
                                        Time Out
                                    </Button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 w-full md:w-1/3 overflow-hidden">
                                <div className="h-full rounded-lg relative border border-gray-200 dark:border-gray-700 overflow-hidden">
                                    <GeoFenceMap
                                        // yourLocation={}
                                        allowedRadius={100}
                                        agencyLocation={{
                                            lat: 6.748454,
                                            // lng: 125.35138,
                                            lng: 125.35038,
                                        }}
                                    />
                                </div>

                                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                    {inZone ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                            <span>Within allowed area</span>
                                        </>
                                    ) : (
                                        <>
                                            <XCircle className="w-4 h-4 text-red-500" />
                                            <span>Outside allowed area</span>
                                        </>
                                    )}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="px-4 lg:px-6">
                <DataTable data={data || []} columns={columns} />
            </div>
        </div>
    )
}
