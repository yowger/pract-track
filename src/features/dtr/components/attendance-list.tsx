import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Attendance, AttendanceSession } from "@/types/attendance"
import DataTable from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { firebaseTimestampToDate } from "@/lib/date-utils"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// interface FlattenedSession extends Omit<AttendanceSession, "schedule"> {
//     user: Attendance["user"]
//     attendanceSchedule: Attendance["schedule"]
//     sessionSchedule: AttendanceSession["schedule"]
//     overallStatus?: Attendance["overallStatus"]
// }

// function flattenAttendances(attendances: Attendance): FlattenedSession[] {
//     return attendances.flatMap((att) =>
//         att.sessions.map((session) => ({
//             ...session,
//             sessionSchedule: session.schedule,
//             attendanceSchedule: att.schedule,
//             user: att.user,
//             overallStatus: att.overallStatus,
//         }))
//     )
// }

const attendanceColumns: ColumnDef<AttendanceSession>[] = [
    {
        accessorKey: "timeRange",
        header: "Clock-in & Out",
        size: 50,
        cell: ({ row, column }) => {
            const { checkIn, checkOut, schedule } = row.original
            if (!checkIn && !checkOut) return "-"

            const formatTime = (d?: Date | null) =>
                d
                    ? d.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                      })
                    : "-"

            const scheduledStart = schedule?.start as Date
            const scheduledEnd = schedule?.end as Date
            const lateThresholdMins = schedule?.lateThresholdMins ?? 15
            const undertimeThresholdMins =
                schedule?.undertimeThresholdMins ?? 15

            const inDate = firebaseTimestampToDate(checkIn)
            const outDate = firebaseTimestampToDate(checkOut)

            let isLate = false
            let isUndertime = false

            if (checkIn && scheduledStart) {
                const thresholdStart = new Date(
                    scheduledStart.getTime() + lateThresholdMins * 60000
                )
                isLate = inDate! > thresholdStart
            }

            if (checkOut && scheduledEnd) {
                const thresholdEnd = new Date(
                    scheduledEnd.getTime() - undertimeThresholdMins * 60000
                )
                isUndertime = outDate! < thresholdEnd
            }

            return (
                <div
                    className="inline-flex items-center gap-2"
                    style={{ width: column.getSize() }}
                >
                    <span
                        className={`
                    ${checkIn ? "" : "text-muted-foreground"}
                    ${isLate ? "text-red-600 dark:text-red-700" : ""}
                `}
                    >
                        {formatTime(inDate)}
                    </span>
                    <span className="text-muted-foreground mx-1">→</span>
                    <span
                        className={`
                    ${checkOut ? "" : "text-muted-foreground"}
                    ${isUndertime ? "text-amber-600 dark:text-amber-700" : ""}
                `}
                    >
                        {formatTime(outDate)}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "overallTime",
        header: "Duration",
        cell: ({ row }) => {
            const checkIn = row.original.checkIn as Date
            const checkOut = row.original.checkOut as Date

            const mins =
                checkIn && checkOut
                    ? Math.floor((+checkOut - +checkIn) / 60000)
                    : 0
            const h = Math.floor(mins / 60)
            const m = mins % 60
            const duration = mins > 0 ? `${h}h ${m}m` : "-"

            return (
                <span className={mins > 0 ? "" : "text-muted-foreground"}>
                    {duration}
                </span>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const { status } = row.original

            const statuses = Array.isArray(status) ? status : [status]

            if (!statuses.length || !statuses[0]) return null

            const order = [
                "present",
                "late",
                "undertime",
                "overtime",
                "absent",
                "excused",
            ]

            const sortedStatuses = statuses.sort(
                (a, b) => order.indexOf(a || "") - order.indexOf(b || "")
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
                    {sortedStatuses.map((s, idx) =>
                        s ? (
                            <Badge key={idx} className={getBadgeColors(s)}>
                                {s}
                            </Badge>
                        ) : null
                    )}
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
    const sessions = attendances?.sessions

    return (
        <Card className="col-span-12 lg:col-span-8">
            <CardHeader className="flex justify-between items-center">
                <CardTitle>Today's summary</CardTitle>
                <Button
                    variant="link"
                    asChild
                    size="sm"
                    className="text-blue-600 dark:text-blue-700 text-xs"
                >
                    <Link to="#">
                        View History <ArrowUpRight />
                    </Link>
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
                    <DataTable
                        columns={attendanceColumns}
                        data={sessions || []}
                    />
                )}
            </CardContent>
        </Card>
    )
}
