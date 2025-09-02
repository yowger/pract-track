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
    assignedStudents,
    allStudents,
    loading = false,
    disabled,
    isOpen,
    onOpen,
    onClose,
    onSave,
}: AssignStudentsDialogProps) {
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

                <div className="space-y-2 max-h-64 overflow-y-auto border rounded-md p-2">
                    {loading ? (
                        <div className="flex items-center justify-center py-6">
                            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                        </div>
                    ) : allStudents.length > 0 ? (
                        allStudents.map((student) => (
                            <label
                                key={student.studentID}
                                className="flex items-center gap-2 cursor-pointer"
                            >
                                <Checkbox
                                    checked={selected.includes(
                                        student.studentID
                                    )}
                                    onCheckedChange={() =>
                                        toggleStudent(student.studentID)
                                    }
                                />
                                <span>{student.displayName}</span>
                            </label>
                        ))
                    ) : (
                        <p className="text-sm text-muted-foreground">
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
