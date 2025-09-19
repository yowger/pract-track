import { type ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Student } from "@/types/user"
import { firebaseTimestampToDate } from "../../../../lib/date-utils"
import { Timestamp } from "firebase/firestore"

interface AssignedStudentColumnsProps {
    agencyId?: string
    onSeeEvaluation?: (evaluationId: string) => void
    onCreateEvaluation?: (studentId: string) => void
    onStudentNameClick?: (studentId: string) => void
    onReportViolation?: (studentId: string, studentName: string) => void
}

export const assignedStudentColumns = ({
    agencyId,
    onSeeEvaluation,
    onCreateEvaluation,
    onStudentNameClick,
    onReportViolation,
}: AssignedStudentColumnsProps): ColumnDef<Student>[] => [
    {
        accessorKey: "student",
        header: "Student",
        size: 250,
        cell: ({ row }) => {
            const student = row.original

            const clickable = !!onStudentNameClick

            return (
                <div className="flex items-center gap-2">
                    {student.photoUrl ? (
                        <img
                            src={student.photoUrl}
                            alt={student.firstName}
                            className="h-6 w-6 rounded-full object-cover"
                        />
                    ) : (
                        <div className="h-6 w-6 rounded-full bg-gray-200" />
                    )}
                    <span
                        className={`truncate block max-w-[200px] ${
                            clickable ? "cursor-pointer hover:underline" : ""
                        }`}
                        onClick={() =>
                            clickable && onStudentNameClick?.(student.uid)
                        }
                    >
                        {`${student.firstName} ${student.lastName}`}
                    </span>
                </div>
            )
        },
    },
    {
        accessorKey: "program",
        header: "Program",
        size: 120,
        cell: ({ row }) => {
            const program = row.original.program?.toUpperCase()
            return (
                <span className="block max-w-[100px] truncate">
                    {program || (
                        <span className="text-muted-foreground">N/A</span>
                    )}
                </span>
            )
        },
    },
    {
        accessorKey: "adviser",
        header: "Adviser",
        size: 180,
        cell: () => {
            const adviser = undefined

            return adviser ? (
                <span className="truncate max-w-[150px] block">{adviser}</span>
            ) : (
                <span className="text-muted-foreground">N/A</span>
            )
        },
    },
    {
        accessorKey: "reviewed",
        header: "Reviewed By",
        size: 180,
        cell: ({ row }) => {
            if (!agencyId || !row.original.evaluations)
                return <span className="text-muted-foreground">N/A</span>
            const review = row.original.evaluations.find(
                (e) => e.agency?.id === agencyId
            )
            return review ? (
                <span className="truncate block max-w-[200px]">
                    {review.evaluator.name}
                </span>
            ) : (
                <span className="text-muted-foreground">N/A</span>
            )
        },
    },
    {
        accessorKey: "reviewedOn",
        header: "Reviewed On",
        size: 120,
        cell: ({ row }) => {
            if (!agencyId || !row.original.evaluations)
                return <span className="text-muted-foreground"></span>

            const review = row.original.evaluations.find(
                (e) => e.agency?.id === agencyId
            )

            if (!review || !review.createdAt) {
                return <span className="text-muted-foreground"></span>
            }

            const date =
                review.createdAt instanceof Date
                    ? review.createdAt.toLocaleDateString()
                    : review.createdAt instanceof Timestamp
                    ? firebaseTimestampToDate(
                          review.createdAt
                      )?.toLocaleDateString()
                    : ""

            return <span>{date}</span>
        },
    },
    {
        accessorKey: "violationCount",
        header: "Violations",
        size: 100,
        cell: ({ row }) => {
            const count = row.original.violationCount ?? 0
            return <span>{count > 0 ? count : ""}</span>
        },
    },
    {
        id: "actions",
        header: "",
        size: 56,
        cell: ({ row }) => {
            const student = row.original
            const evaluation = agencyId
                ? student.evaluations?.find((e) => e.agency?.id === agencyId)
                : undefined

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuGroup>
                            {evaluation ? (
                                <DropdownMenuItem
                                    onClick={() =>
                                        evaluation.agency.id &&
                                        onSeeEvaluation?.(
                                            evaluation.evaluator.docID
                                        )
                                    }
                                >
                                    See Evaluation
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem
                                    onClick={() =>
                                        onCreateEvaluation?.(student.uid)
                                    }
                                >
                                    Create Evaluation
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />

                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onClick={() =>
                                    onReportViolation?.(
                                        student.uid,
                                        student.displayName
                                            ? student.displayName
                                            : `${student.firstName} ${student.lastName}`
                                    )
                                }
                            >
                                Report Violation
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
