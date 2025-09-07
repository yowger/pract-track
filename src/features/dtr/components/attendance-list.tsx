import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import type { Attendance, AttendanceSession } from "@/types/attendance"
import DataTable from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { firebaseTimestampToDate } from "@/lib/date-utils"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const mockAttendances: Attendance[] = [
    // --- On-time Morning + Afternoon ---
    {
        id: "1",
        schedule: {
            id: "sched1",
            name: "Morning + Afternoon Shift",
            date: new Date(),
        },
        user: {
            id: "u1",
            name: "John Doe",
            photoUrl: "https://placehold.co/40x40",
        },
        sessions: [
            {
                schedule: {
                    start: new Date(new Date().setHours(8, 0)),
                    end: new Date(new Date().setHours(12, 0)),
                },
                checkIn: new Date(new Date().setHours(8, 5)), // within threshold
                checkOut: new Date(new Date().setHours(12, 0)),
                status: "present",
            },
            {
                schedule: {
                    start: new Date(new Date().setHours(13, 0)),
                    end: new Date(new Date().setHours(17, 0)),
                },
                checkIn: new Date(new Date().setHours(13, 5)), // within threshold
                checkOut: new Date(new Date().setHours(17, 0)),
                status: "present",
            },
        ],
        overallStatus: "present",
        totalWorkMinutes: 480,
        markedBy: "self",
        createdAt: new Date(),
        updatedAt: new Date(),
    },

    // --- Late Arrival ---
    {
        id: "2",
        schedule: {
            id: "sched2",
            name: "Morning Shift",
            date: new Date(),
        },
        user: {
            id: "u2",
            name: "Jane Smith",
        },
        sessions: [
            {
                schedule: {
                    start: new Date(new Date().setHours(8, 0)),
                    end: new Date(new Date().setHours(17, 0)),
                },
                checkIn: new Date(new Date().setHours(8, 30)), // 30 min late
                checkOut: new Date(new Date().setHours(17, 0)),
                status: "late",
            },
        ],
        overallStatus: "late",
        totalWorkMinutes: 450,
        markedBy: "self",
        createdAt: new Date(),
        updatedAt: new Date(),
    },

    // --- Undertime ---
    {
        id: "3",
        schedule: {
            id: "sched3",
            name: "Afternoon Shift",
            date: new Date(),
        },
        user: {
            id: "u3",
            name: "Mark Lee",
        },
        sessions: [
            {
                schedule: {
                    start: new Date(new Date().setHours(13, 0)),
                    end: new Date(new Date().setHours(17, 0)),
                },
                checkIn: new Date(new Date().setHours(13, 0)), // on time
                checkOut: new Date(new Date().setHours(16, 30)), // 30 min undertime
                status: "undertime",
            },
        ],
        overallStatus: "undertime",
        totalWorkMinutes: 210,
        markedBy: "self",
        createdAt: new Date(),
        updatedAt: new Date(),
    },

    // --- Both Late & Undertime ---
    {
        id: "4",
        schedule: {
            id: "sched4",
            name: "Morning Shift",
            date: new Date(),
        },
        user: {
            id: "u4",
            name: "Sarah Connor",
        },
        sessions: [
            {
                schedule: {
                    start: new Date(new Date().setHours(8, 0)),
                    end: new Date(new Date().setHours(12, 0)),
                },
                checkIn: new Date(new Date().setHours(8, 25)), // late
                checkOut: new Date(new Date().setHours(11, 45)), // undertime
                status: "late",
            },
        ],
        overallStatus: "undertime",
        totalWorkMinutes: 200,
        markedBy: "self",
        createdAt: new Date(),
        updatedAt: new Date(),
    },

    // --- Perfect Full Day ---
    {
        id: "5",
        schedule: {
            id: "sched5",
            name: "Full Day Shift",
            date: new Date(),
        },
        user: {
            id: "u5",
            name: "Alex Turner",
        },
        sessions: [
            {
                schedule: {
                    start: new Date(new Date().setHours(9, 0)),
                    end: new Date(new Date().setHours(18, 0)),
                },
                checkIn: new Date(new Date().setHours(9, 20)),
                checkOut: new Date(new Date().setHours(17, 40)),
                status: "late",
            },
        ],
        overallStatus: "late",
        totalWorkMinutes: 500,
        markedBy: "self",
        createdAt: new Date(),
        updatedAt: new Date(),
    },
]

interface FlattenedSession extends Omit<AttendanceSession, "schedule"> {
    user: Attendance["user"]
    attendanceSchedule: Attendance["schedule"]
    sessionSchedule: AttendanceSession["schedule"]
    overallStatus?: Attendance["overallStatus"]
}

function flattenAttendances(attendances: Attendance[]): FlattenedSession[] {
    return attendances.flatMap((att) =>
        att.sessions.map((session) => ({
            ...session,
            sessionSchedule: session.schedule,
            attendanceSchedule: att.schedule,
            user: att.user,
            overallStatus: att.overallStatus,
        }))
    )
}

const attendanceColumns: ColumnDef<FlattenedSession>[] = [
    {
        accessorKey: "timeRange",
        header: "Clock-in & Out",
        size: 50,
        cell: ({ row, column }) => {
            const { checkIn, checkOut, sessionSchedule } = row.original
            if (!checkIn && !checkOut) return "-"

            const formatTime = (d?: Date | null) =>
                d
                    ? d.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                      })
                    : "-"

            const scheduledStart = sessionSchedule?.start as Date
            const scheduledEnd = sessionSchedule?.end as Date
            const lateThresholdMins = sessionSchedule?.lateThresholdMins ?? 15
            const undertimeThresholdMins =
                sessionSchedule?.undertimeThresholdMins ?? 15

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

            let bgColor = "dark:text-white"
            const textColor = "text-white"

            if (status === "present") {
                bgColor = "bg-green-500 dark:bg-green-600"
            } else if (status === "late") {
                bgColor = "bg-red-500 dark:bg-red-600"
            } else if (status === "absent") {
                bgColor = " bg-gray-500 dark:bg-gray-600"
            } else if (status === "undertime") {
                bgColor = " bg-amber-500 dark:bg-amber-600"
            }

            return <Badge className={`${textColor} ${bgColor}`}>{status}</Badge>
        },
    },
]

interface AttendanceListProps {
    attendances: Attendance[]
}

export function AttendanceList({ attendances }: AttendanceListProps) {
    console.log("🚀 ~ AttendanceList ~ attendances:", attendances)
    // const flattened = flattenAttendances(attendances)
    const flattened = flattenAttendances(mockAttendances)

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
                <DataTable columns={attendanceColumns} data={flattened} />
            </CardContent>
        </Card>
    )
}
