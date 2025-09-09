import type { ColumnDef } from "@tanstack/react-table"

import DataTable from "@/components/data-table"
import { Badge } from "@/components/ui/badge"
import {
    firebaseTimestampToDate,
    formatDate,
    formatTime,
} from "@/lib/date-utils"
import type { Attendance } from "@/types/attendance"

const attendanceColumns: ColumnDef<Attendance>[] = [
    {
        accessorKey: "schedule.date",
        header: "Date",
        cell: ({ row }) => {
            const date = row.original.schedule.date
            const d = date instanceof Date ? date : date?.toDate?.()

            return <span>{formatDate(d ?? null)}</span>
        },
    },
    {
        accessorKey: "schedule.name",
        header: "Schedule",
        cell: ({ row }) => {
            const sessions = row.original.sessions

            return (
                <div className="flex flex-col gap-2">
                    {sessions.map((s) => {
                        const start = firebaseTimestampToDate(s.schedule.start)
                        const end = firebaseTimestampToDate(s.schedule.end)

                        return (
                            <div key={s.id}>
                                <span>
                                    {formatTime(start)} - {formatTime(end)}
                                </span>
                            </div>
                        )
                    })}
                </div>
            )
        },
    },
    {
        accessorKey: "sessions",
        header: "Sessions",
        enableSorting: false,
        cell: ({ row, column }) => {
            const sessions = row.original.sessions

            const hasAnyTime = sessions.some((s) => s.checkIn || s.checkOut)

            if (!hasAnyTime)
                return <span className="text-muted-foreground">-</span>

            return (
                <div className="flex flex-col gap-2">
                    {sessions.map((session) => {
                        const { checkIn, checkOut, schedule } = session

                        if (!checkIn && !checkOut) {
                            return (
                                <span className="text-muted-foreground">-</span>
                            )
                        }

                        const scheduledStart = firebaseTimestampToDate(
                            schedule?.start
                        )
                        const scheduledEnd = firebaseTimestampToDate(
                            schedule?.end
                        )
                        const lateThresholdMins =
                            schedule?.lateThresholdMins ?? 15
                        const undertimeThresholdMins =
                            schedule?.undertimeThresholdMins ?? 15

                        const inDate = firebaseTimestampToDate(checkIn)
                        const outDate = firebaseTimestampToDate(checkOut)

                        let isLate = false
                        let isUndertime = false

                        if (checkIn && scheduledStart) {
                            const thresholdStart = new Date(
                                scheduledStart.getTime() +
                                    lateThresholdMins * 60000
                            )
                            isLate = inDate! > thresholdStart
                        }

                        if (checkOut && scheduledEnd) {
                            const thresholdEnd = new Date(
                                scheduledEnd.getTime() -
                                    undertimeThresholdMins * 60000
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

                                <span className="text-muted-foreground mx-1">
                                    →
                                </span>

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
                    })}
                </div>
            )
        },
    },
    {
        accessorKey: "overallTime",
        header: "Duration",
        cell: ({ row }) => {
            const sessions = row.original.sessions

            return (
                <div className="flex flex-col gap-2">
                    {sessions.map((session) => {
                        const checkIn = firebaseTimestampToDate(session.checkIn)
                        const checkOut = firebaseTimestampToDate(
                            session.checkOut
                        )

                        const mins =
                            checkIn && checkOut
                                ? Math.floor((+checkOut - +checkIn) / 60000)
                                : 0
                        const h = Math.floor(mins / 60)
                        const m = mins % 60
                        const duration = mins > 0 ? `${h}h ${m}m` : "-"

                        return (
                            <span
                                className={
                                    mins > 0 ? "" : "text-muted-foreground"
                                }
                            >
                                {duration}
                            </span>
                        )
                    })}
                </div>
            )
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const sessions = row.original.sessions

            const status = row.original.overallStatus ?? "absent"

            const statuses = Array.isArray(status) ? status : [status]

            const order = [
                "present",
                "late",
                "undertime",
                "overtime",
                "absent",
                "excused",
            ]

            const sortedStatuses = statuses
                .filter((s) => s !== null && s !== undefined)
                .sort((a, b) => order.indexOf(a!) - order.indexOf(b!))

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
                        return ""
                }
            }

            if (sortedStatuses.length === 0) return null

            return (
                <div className="flex flex-col gap-2">
                    {sessions.map((session) => {
                        const status = session.status ?? "absent"
                        const statuses = Array.isArray(status)
                            ? status
                            : [status]

                        const order = [
                            "present",
                            "late",
                            "undertime",
                            "overtime",
                            "absent",
                            "excused",
                        ]

                        const sortedStatuses = statuses
                            .filter((s) => s !== null && s !== undefined)
                            .sort(
                                (a, b) => order.indexOf(a!) - order.indexOf(b!)
                            )

                        return sortedStatuses.map((status, idx) => (
                            <Badge key={idx} className={getBadgeColors(status)}>
                                {status}
                            </Badge>
                        ))
                    })}
                    {/* {sortedStatuses.map((status, idx) => (
                        <Badge key={idx} className={getBadgeColors(status)}>
                            {status}
                        </Badge>
                    ))} */}
                </div>
            )
        },
    },
    {
        accessorKey: "photoUrl",
        header: "Photos",
        cell: ({ row }) => {
            const sessions = row.original.sessions

            return (
                <div className="flex flex-col gap-2">
                    {sessions.map((session) => {
                        const photos: string[] = []

                        if (session.photoStartUrl)
                            photos.push(session.photoStartUrl)
                        if (session.photoEndUrl)
                            photos.push(session.photoEndUrl)

                        if (photos.length === 0) {
                            return (
                                <span
                                    key={session.id}
                                    className="text-muted-foreground"
                                >
                                    -
                                </span>
                            )
                        }

                        return photos.map((url, idx) => (
                            <a
                                key={`${session.id}-${idx}`}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 block max-w-[150px] truncate"
                                title={url}
                            >
                                {url}
                            </a>
                        ))
                    })}
                </div>
            )
        },
    },
    {
        accessorKey: "geoLocation",
        header: "Location",
        cell: ({ row }) => {
            const sessions = row.original.sessions

            return (
                <div className="flex flex-col gap-2">
                    {sessions.map((session) => {
                        const geo = session.geoLocation
                        const address = session.address

                        return geo ? (
                            <a
                                href={`https://maps.google.com/?q=${geo.lat},${geo.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 block max-w-[150px] truncate"
                                title={address || "Unknown Address"}
                            >
                                {address || "Unknown Address"}
                            </a>
                        ) : (
                            <span className="text-muted-foreground">-</span>
                        )
                    })}
                </div>
            )
        },
    },
]

interface AttendanceListProps {
    attendances: Attendance[]
}

export function AttendanceSummary({ attendances }: AttendanceListProps) {
    return <DataTable columns={attendanceColumns} data={attendances} />
}
