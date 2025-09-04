import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import type { Student } from "@/types/user"

interface AssignStudentsDialogProps {
    scheduleId: string
    assignedStudents: string[]
    allStudents: Student[]
    loading?: boolean
    disabled?: boolean
    isOpen: boolean
    onOpen?: () => void
    onClose: () => void
    onSave: (students: string[]) => void
}

export function AssignStudentsDialog({
    scheduleId,
    assignedStudents,
    allStudents,
    loading = false,
    disabled,
    isOpen,
    onOpen,
    onClose,
    onSave,
}: AssignStudentsDialogProps) {
    console.log("🚀 ~ AssignStudentsDialog ~ allStudents:", allStudents)
    console.log("🚀 ~ AssignStudentsDialog ~ scheduleId:", scheduleId)
    const [selected, setSelected] = useState<string[]>(assignedStudents)

    useEffect(() => {
        setSelected(assignedStudents)
    }, [assignedStudents])

    const toggleStudent = (id: string) => {
        setSelected((prev) =>
            prev.includes(id)
                ? prev.filter((student) => student !== id)
                : [...prev, id]
        )
    }

    const handleSave = () => {
        onSave(selected)
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                if (open) onOpen?.()
                else onClose()
            }}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Assign Students</DialogTitle>
                    <DialogDescription>
                        Select students to assign to this schedule.
                    </DialogDescription>
                </DialogHeader>

                <div className="max-h-64 overflow-y-auto border rounded-md">
                    {loading ? (
                        <div className="flex items-center justify-center py-6">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : allStudents.length > 0 ? (
                        <div>
                            <div className="grid grid-cols-[auto_1fr_1fr] items-center gap-2 px-2 py-1 border-b text-sm font-medium text-muted-foreground">
                                <span></span>
                                <span>Student</span>
                                <span>Assigned Schedule</span>
                            </div>

                            <div className="space-y-1 p-2">
                                {allStudents.map((student) => {
                                    const isAssignedToAnotherSchedule =
                                        student.assignedSchedule?.id !==
                                            scheduleId &&
                                        !!student.assignedSchedule?.id

                                    return (
                                        <div
                                            key={student.studentID}
                                            className="grid grid-cols-[auto_1fr_1fr] items-center gap-2"
                                        >
                                            <Checkbox
                                                checked={selected.includes(
                                                    student.studentID
                                                )}
                                                onCheckedChange={() =>
                                                    toggleStudent(
                                                        student.studentID
                                                    )
                                                }
                                                disabled={
                                                    isAssignedToAnotherSchedule
                                                }
                                            />
                                            <span
                                                className={
                                                    isAssignedToAnotherSchedule
                                                        ? "text-muted-foreground"
                                                        : ""
                                                }
                                            >
                                                {student.displayName}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {student.assignedSchedule
                                                    ?.name || "-"}
                                            </span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground p-2">
                            No students available
                        </p>
                    )}
                </div>

                <DialogFooter>
                    <Button onClick={handleSave} disabled={disabled || loading}>
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
