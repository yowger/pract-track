import { QRCodeSVG } from "qrcode.react"
import { Timestamp } from "firebase/firestore"
import { useState } from "react"

import { useGetSchedules } from "@/api/hooks/use-get-real-schedule"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useUser } from "@/hooks/use-user"
import { isAgency } from "@/types/user"
import type { PlannedSession } from "@/types/scheduler"

import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FullscreenIcon } from "lucide-react"

const today = new Date()

export default function AgencyDtrQr() {
    const { user } = useUser()
    const agencyId = user && isAgency(user) ? user.companyData?.ownerId : ""

    const { data: todaySchedules } = useGetSchedules({
        date: today,
        agencyId,
        limitCount: 1,
    })
    const firstSchedule = todaySchedules?.[0]

    const [open, setOpen] = useState(false)

    return (
        <div className="flex flex-col p-4 gap-4 relative">
            <div className="flex flex-col md:flex-row md:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Attendance QR Code
                    </h1>
                    <p className="text-muted-foreground">
                        Please scan this QR on-site to confirm your attendance.
                        Location and schedule will be verified.
                    </p>
                </div>
            </div>

            <div className="col-span-12 flex justify-center items-center min-h-full relative">
                {firstSchedule ? (
                    <div className="flex flex-col gap-4 items-center">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setOpen(true)}
                        >
                            <FullscreenIcon />
                        </Button>

                        <div className="relative bg-white p-4 rounded-lg shadow">
                            <QRCodeSVG value={firstSchedule.id} size={200} />
                        </div>

                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogOverlay className="bg-black/90" />
                            <DialogContent
                                className="flex justify-center items-center"
                                showCloseButton={false}
                            >
                                <QRCodeSVG
                                    value={firstSchedule.id}
                                    size={400}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>
                ) : (
                    <div className="text-muted-foreground">
                        No schedule for today.
                    </div>
                )}
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
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {sessions.map((s, idx) => (
                        <TableRow key={idx}>
                            <TableCell>{formatTime(s.start)}</TableCell>
                            <TableCell>{formatTime(s.end)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
