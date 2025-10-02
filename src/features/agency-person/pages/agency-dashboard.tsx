import { Timestamp } from "firebase/firestore"
import { Link } from "react-router-dom"

import { useGetRealAttendances } from "@/api/hooks/use-get-real-attendances"
import { useGetSchedules } from "@/api/hooks/use-get-real-schedule"
import { useUser } from "@/hooks/use-user"
import type { Attendance } from "@/types/attendance"
import type { PlannedSession } from "@/types/scheduler"
import { isAgency } from "@/types/user"
import DataTable from "@/components/data-table"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import { DialogTitle } from "@radix-ui/react-dialog"
import { useGetExcuseRequests } from "@/api/hooks/use-real-time-excuse"
import { ExcuseRequestsFeed } from "../components/excuse-list"
import { ViolationsFeed } from "../components/violation-list"
import { useGetViolations } from "@/api/hooks/use-get-real-violations"
import { AttendanceStats } from "@/features/dtr/components/attendance-stats"
import ViolationSideSheet from "../components/violation-sheet"
import type { Violation } from "@/types/violation"
import ExcuseSideSheet from "../components/excuse-sheet"
import type { ExcuseRequest } from "@/types/excuse"
import { attendanceColumns } from "../components/attendance-column"
import { QrCodeIcon } from "lucide-react"

const today = new Date()

export default function AgencyDashboardPage() {
    const { user } = useUser()
    const agencyId = user && isAgency(user) ? user.companyData?.ownerId : ""
    console.log("🚀 ~ AgencyDashboardPage ~ agencyId:", agencyId)

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

    const { data: excuseRequests } = useGetExcuseRequests({
        agencyId,
        limitCount: 3,
    })

    const { data: violations } = useGetViolations({
        agencyId,
        limitCount: 3,
    })

    const [selectedViolation, setSelectedViolation] =
        useState<Violation | null>(null)
    const [openViolationSheet, setOpenViolationSheet] = useState(false)

    const [selectedExcuse, setSelectedExcuse] = useState<ExcuseRequest | null>(
        null
    )
    const [openExcuseSheet, setOpenExcuseSheet] = useState(false)

    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col md:flex-row  md:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground">
                        Overview of today's attendance and recent activities.
                    </p>
                </div>
            </div>

            <div className="grid auto-rows-auto grid-cols-12 gap-5">
                <div className="col-span-12 lg:col-span-8 flex flex-col gap-5">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                <div className="flex items-center justify-between">
                                    <span>Daily Attendance Records</span>

                                    {firstSchedule ? (
                                        <Button
                                            size="icon"
                                            variant="outline"
                                            asChild
                                        >
                                            <Link to={`/dtr/qr`}>
                                                <QrCodeIcon />
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button size="sm" asChild>
                                            <Link to={`/dtr`}>New Session</Link>
                                        </Button>
                                    )}
                                </div>
                            </CardTitle>
                            <CardDescription>
                                Summary of today's attendance across all
                                scheduled staff.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <AttendanceStats stats={stats} />

                                <DataTable
                                    columns={attendanceColumns}
                                    data={attendances || []}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-12 lg:col-span-4 flex flex-col gap-5">
                    <section>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-base font-semibold text-gray-900">
                                Recent Excuse Requests
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-sm"
                            >
                                See all
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <ExcuseRequestsFeed
                                excuses={excuseRequests || []}
                                onViewDetails={(excuse) => {
                                    setSelectedExcuse(excuse)
                                    setOpenExcuseSheet(true)
                                }}
                            />
                        </div>
                    </section>

                    {/* Complaints */}
                    <section>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-base font-semibold text-gray-900">
                                Recent Complaints
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-sm"
                            >
                                See all
                            </Button>
                        </div>
                        <div className="space-y-4">
                            <ViolationsFeed
                                violations={violations || []}
                                onViewDetails={(violation) => {
                                    setSelectedViolation(violation)
                                    setOpenViolationSheet(true)
                                }}
                            />
                        </div>
                    </section>
                </div>
            </div>

            <ExcuseSideSheet
                excuse={selectedExcuse}
                isOpen={openExcuseSheet}
                onClose={() => setSelectedExcuse(null)}
            />

            <ViolationSideSheet
                violation={selectedViolation}
                isOpen={openViolationSheet}
                onClose={() => setSelectedViolation(null)}
            />
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

interface SharedImagePreviewProps {
    photos: string[]
}

export function SharedImagePreview({ photos }: SharedImagePreviewProps) {
    const ordered = [...photos].reverse()
    const [open, setOpen] = useState(false)
    const [api, setApi] = useState<CarouselApi>()
    const [selected, setSelected] = useState(0)

    useEffect(() => {
        if (!api) return
        onSelect()
        api.on("select", onSelect)
    }, [api])

    if (!ordered.length) return null

    const firstPhoto = ordered[0]
    const extraCount = ordered.length - 1

    const onSelect = () => {
        if (!api) return
        setSelected(api.selectedScrollSnap())
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <div className="relative cursor-pointer">
                    <img
                        src={firstPhoto}
                        alt="Thumbnail"
                        className="rounded-xs object-cover"
                    />
                    {extraCount > 0 && (
                        <Badge
                            variant="secondary"
                            className="rounded-sm absolute top-[1px] right-[1px] text-xs px-1 bg-black/60 text-white"
                        >
                            +{extraCount}
                        </Badge>
                    )}
                </div>
            </DialogTrigger>

            <DialogContent className="max-w-4xl p-2 [&>button]:hidden">
                <DialogTitle className="p-0 m-0"></DialogTitle>
                <Carousel
                    className="w-full"
                    opts={{ align: "start", loop: true }}
                    setApi={setApi}
                >
                    <CarouselContent>
                        {ordered.map((url, idx) => (
                            <CarouselItem
                                key={idx}
                                className="flex justify-center"
                            >
                                <img
                                    src={url}
                                    alt={`Photo ${idx + 1}`}
                                    className="rounded-xs object-contain max-h-[75vh]"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-14" />
                    <CarouselNext className="-right-14" />
                </Carousel>

                <div className="flex gap-2 overflow-x-auto pb-2 px-3.5">
                    {ordered.map((url, idx) => (
                        <button
                            key={idx}
                            onClick={() => api?.scrollTo(idx)}
                            className={`relative w-16 h-16 flex-shrink-0 rounded-sm overflow-hidden border-2 ${
                                selected === idx
                                    ? "border-primary"
                                    : "border-transparent"
                            }`}
                        >
                            <img
                                src={url}
                                alt={`Thumb ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}
