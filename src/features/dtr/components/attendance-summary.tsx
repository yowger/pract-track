import type { ColumnDef } from "@tanstack/react-table"

import DataTable from "@/components/data-table"
// import { Badge } from "@/components/ui/badge"
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
            return (
                <div className="align-top flex items-start">
                    <span>{formatDate(d ?? null)}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "schedule.name",
        header: "Schedule",
        cell: ({ row }) => {
            const sessions = row.original.sessions
            return (
                <div className="flex flex-col gap-1">
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
        cell: ({ row }) => {
            const sessions = row.original.sessions
            if (!sessions.length)
                return <span className="text-muted-foreground">-</span>

            return (
                <div className="flex flex-col gap-1">
                    {sessions.map((s) => {
                        const inDate = s.checkInInfo
                            ? firebaseTimestampToDate(s.checkInInfo.time)
                            : null
                        const outDate = s.checkOutInfo
                            ? firebaseTimestampToDate(s.checkOutInfo.time)
                            : null

                        if (!inDate && !outDate)
                            return (
                                <span
                                    key={s.id}
                                    className="text-muted-foreground"
                                >
                                    -
                                </span>
                            )

                        const scheduledStart = firebaseTimestampToDate(
                            s.schedule.start
                        )
                        const scheduledEnd = firebaseTimestampToDate(
                            s.schedule.end
                        )
                        const lateThresholdMins =
                            s.schedule.lateThresholdMins ?? 15
                        const undertimeThresholdMins =
                            s.schedule.undertimeThresholdMins ?? 15

                        const isLate =
                            inDate && scheduledStart
                                ? inDate >
                                  new Date(
                                      scheduledStart.getTime() +
                                          lateThresholdMins * 60000
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
                                key={s.id}
                                className="inline-flex items-center gap-2"
                            >
                                <span
                                    className={`${
                                        inDate ? "" : "text-muted-foreground"
                                    } ${
                                        isLate
                                            ? "text-red-600 dark:text-red-700"
                                            : ""
                                    }`}
                                >
                                    {inDate ? formatTime(inDate) : "-"}
                                </span>
                                <span className="text-muted-foreground mx-1">
                                    →
                                </span>
                                <span
                                    className={`${
                                        outDate ? "" : "text-muted-foreground"
                                    } ${
                                        isUndertime
                                            ? "text-amber-600 dark:text-amber-700"
                                            : ""
                                    }`}
                                >
                                    {outDate ? formatTime(outDate) : "-"}
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
                <div className="flex flex-col gap-1">
                    {sessions.map((s) => {
                        const inDate = s.checkInInfo
                            ? firebaseTimestampToDate(s.checkInInfo.time)
                            : null
                        const outDate = s.checkOutInfo
                            ? firebaseTimestampToDate(s.checkOutInfo.time)
                            : null
                        if (!inDate || !outDate)
                            return (
                                <span
                                    key={s.id}
                                    className="text-muted-foreground"
                                >
                                    -
                                </span>
                            )
                        const mins = Math.floor((+outDate - +inDate) / 60000)
                        const h = Math.floor(mins / 60)
                        const m = mins % 60
                        return <span key={s.id}>{`${h}h ${m}m`}</span>
                    })}
                </div>
            )
        },
    },

    {
        accessorKey: "photos",
        header: "Photos",
        cell: ({ row }) => {
            const sessions = row.original.sessions
            return (
                <div className="flex flex-col gap-1">
                    {sessions.map((s) => {
                        const photos: string[] = []
                        if (s.checkInInfo?.photoUrl)
                            photos.push(s.checkInInfo.photoUrl)
                        if (s.checkOutInfo?.photoUrl)
                            photos.push(s.checkOutInfo.photoUrl)
                        if (!photos.length)
                            return (
                                <span
                                    key={s.id}
                                    className="text-muted-foreground"
                                >
                                    -
                                </span>
                            )
                        return photos.map((url, idx) => (
                            <a
                                key={`${s.id}-${idx}`}
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
                <div className="flex flex-col gap-1">
                    {sessions.map((s) => {
                        const geo = s.checkInInfo?.geo || s.checkOutInfo?.geo
                        const address =
                            s.checkInInfo?.address || s.checkOutInfo?.address
                        if (!geo)
                            return (
                                <span
                                    key={s.id}
                                    className="text-muted-foreground"
                                >
                                    -
                                </span>
                            )
                        return (
                            <a
                                key={s.id}
                                href={`https://maps.google.com/?q=${geo.lat},${geo.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 block max-w-[150px] truncate"
                                title={address || "Unknown Address"}
                            >
                                {address || "Unknown Address"}
                            </a>
                        )
                    })}
                </div>
            )
        },
    },
]

interface AttendanceSummaryProps {
    attendances: Attendance[]
}

export function AttendanceSummary({ attendances }: AttendanceSummaryProps) {
    return <DataTable columns={attendanceColumns} data={attendances} />
}

// {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => {
//         const sessions = row.original.sessions
//         return (
//             <div className="flex flex-col gap-1">
//                 {sessions.map((s) => {
//                     const statuses = [
//                         s.checkInInfo?.status,
//                         s.checkOutInfo?.status,
//                     ].filter(Boolean) as string[]

//                     const order = [
//                         "present",
//                         "late",
//                         "undertime",
//                         "overtime",
//                         "absent",
//                         "excused",
//                     ]
//                     const sortedStatuses = statuses.sort(
//                         (a, b) => order.indexOf(a) - order.indexOf(b)
//                     )

//                     const getBadgeColors = (s: string) => {
//                         switch (s) {
//                             case "present":
//                                 return "bg-green-600 dark:bg-green-700 text-white"
//                             case "late":
//                                 return "bg-red-600 dark:bg-red-700 text-white"
//                             case "undertime":
//                                 return "bg-amber-600 dark:bg-amber-700 text-white"
//                             case "overtime":
//                                 return "bg-blue-600 dark:bg-blue-700 text-white"
//                             case "absent":
//                                 return "bg-gray-600 dark:bg-gray-700 text-white"
//                             case "excused":
//                                 return "bg-purple-600 dark:bg-purple-700 text-white"
//                             default:
//                                 return "bg-gray-600 dark:bg-gray-700 text-white"
//                         }
//                     }

//                     return sortedStatuses.map((status, idx) => (
//                         <Badge
//                             key={`${s.id}-${idx}`}
//                             className={getBadgeColors(status)}
//                         >
//                             {status}
//                         </Badge>
//                     ))
//                 })}
//             </div>
//         )
//     },
// },
