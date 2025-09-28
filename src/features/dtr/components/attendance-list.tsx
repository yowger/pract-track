import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DataTable from "@/components/data-table"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { firebaseTimestampToDate, formatTime } from "@/lib/date-utils"
import type { Attendance, AttendanceSession } from "@/types/attendance"

const attendanceColumns: ColumnDef<AttendanceSession>[] = [
    {
        accessorKey: "timeRange",
        header: "Clock-in & Out",
        size: 50,
        cell: ({ row, column }) => {
            const { checkInInfo, checkOutInfo, schedule } = row.original

            if (!checkInInfo && !checkOutInfo) {
                return <span className="text-muted-foreground">-</span>
            }

            const scheduledStart = firebaseTimestampToDate(schedule?.start)
            const scheduledEnd = firebaseTimestampToDate(schedule?.end)
            const lateThresholdMins = schedule?.lateThresholdMins ?? 15
            const undertimeThresholdMins =
                schedule?.undertimeThresholdMins ?? 15

            const inDate = checkInInfo
                ? firebaseTimestampToDate(checkInInfo.time)
                : null
            const outDate = checkOutInfo
                ? firebaseTimestampToDate(checkOutInfo.time)
                : null

            const isLate =
                inDate && scheduledStart
                    ? inDate >
                      new Date(
                          scheduledStart.getTime() + lateThresholdMins * 60000
                      )
                    : false

            const isUndertime =
                outDate && scheduledEnd
                    ? outDate <
                      new Date(
                          scheduledEnd.getTime() -
                              undertimeThresholdMins * 60000
                      )
                    : false

            return (
                <div
                    className="inline-flex items-center gap-2"
                    style={{ width: column.getSize() }}
                >
                    <span
                        className={`${inDate ? "" : "text-muted-foreground"} ${
                            isLate ? "text-red-600 dark:text-red-700" : ""
                        }`}
                    >
                        {inDate ? formatTime(inDate) : ""}
                    </span>
                    {outDate && (
                        <span className="text-muted-foreground mx-1">-</span>
                    )}
                    <span
                        className={`${outDate ? "" : "text-muted-foreground"} ${
                            isUndertime
                                ? "text-amber-600 dark:text-amber-700"
                                : ""
                        }`}
                    >
                        {outDate ? formatTime(outDate) : ""}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "overallTime",
        header: "Duration",
        cell: ({ row }) => {
            const { checkInInfo, checkOutInfo } = row.original
            const checkIn = checkInInfo
                ? firebaseTimestampToDate(checkInInfo.time)
                : null
            const checkOut = checkOutInfo
                ? firebaseTimestampToDate(checkOutInfo.time)
                : null

            if (!checkIn || !checkOut)
                return <span className="text-muted-foreground"></span>

            const mins = Math.floor((+checkOut - +checkIn) / 60000)
            const h = Math.floor(mins / 60)
            const m = mins % 60
            return <span>{`${h}h ${m}m`}</span>
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const { checkInInfo, checkOutInfo } = row.original
            const statuses = [checkInInfo?.status, checkOutInfo?.status].filter(
                Boolean
            ) as string[]

            if (!statuses.length)
                return <span className="text-muted-foreground"></span>

            const order = [
                "present",
                "late",
                "undertime",
                "overtime",
                "absent",
                "excused",
            ]
            const sortedStatuses = statuses.sort(
                (a, b) => order.indexOf(a) - order.indexOf(b)
            )

            const getBadgeColors = (s: string) => {
                switch (s) {
                    case "present":
                        return "bg-green-600 dark:bg-green-700 text-white"
                    case "late":
                        return "bg-red-600 dark:bg-red-700 text-white"
                    case "absent":
                        return "bg-gray-600 dark:bg-gray-700 text-white"
                    case "undertime":
                        return "bg-amber-600 dark:bg-amber-700 text-white"
                    case "overtime":
                        return "bg-blue-600 dark:bg-blue-700 text-white"
                    case "excused":
                        return "bg-purple-600 dark:bg-purple-700 text-white"
                    default:
                        return "bg-gray-600 dark:bg-gray-700 text-white"
                }
            }

            return (
                <div className="flex flex-wrap gap-2">
                    {sortedStatuses.map((s, idx) => (
                        <Badge key={idx} className={getBadgeColors(s)}>
                            {s}
                        </Badge>
                    ))}
                </div>
            )
        },
    },
]

interface AttendanceListProps {
    attendances: Attendance | null
    loading: boolean
}

export function AttendanceList({ attendances, loading }: AttendanceListProps) {
    const sessions = attendances?.sessions ?? []

    return (
        <Card className="col-span-12 md:col-span-8">
            <CardHeader className="flex justify-between items-center">
                <CardTitle>Today's summary</CardTitle>
                <Button
                    variant="link"
                    asChild
                    size="sm"
                    className="text-blue-600 dark:text-blue-700 text-xs"
                >
                    <Link to="#">See all</Link>
                </Button>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex w-full gap-4">
                                <Skeleton className="h-5 w-[30%]" />
                                <Skeleton className="h-5 w-[30%]" />
                                <Skeleton className="h-5 w-[40%]" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <DataTable columns={attendanceColumns} data={sessions} />
                )}
            </CardContent>
        </Card>
    )
}
