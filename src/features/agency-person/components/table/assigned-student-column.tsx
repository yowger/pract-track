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
import { Link } from "react-router-dom"

export const assignedStudentColumns = (
    agencyId?: string
): ColumnDef<Student>[] => [
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
            const adviser = undefined

            return adviser || <span className="text-muted-foreground">N/A</span>
        },
    },
    {
        accessorKey: "reviewed",
        header: "Reviewed By",
        cell: ({ row }) => {
            if (!agencyId || !row.original.evaluations)
                return <span className="text-muted-foreground">N/A</span>
            const review = row.original.evaluations.find(
                (e) => e.agency?.id === agencyId
            )
            return review ? (
                <span>{review.evaluator.name}</span>
            ) : (
                <span className="text-muted-foreground">N/A</span>
            )
        },
    },
    {
        id: "actions",
        header: "",
        cell: ({ row }) => {
            const student = row.original
            const reviewExists = agencyId
                ? student.evaluations?.some((e) => e.agency?.id === agencyId)
                : false

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {reviewExists ? (
                            <DropdownMenuItem asChild>
                                <Link to={`/students/${student.uid}/review`}>
                                    See Evaluation
                                </Link>
                            </DropdownMenuItem>
                        ) : (
                            <DropdownMenuItem asChild>
                                <Link to={`/students/${student.uid}/review`}>
                                    Create Evaluation
                                </Link>
                            </DropdownMenuItem>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
