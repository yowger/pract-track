import { type ColumnDef } from "@tanstack/react-table"
import { Link } from "react-router-dom"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import type { Student } from "@/types/user"

export const studentColumns: ColumnDef<Student>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 20,
    },
    {
        accessorKey: "student",
        header: "Student",
        cell: ({ row }) => {
            const student = row.original
            const fullName = `${
                student.firstName.charAt(0).toUpperCase() +
                student.firstName.slice(1)
            } ${
                student.lastName.charAt(0).toUpperCase() +
                student.lastName.slice(1)
            }`

            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        {student.photoUrl ? (
                            <AvatarImage
                                src={student.photoUrl}
                                alt={fullName}
                            />
                        ) : (
                            <AvatarFallback>
                                {student.firstName?.[0]}
                                {student.lastName?.[0]}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <span className="font-medium">{fullName}</span>
                </div>
            )
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "program",
        header: "Program",
        cell: ({ row }) => {
            const program = row.getValue("program") as string
            return program ? (
                program.toUpperCase()
            ) : (
                <span className="text-muted-foreground">N/A</span>
            )
        },
    },
    {
        accessorKey: "assignedAgencyName",
        header: "Agency",
        cell: ({ row }) => {
            const agencyId = row.original.assignedAgencyID
            const agencyName = row.getValue("assignedAgencyName") as
                | string
                | null

            if (!agencyName) {
                return <span className="text-muted-foreground">Unassigned</span>
            }

            return agencyId ? (
                <Link
                    to={`/agencies/${agencyId}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                    {agencyName}
                </Link>
            ) : (
                agencyName
            )
        },
    },
    {
        accessorKey: "assignedAdviserName",
        header: "Adviser",
        cell: ({ row }) => {
            const agencyId = row.original.assignedAgencyID
            const adviserName = row.getValue("assignedAdviserName") as
                | string
                | null

            if (!adviserName) {
                return <span className="text-muted-foreground">Unassigned</span>
            }

            return agencyId ? (
                <Link
                    to={`/agencies/${agencyId}`}
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                    {adviserName}
                </Link>
            ) : (
                adviserName
            )
        },
    },
]
