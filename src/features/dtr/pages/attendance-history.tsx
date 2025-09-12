import { useState } from "react"
import { saveAs } from "file-saver"
import type { DateRange } from "react-day-picker"
import * as XLSX from "xlsx"

import { useAttendances } from "@/api/hooks/use-fetch-attendance"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePickerWithRange } from "@/components/date-range-picker"
import type { Attendance } from "@/types/attendance"
import { AttendanceSummary } from "../components/attendance-summary"

interface AttendanceStats {
    present: number
    late: number
    undertime: number
    absent: number
    excused: number
    totalHours: number
}

function computeAttendanceSummary(attendances: Attendance[]): AttendanceStats {
    const summary: AttendanceStats = {
        present: 0,
        late: 0,
        undertime: 0,
        absent: 0,
        excused: 0,
        totalHours: 0,
    }

    attendances.forEach((att) => {
        att.sessions.forEach((session) => {
            if (!session.checkInInfo && !session.checkOutInfo) {
                summary.absent += 1
                return
            }

            if (session.checkInInfo?.status) {
                const s = session.checkInInfo.status
                if (s in summary) summary[s] += 1
            }

            if (session.checkOutInfo?.status) {
                const s = session.checkOutInfo.status
                if (s in summary) summary[s] += 1
            }

            if (session.checkInInfo?.time && session.checkOutInfo?.time) {
                const inTime =
                    session.checkInInfo.time instanceof Date
                        ? session.checkInInfo.time
                        : session.checkInInfo.time.toDate?.()

                const outTime =
                    session.checkOutInfo.time instanceof Date
                        ? session.checkOutInfo.time
                        : session.checkOutInfo.time.toDate?.()

                if (inTime && outTime) {
                    const mins = Math.floor(
                        (outTime.getTime() - inTime.getTime()) / 60000
                    )
                    summary.totalHours += mins / 60
                }
            }
        })
    })

    return summary
}

export function AttendanceSummaryStats({
    attendances,
}: {
    attendances: Attendance[]
}) {
    const summary = computeAttendanceSummary(attendances)

    return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {(Object.keys(summary) as (keyof AttendanceStats)[]).map(
                (status) => (
                    <Card key={status}>
                        <CardHeader>
                            <CardTitle>
                                {status === "totalHours"
                                    ? "Total Hours Worked"
                                    : status.charAt(0).toUpperCase() +
                                      status.slice(1)}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">
                                {status === "totalHours"
                                    ? summary[status].toFixed(1)
                                    : summary[status]}
                            </p>
                        </CardContent>
                    </Card>
                )
            )}
        </div>
    )
}

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileSpreadsheet, FileText, Download } from "lucide-react"
import { firebaseTimestampToDate } from "@/lib/date-utils"
import { useUser } from "@/hooks/use-user"
import { toast } from "sonner"

export function ExportDropdown({
    onExportExcel,
    onExportWord,
}: {
    onExportExcel?: () => void
    onExportWord?: () => void
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Export as</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onExportExcel} className="gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-green-600" />
                    Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onExportWord} className="gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Word
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default function AttendanceHistory() {
    const { user } = useUser()
    const [dateRange, setDateRange] = useState<DateRange | undefined>()
    const { data: Attendances } = useAttendances({
        from: dateRange?.from,
        to: dateRange?.to,
    })

    function handleExportExcel() {
        if (!Attendances || Attendances.length === 0) {
            toast.warning("No attendance data to export")
            return
        }

        let totalHours = 0

        const rows = Attendances.flatMap((att) =>
            att.sessions.map((session) => {
                let hours = 0
                if (session.checkInInfo?.time && session.checkOutInfo?.time) {
                    const inTime =
                        session.checkInInfo.time instanceof Date
                            ? session.checkInInfo.time
                            : session.checkInInfo.time.toDate?.()

                    const outTime =
                        session.checkOutInfo.time instanceof Date
                            ? session.checkOutInfo.time
                            : session.checkOutInfo.time.toDate?.()

                    if (inTime && outTime) {
                        const mins = Math.floor(
                            (outTime.getTime() - inTime.getTime()) / 60000
                        )
                        hours = mins / 60
                        totalHours += hours
                    }
                }

                return {
                    Student: user?.displayName || "N/A",
                    Date:
                        att.schedule.date &&
                        firebaseTimestampToDate(att.schedule.date),
                    CheckIn: session.checkInInfo?.time
                        ? session.checkInInfo.time instanceof Date
                            ? session.checkInInfo.time.toLocaleTimeString()
                            : session.checkInInfo.time
                                  .toDate?.()
                                  .toLocaleTimeString()
                        : "-",
                    CheckOut: session.checkOutInfo?.time
                        ? session.checkOutInfo.time instanceof Date
                            ? session.checkOutInfo.time.toLocaleTimeString()
                            : session.checkOutInfo.time
                                  .toDate?.()
                                  .toLocaleTimeString()
                        : "-",
                    HoursWorked: hours.toFixed(2),
                }
            })
        )

        rows.push({
            Student: "TOTAL",
            Date: null,
            CheckIn: "",
            CheckOut: "",
            HoursWorked: totalHours.toFixed(2),
        })

        const worksheet = XLSX.utils.json_to_sheet(rows)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance")

        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        })
        const data = new Blob([excelBuffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        })
        saveAs(data, `attendance_${new Date().toISOString().slice(0, 10)}.xlsx`)
    }

    function handleExportWord() {
        console.log("Export to Word")
    }

    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col md:flex-row  md:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Attendance Summary
                    </h1>
                    <p className="text-muted-foreground">
                        View your past work sessions and summary.
                    </p>
                </div>

                <div>
                    <DatePickerWithRange
                        value={dateRange}
                        onChange={setDateRange}
                    />
                </div>
            </div>

            <div className="grid auto-rows-auto grid-cols-12 gap-5">
                <div className="col-span-12">
                    <AttendanceSummaryStats attendances={Attendances || []} />
                </div>

                <div className=" col-span-12 flex justify-end">
                    <ExportDropdown
                        onExportExcel={handleExportExcel}
                        onExportWord={handleExportWord}
                    />
                </div>

                <div className="col-span-12 lg:col-span-12">
                    <ScrollArea
                        type="always"
                        className=" w-full overflow-x-auto"
                    >
                        <AttendanceSummary attendances={Attendances || []} />
                        <ScrollBar
                            orientation="horizontal"
                            className="w-full"
                        />
                    </ScrollArea>
                </div>
            </div>
        </div>
    )
}
