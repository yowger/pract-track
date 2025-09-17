import type { ColumnDef } from "@tanstack/react-table"

import DataTable from "@/components/data-table"
// import { Badge } from "@/components/ui/badge"
import { firebaseTimestampToDate, formatTime } from "@/lib/date-utils"
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
                    <span>{d ? d.toLocaleDateString("en-US") : null}</span>
                </div>
            )
        },
    },
    {
        id: "am",
        header: "AM",
        cell: ({ row }) => {
            const session = row.original.sessions[0]
            if (!session) return null

            const inDate = session.checkInInfo
                ? firebaseTimestampToDate(session.checkInInfo.time)
                : null
            const outDate = session.checkOutInfo
                ? firebaseTimestampToDate(session.checkOutInfo.time)
                : null

            if (!inDate && !outDate) return null

            return (
                <div className="inline-flex items-center gap-1">
                    <span className={inDate ? "" : "text-muted-foreground"}>
                        {inDate ? formatTime(inDate) : "-"}
                    </span>
                    <span className="text-muted-foreground">-</span>
                    <span className={outDate ? "" : "text-muted-foreground"}>
                        {outDate ? formatTime(outDate) : ""}
                    </span>
                </div>
            )
        },
    },
    {
        id: "pm",
        header: "PM",
        cell: ({ row }) => {
            const session = row.original.sessions[1]
            if (!session) return null

            const inDate = session.checkInInfo
                ? firebaseTimestampToDate(session.checkInInfo.time)
                : null
            const outDate = session.checkOutInfo
                ? firebaseTimestampToDate(session.checkOutInfo.time)
                : null

            if (!inDate && !outDate) return null

            return (
                <div className="inline-flex items-center gap-1">
                    <span className={inDate ? "" : "text-muted-foreground"}>
                        {inDate ? formatTime(inDate) : "-"}
                    </span>
                    <span className="text-muted-foreground">-</span>
                    <span className={outDate ? "" : "text-muted-foreground"}>
                        {outDate ? formatTime(outDate) : ""}
                    </span>
                </div>
            )
        },
    },
    {
        id: "duration",
        header: "Duration",
        cell: ({ row }) => {
            const sessions = row.original.sessions
            let totalMins = 0

            sessions.forEach((s) => {
                const inDate = s.checkInInfo
                    ? firebaseTimestampToDate(s.checkInInfo.time)
                    : null
                const outDate = s.checkOutInfo
                    ? firebaseTimestampToDate(s.checkOutInfo.time)
                    : null
                if (inDate && outDate) {
                    totalMins += Math.floor((+outDate - +inDate) / 60000)
                }
            })

            if (!totalMins)
                return <span className="text-muted-foreground"></span>

            const h = Math.floor(totalMins / 60)
            const m = totalMins % 60
            return <span>{`${h}h ${m}m`}</span>
        },
    },
    {
        id: "photos",
        header: "Photos",
        cell: ({ row }) => {
            const sessions = row.original.sessions
            const photos: string[] = []

            sessions.forEach((s) => {
                if (s.checkInInfo?.photoUrl) photos.push(s.checkInInfo.photoUrl)
                if (s.checkOutInfo?.photoUrl)
                    photos.push(s.checkOutInfo.photoUrl)
            })

            if (!photos.length)
                return <span className="text-muted-foreground"></span>

            return (
                <div className="flex flex-col gap-1">
                    {photos.map((url, idx) => (
                        <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 block max-w-[150px] truncate"
                            title={url}
                        >
                            {url}
                        </a>
                    ))}
                </div>
            )
        },
    },
    {
        id: "location",
        header: "Location",
        cell: ({ row }) => {
            const sessions = row.original.sessions
            const geo =
                sessions[0]?.checkInInfo?.geo ||
                sessions[0]?.checkOutInfo?.geo ||
                sessions[1]?.checkInInfo?.geo ||
                sessions[1]?.checkOutInfo?.geo
            const address =
                sessions[0]?.checkInInfo?.address ||
                sessions[0]?.checkOutInfo?.address ||
                sessions[1]?.checkInInfo?.address ||
                sessions[1]?.checkOutInfo?.address

            if (!geo) return <span className="text-muted-foreground"></span>

            return (
                <a
                    href={`https://maps.google.com/?q=${geo.lat},${geo.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 block max-w-[150px] truncate"
                    title={address || "Unknown Address"}
                >
                    {address || "Unknown Address"}
                </a>
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
