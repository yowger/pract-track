import { type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Student } from "@/types/user"

export const assignedStudentColumns: ColumnDef<Student>[] = [
    {
        accessorKey: "student",
        header: "Student",
        cell: ({ row }) => {
            const student = row.original

            return (
                <div className="flex items-center gap-2">
                    {student.photoUrl ? (
                        <img
                            src={student.photoUrl}
                            alt={student.firstName}
                            className="h-8 w-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-gray-200" />
                    )}
                    <span>{`${student.firstName} ${student.lastName}`}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "program",
        header: "Program",
        cell: ({ row }) => {
            const program = row.original.program.toUpperCase()
            return program || <span className="text-muted-foreground">N/A</span>
        },
    },
    {
        accessorKey: "adviser",
        header: "Adviser",
        cell: () => {
            return ""
        },
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            const student = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => console.log("Review", student)}
                            className="flex items-center gap-2"
                        >
                            <span>Review</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
