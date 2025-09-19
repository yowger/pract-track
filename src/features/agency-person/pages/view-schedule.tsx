import type { ColumnDef } from "@tanstack/react-table"
import { Loader2, UserPlus } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import { useState } from "react"

import { useStudents } from "@/api/hooks/use-get-students"
import { useSchedule } from "@/api/hooks/use-fetch-schedule-by-id"
import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/use-user"
import { isAgency, type Student } from "@/types/user"
import { AssignStudentsDialog } from "../components/assign-students-dialog"
import { updateStudentsScheduleByIds } from "@/api/students"
import { toast } from "sonner"
import { updateSchedule } from "@/api/scheduler"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "@/components/info"
import {
    calculateContractHours,
    calculateTotalWorkingDays,
} from "@/lib/scheduler"
import DataTable from "@/components/data-table"
import type { DaySchedule } from "@/types/scheduler"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const dayScheduleColumns: ColumnDef<DaySchedule>[] = [
    {
        accessorKey: "day",
        header: "Day",
        cell: ({ row }) =>
            row.original.day.charAt(0).toUpperCase() +
            row.original.day.slice(1),
    },
    {
        id: "am",
        header: "AM",
        cell: ({ row }) => {
            const am = row.original.sessions[0]
            return am ? `${am.start} - ${am.end}` : "—"
        },
    },
    {
        id: "pm",
        header: "PM",
        cell: ({ row }) => {
            const pm = row.original.sessions[1]
            return pm ? `${pm.start} - ${pm.end}` : "—"
        },
    },
    {
        id: "photo",
        header: "Photo Proof",
        cell: ({ row }) => (
            <div className="flex flex-col">
                {row.original.sessions.length > 0 ? (
                    row.original.sessions.map((s, i) => (
                        <span key={i}>
                            {i === 0 && (s.photoStart || s.photoEnd)
                                ? "AM: "
                                : ""}
                            {i === 1 && (s.photoStart || s.photoEnd)
                                ? "PM: "
                                : ""}
                            {s.photoStart ? "📷 Start " : ""}
                            {s.photoEnd ? "📷 End" : ""}
                        </span>
                    ))
                ) : (
                    <span className="text-muted-foreground">—</span>
                )}
            </div>
        ),
    },
]

const assignedStudentColumns: ColumnDef<Student>[] = [
    {
        id: "student",
        header: "Student",
        cell: ({ row }) => {
            const student = row.original
            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={student.photoUrl || ""} />
                        <AvatarFallback>
                            {student.firstName.charAt(0)}
                            {student.lastName.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <Link
                        to={`/students/${student.uid}`}
                        className="hover:underline font-medium"
                    >
                        {student.firstName} {student.lastName}
                    </Link>
                </div>
            )
        },
    },
    {
        accessorKey: "studentID",
        header: "ID",
    },
    {
        id: "programYearSection",
        header: "Program",
        cell: ({ row }) => {
            const s = row.original
            return `${s.program} - ${s.yearLevel}${s.section}`
        },
    },
    {
        accessorKey: "violationCount",
        header: "Violations",
        cell: ({ row }) => row.original.violationCount ?? 0,
    },
]

export default function ViewSchedule() {
    const { user } = useUser()
    const { scheduleId } = useParams<{ scheduleId: string }>()
    const [updatingStudents, setUpdatingStudents] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)

    const companyId =
        user && isAgency(user) ? user.companyData?.ownerId || "" : ""

    const [fetchEnabled, setFetchEnabled] = useState(false)

    const { students: allStudents, loading: studentsLoading } = useStudents(
        { assignedAgencyID: companyId },
        { enabled: !!companyId && fetchEnabled }
    )

    const {
        students: assignedStudents,
        loading: assignedStudentsLoading,
        refetch: refetchStudents,
    } = useStudents(
        { assignedAgencyID: companyId || "", scheduleId },
        { enabled: !!companyId && !!scheduleId }
    )

    const assignedStudentsIds = assignedStudents.map((s) => s.studentID)

    const {
        schedule,
        loading: scheduleLoading,
        error: scheduleError,
    } = useSchedule(scheduleId)

    const handleOpenAssignStudents = () => {
        if (!fetchEnabled) setFetchEnabled(true)

        setDialogOpen(true)
    }

    const handleAssignSave = async (studentIds: string[]) => {
        if (!schedule || !schedule.id) return

        setUpdatingStudents(true)
        try {
            const previouslyAssignedIds = assignedStudents.map(
                (s) => s.studentID
            )
            const toUnassign = previouslyAssignedIds.filter(
                (id) => !studentIds.includes(id)
            )

            await updateStudentsScheduleByIds({
                studentIds,
                scheduleId: schedule.id,
                newName: schedule.scheduleName,
            })

            if (toUnassign.length) {
                await updateStudentsScheduleByIds({
                    studentIds: toUnassign,
                    scheduleId: "",
                    newName: "",
                })
            }

            await updateSchedule(schedule.id, {
                totalAssigned: studentIds.length,
            })

            await refetchStudents()

            setDialogOpen(false)

            toast.success("Scheduled updated successfully.")
        } catch (err) {
            console.error(err)
            toast.error("Failed to update schedule.")
        } finally {
            setUpdatingStudents(false)
        }
    }

    if (scheduleLoading) return <Loader2 className="animate-spin" />
    if (scheduleError) return <p className="text-red-500">{scheduleError}</p>
    if (!schedule) return <p>No schedule found</p>

    return (
        <div className="flex flex-col p-4 gap-4">
            <div className="flex flex-col md:flex-row  md:justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight">
                        View Schedule
                    </h1>
                    <p className="text-muted-foreground">
                        View and manage assigned students.
                    </p>
                </div>
            </div>
            <div className="grid auto-rows-auto grid-cols-12 gap-5">
                <div className="col-span-12">
                    <Card>
                        <CardHeader>
                            <CardTitle>Schedule Info</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <Info
                                    label="Name"
                                    value={schedule.scheduleName}
                                />
                                <Info
                                    label="Duration"
                                    value={`${new Date(
                                        schedule.startDate
                                    ).toLocaleDateString("en-US", {
                                        year: "2-digit",
                                        month: "numeric",
                                        day: "numeric",
                                    })} - ${new Date(
                                        schedule.endDate
                                    ).toLocaleDateString("en-US", {
                                        year: "2-digit",
                                        month: "numeric",
                                        day: "numeric",
                                    })}`}
                                />
                                <Info
                                    label="Total Working Days"
                                    value={calculateTotalWorkingDays(
                                        schedule
                                    ).toString()}
                                />
                                <Info
                                    label="Total Hours"
                                    value={`${calculateContractHours(
                                        schedule
                                    ).toFixed(1)}h`}
                                />
                                <Info
                                    label="Description"
                                    value={schedule.description || ""}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-12">
                    <Card>
                        <CardHeader>
                            <CardTitle>Weekly Schedule</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <DataTable
                                columns={dayScheduleColumns}
                                data={schedule.weeklySchedule}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="col-span-12">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Assigned Students</CardTitle>
                                <Button
                                    size="icon"
                                    variant="secondary"
                                    onClick={handleOpenAssignStudents}
                                >
                                    <UserPlus className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {assignedStudentsLoading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <DataTable
                                    columns={assignedStudentColumns}
                                    data={assignedStudents}
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AssignStudentsDialog
                scheduleId={schedule.id || ""}
                isOpen={dialogOpen}
                onClose={() => setDialogOpen(false)}
                assignedStudents={assignedStudentsIds || []}
                allStudents={allStudents}
                onSave={handleAssignSave}
                loading={studentsLoading}
                disabled={updatingStudents}
            />
        </div>
    )
}
