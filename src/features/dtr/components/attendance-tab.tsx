import type { ColumnDef } from "@tanstack/react-table"

import { useAttendances } from "@/api/hooks/use-fetch-attendance"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Attendance } from "@/types/attendance"
import { firebaseTimestampToDate } from "@/lib/date-utils"
import { formatTime } from "@/service/attendance-service"
import { SharedImagePreview } from "@/features/agency-person/pages/agency-dashboard"
import { Badge } from "@/components/ui/badge"
import DataTable from "@/components/data-table"
import { capitalize } from "../../../lib/utils"

const statusColors: Record<NonNullable<Attendance["overallStatus"]>, string> = {
    present: "bg-green-500",
    late: "bg-yellow-500",
    absent: "bg-red-500",
    excused: "bg-blue-500",
    undertime: "bg-orange-500",
    overtime: "bg-purple-500",
}

const attendanceColumns: ColumnDef<Attendance>[] = [
    // {
    //     accessorKey: "schedule.date",
    //     header: "Date",
    //     cell: ({ row }) => {
    //         const date = row.original.schedule.date
    //         const d = date instanceof Date ? date : date?.toDate?.()
    //         return (
    //             <div className="align-top flex items-start">
    //                 <span>{d ? d.toLocaleDateString("en-US") : null}</span>
    //             </div>
    //         )
    //     },
    // },
    {
        id: "name",
        accessorKey: "user.name",
        header: "Name",
        cell: ({ row }) => {
            const { name, photoUrl } = row.original.user
            const initials = name
                ? name
                      .split(" ")
                      .map((n) => n[0].toUpperCase())
                      .join("")
                : "?"

            const nameToUppercase = name.split(" ").map(capitalize).join(" ")

            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={photoUrl} alt={name} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span>{nameToUppercase}</span>
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
        id: "status",
        accessorKey: "overallStatus",
        header: "Status",
        cell: ({ row }) => {
            const status = row.original.overallStatus || "absent"
            const color = statusColors[status] || "bg-gray-500"

            return (
                <Badge className={`${color} text-white capitalize`}>
                    {status}
                </Badge>
            )
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

            if (!photos.length) {
                return <span className="text-muted-foreground"></span>
            }

            return (
                <div className="flex items-center gap-2 relative size-14 overflow-hidden">
                    <SharedImagePreview photos={photos} />
                </div>
            )
        },
    },
    // {
    //     id: "location",
    //     header: "Location",
    //     cell: ({ row }) => {
    //         const sessions = row.original.sessions
    //         const geo =
    //             sessions[0]?.checkInInfo?.geo ||
    //             sessions[0]?.checkOutInfo?.geo ||
    //             sessions[1]?.checkInInfo?.geo ||
    //             sessions[1]?.checkOutInfo?.geo
    //         const address =
    //             sessions[0]?.checkInInfo?.address ||
    //             sessions[0]?.checkOutInfo?.address ||
    //             sessions[1]?.checkInInfo?.address ||
    //             sessions[1]?.checkOutInfo?.address

    //         if (!geo) return <span className="text-muted-foreground"></span>

    //         return (
    //             <a
    //                 href={`https://maps.google.com/?q=${geo.lat},${geo.lng}`}
    //                 target="_blank"
    //                 rel="noopener noreferrer"
    //                 className="text-blue-600 block max-w-[150px] truncate"
    //                 title={address || "Unknown Address"}
    //             >
    //                 {address || "Unknown Address"}
    //             </a>
    //         )
    //     },
    // },
]

interface AttendanceTabProps {
    userId: string
    dateRange?: {
        from: Date | null
        to: Date | null
    }
}

export default function AttendanceTab({
    userId,
    dateRange,
}: AttendanceTabProps) {
    const { data: attendances } = useAttendances({
        userId,
        from: dateRange?.from ?? undefined,
        to: dateRange?.to ?? undefined,
    })

    return <DataTable columns={attendanceColumns} data={attendances || []} />
}
