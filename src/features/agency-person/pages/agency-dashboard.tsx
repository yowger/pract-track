import { Timestamp } from "firebase/firestore"
import type { ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"

import { useGetRealAttendances } from "@/api/hooks/use-get-real-attendances"
import { useGetSchedules } from "@/api/hooks/use-get-real-schedule"
import { useUser } from "@/hooks/use-user"
import { firebaseTimestampToDate, formatTime } from "@/lib/date-utils"
import type { Attendance } from "@/types/attendance"
import type { PlannedSession } from "@/types/scheduler"
import { isAgency } from "@/types/user"
import DataTable from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useMemo } from "react"

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
                      .map((n) => n[0])
                      .join("")
                : "?"

            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={photoUrl} alt={name} />
                        <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span>{name}</span>
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
]

const today = new Date()

export default function AgencyDashboardPage() {
    const { user } = useUser()
    const agencyId = user && isAgency(user) ? user.companyData?.ownerId : ""

    const { data: todaySchedules } = useGetSchedules({
        date: today,
        agencyId,
        limitCount: 1,
    })
    const firstSchedule = todaySchedules?.[0]
    const { data: attendances } = useGetRealAttendances({
        agencyId,
        date: today,
    })

    const stats = useAttendanceStats(attendances)

    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col md:flex-row  md:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        View attendance history, complains and more in real
                        time.
                    </p>
                </div>
            </div>

            <div className="grid auto-rows-auto grid-cols-12 gap-5">
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-5">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                <span>Today’s schedule</span>
                                {firstSchedule && (
                                    <Button size="sm" asChild>
                                        <Link to={`/dtr/${firstSchedule.id}`}>
                                            Generate QR
                                        </Link>
                                    </Button>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!firstSchedule ? (
                                <div className="flex flex-col items-center">
                                    <p className="text-muted-foreground mb-2">
                                        No session created yet
                                    </p>

                                    <Button asChild size="sm">
                                        <Link to="/dtr/qr">
                                            Generate Session
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <SessionTable
                                        sessions={firstSchedule.sessions}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-6 md:col-span-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Present</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {stats.present}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="col-span-6 md:col-span-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Late</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {stats.late}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="col-span-6 md:col-span-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Excused</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {stats.excused}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="col-span-6 md:col-span-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Absent</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">
                                        {stats.absent}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Attendance Records</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={attendanceColumns}
                                data={attendances || []}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Complaints</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>Complaints here</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Excuse Approvals</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p>Excuse Approvals here</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

interface SessionTableProps {
    sessions: PlannedSession[]
}

export function SessionTable({ sessions }: SessionTableProps) {
    const formatTime = (time: Date | Timestamp) => {
        const d = time instanceof Timestamp ? time.toDate() : new Date(time)
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Start</TableHead>
                        <TableHead>End</TableHead>
                        {/* <TableHead>Late</TableHead>
                        <TableHead>Undertime</TableHead>
                        <TableHead>Early In</TableHead> */}
                        <TableHead>Location</TableHead>
                        <TableHead>Photo</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sessions.map((s, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{formatTime(s.start)}</TableCell>
                            <TableCell>{formatTime(s.end)}</TableCell>
                            {/* <TableCell>{s.lateThresholdMins} m</TableCell>
                            <TableCell>{s.undertimeThresholdMins} m</TableCell>
                            <TableCell>{s.earlyClockInMins} m</TableCell> */}
                            {/* <TableCell > */}
                            {/* {s.geoLocation?.lat}, {s.geoLocation?.lng} (
                                {s.geoRadius}m) */}
                            {/* {s.address} */}
                            {/* </TableCell> */}
                            <TableCell
                                className="max-w-[200px] truncate"
                                title={s.address}
                            >
                                {s.address}
                            </TableCell>
                            <TableCell>
                                {s.photoStart || s.photoEnd ? "Yes" : "No"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

function useAttendanceStats(attendances?: Attendance[]) {
    return useMemo(() => {
        const stats = {
            present: 0,
            late: 0,
            excused: 0,
            absent: 0,
            undertime: 0,
            overtime: 0,
        }

        if (!attendances) return stats

        for (const att of attendances) {
            if (att.overallStatus && stats[att.overallStatus] !== undefined) {
                stats[att.overallStatus]++
            }
        }

        return stats
    }, [attendances])
}
