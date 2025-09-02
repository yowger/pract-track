import { Loader2 } from "lucide-react"
import { useParams } from "react-router-dom"
import { useState } from "react"

import { useStudents } from "@/api/hooks/use-students"
import { useSchedule } from "@/api/hooks/use-fetch-schedule-by-id"
import { TypographyH2, TypographyH4 } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { useUser } from "@/hooks/use-user"
import { isAgency } from "@/types/user"
import { AssignStudentsDialog } from "../components/assign-students-dialog"
import { updateStudentsScheduleByIds } from "@/api/students"
import { toast } from "sonner"

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
        if (!schedule) return

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

            await refetchStudents()

            setDialogOpen(false)

            toast.success("Students assigned successfully")
        } catch (err) {
            console.log("🚀 ~ handleAssignSave ~ err:", err)

            toast.error("Failed to update students")
        } finally {
            setUpdatingStudents(false)
        }
    }

    if (scheduleLoading) return <Loader2 className="animate-spin" />
    if (scheduleError) return <p className="text-red-500">{scheduleError}</p>
    if (!schedule) return <p>No schedule found</p>

    return (
        <div className="space-y-8 p-6">
            <div className="flex items-center justify-between">
                <TypographyH2>{schedule.scheduleName}</TypographyH2>
                <div className="flex gap-2">
                    <Button variant="outline">Edit</Button>
                    <Button variant="destructive">Delete</Button>
                </div>
            </div>

            <div className="space-y-2">
                <TypographyH4>Details</TypographyH4>
                <p className="text-muted-foreground">
                    Description: {schedule.description}
                </p>
                <p className="text-muted-foreground">
                    Duration: {schedule.startDate} – {schedule.endDate}
                </p>
            </div>

            {schedule.weeklySchedule && (
                <div className="space-y-2">
                    <TypographyH4>Weekly Schedule</TypographyH4>
                    <div className="border rounded-md divide-y">
                        {schedule.weeklySchedule.map((day) => (
                            <div key={day.day} className="flex py-2 px-3">
                                <span className="w-32 font-medium">
                                    {day.day}
                                </span>
                                {day.available ? (
                                    <div className="flex gap-8">
                                        {day.sessions.map((s, i) => (
                                            <div key={i}>
                                                <span>
                                                    {s.start} – {s.end}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground">
                                        Unavailable
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <TypographyH4>Assigned Students</TypographyH4>

                    <Button
                        size="sm"
                        variant="secondary"
                        onClick={handleOpenAssignStudents}
                    >
                        Assign Students
                    </Button>
                </div>

                <AssignStudentsDialog
                    isOpen={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    assignedStudents={assignedStudentsIds || []}
                    allStudents={allStudents}
                    onSave={handleAssignSave}
                    loading={studentsLoading}
                    disabled={updatingStudents}
                />

                {assignedStudentsLoading && (
                    <Loader2 className="animate-spin" />
                )}

                {assignedStudents?.length ? (
                    <ul className="list-disc list-inside">
                        {assignedStudents.map((student) => (
                            <li
                                key={student.studentID}
                                className="text-muted-foreground"
                            >
                                {student.displayName}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground">
                        No students assigned
                    </p>
                )}
            </div>
        </div>
    )
}
